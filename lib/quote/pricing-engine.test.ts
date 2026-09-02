import { describe, expect, it, vi } from "vitest"
import {
  createPricingEngine,
  DISCLAIMER_KEYS,
  SOFTWARE_ESTIMATE_VARIANCE,
  type PricingEngineOptions,
  type QuoteRequest,
  type RepairCatalogPort,
} from "./pricing-engine"
import type { SoftwareServiceCatalog } from "./catalog"
import type {
  QualityTier,
  RepairDataConfidence,
  RepairPriceReference,
  RepairServiceAddon,
} from "./repair-catalog"

const testSoftwareCatalog: SoftwareServiceCatalog = {
  baseModulePriceMXN: 10_000,
  complexityMultiplier: { simple: 0.5, medium: 1, complex: 2 },
  modules: [
    { id: "a-simple", nameKey: "test.a", complexity: "simple" },
    { id: "b-medium", nameKey: "test.b", complexity: "medium" },
    { id: "c-complex", nameKey: "test.c", complexity: "complex" },
  ],
}

const phoneScreenPremium: RepairPriceReference = {
  id: "ref-1",
  deviceCategory: "phone",
  repairTypeId: "screen_replacement",
  nameKey: "test.phone.screen",
  qualityTier: "premium_original",
  referencePriceMXN: 1450,
  priceRangeMinMXN: 1200,
  priceRangeMaxMXN: 3500,
  dataConfidence: "local_validated",
  notes: null,
}

const phoneScreenIncell: RepairPriceReference = {
  id: "ref-2",
  deviceCategory: "phone",
  repairTypeId: "screen_replacement",
  nameKey: "test.phone.screen",
  qualityTier: "economic_incell",
  referencePriceMXN: 750,
  priceRangeMinMXN: 600,
  priceRangeMaxMXN: 950,
  dataConfidence: "local_validated",
  notes: null,
}

const phoneBattery: RepairPriceReference = {
  id: "ref-3",
  deviceCategory: "phone",
  repairTypeId: "battery_replacement",
  nameKey: "test.phone.battery",
  qualityTier: null,
  referencePriceMXN: 750,
  priceRangeMinMXN: 500,
  priceRangeMaxMXN: 1500,
  dataConfidence: "local_validated",
  notes: null,
}

const consoleJoystick: RepairPriceReference = {
  id: "ref-4",
  deviceCategory: "console",
  repairTypeId: "console_joystick_drift",
  nameKey: "test.console.joystick",
  qualityTier: null,
  referencePriceMXN: 500,
  priceRangeMinMXN: 350,
  priceRangeMaxMXN: 700,
  dataConfidence: "market_reference",
  notes: null,
}

const addonHomePickup: RepairServiceAddon = {
  id: "addon-1",
  addonId: "home_pickup_delivery",
  nameKey: "test.addon.home",
  priceMXN: 100,
}

function makeFakeRepairCatalog(
  refs: RepairPriceReference[],
  addons: RepairServiceAddon[] = [],
): RepairCatalogPort {
  return {
    getRepairPriceReference: vi.fn(
      async (
        deviceCategory: "phone" | "tablet" | "console",
        repairTypeId: string,
        qualityTier?: QualityTier,
      ): Promise<RepairPriceReference | null> => {
        return (
          refs.find((r) => {
            if (r.deviceCategory !== deviceCategory) return false
            if (r.repairTypeId !== repairTypeId) return false
            if ((r.qualityTier ?? null) !== (qualityTier ?? null)) return false
            return true
          }) ?? null
        )
      },
    ),
    getRepairServiceAddon: vi.fn(async (addonId: string): Promise<RepairServiceAddon | null> => {
      return addons.find((a) => a.addonId === addonId) ?? null
    }),
  }
}

function makeEngine(repairCatalog: RepairCatalogPort): ReturnType<typeof createPricingEngine> {
  const options: PricingEngineOptions = {
    softwareCatalog: testSoftwareCatalog,
    repairCatalog,
  }
  return createPricingEngine(options)
}

describe("pricing engine — software", () => {
  it("1 módulo simple", async () => {
    const engine = makeEngine(makeFakeRepairCatalog([]))
    const estimate = await engine.calculate({
      line: "software",
      selectedModuleIds: ["a-simple"],
    })
    expect(estimate.referenceMXN).toBe(5_000)
    expect(estimate.lowMXN).toBe(Math.round(5_000 * (1 - SOFTWARE_ESTIMATE_VARIANCE)))
    expect(estimate.highMXN).toBe(Math.round(5_000 * (1 + SOFTWARE_ESTIMATE_VARIANCE)))
    expect(estimate.breakdown).toEqual([{ labelKey: "test.a", amountMXN: 5_000 }])
    expect(estimate.confidence).toBe("calibrated")
    expect(estimate.requiresManualReview).toBe(false)
    expect(estimate.disclaimerKey).toBe(DISCLAIMER_KEYS.SOFTWARE_OK)
  })

  it("1 módulo complex", async () => {
    const engine = makeEngine(makeFakeRepairCatalog([]))
    const estimate = await engine.calculate({
      line: "software",
      selectedModuleIds: ["c-complex"],
    })
    expect(estimate.referenceMXN).toBe(20_000)
    expect(estimate.lowMXN).toBe(17_000)
    expect(estimate.highMXN).toBe(23_000)
  })

  it("combinación de varios módulos", async () => {
    const engine = makeEngine(makeFakeRepairCatalog([]))
    const estimate = await engine.calculate({
      line: "software",
      selectedModuleIds: ["a-simple", "b-medium", "c-complex"],
    })
    expect(estimate.referenceMXN).toBe(35_000)
    expect(estimate.lowMXN).toBe(Math.round(35_000 * 0.85))
    expect(estimate.highMXN).toBe(Math.round(35_000 * 1.15))
    expect(estimate.breakdown).toHaveLength(3)
    expect(estimate.breakdown.map((b) => b.labelKey)).toEqual(["test.a", "test.b", "test.c"])
  })

  it("moduleId desconocido marca manual review pero sigue calculando los reconocidos", async () => {
    const engine = makeEngine(makeFakeRepairCatalog([]))
    const estimate = await engine.calculate({
      line: "software",
      selectedModuleIds: ["b-medium", "unknown-xyz"],
    })
    expect(estimate.referenceMXN).toBe(10_000)
    expect(estimate.breakdown).toHaveLength(1)
    expect(estimate.requiresManualReview).toBe(true)
    expect(estimate.disclaimerKey).toBe(DISCLAIMER_KEYS.SOFTWARE_HAS_UNKNOWN)
  })

  it("todos los moduleId desconocidos: ref 0 + manual review", async () => {
    const engine = makeEngine(makeFakeRepairCatalog([]))
    const estimate = await engine.calculate({
      line: "software",
      selectedModuleIds: ["x", "y"],
    })
    expect(estimate.referenceMXN).toBe(0)
    expect(estimate.lowMXN).toBe(0)
    expect(estimate.highMXN).toBe(0)
    expect(estimate.breakdown).toEqual([])
    expect(estimate.requiresManualReview).toBe(true)
  })

  it("lista vacía: manual review, 0, sin mínimo de cortesía", async () => {
    const engine = makeEngine(makeFakeRepairCatalog([]))
    const estimate = await engine.calculate({ line: "software", selectedModuleIds: [] })
    expect(estimate.referenceMXN).toBe(0)
    expect(estimate.lowMXN).toBe(0)
    expect(estimate.highMXN).toBe(0)
    expect(estimate.breakdown).toEqual([])
    expect(estimate.requiresManualReview).toBe(true)
    expect(estimate.disclaimerKey).toBe(DISCLAIMER_KEYS.SOFTWARE_EMPTY)
  })
})

describe("pricing engine — repair", () => {
  it("phone con quality_tier premium_original", async () => {
    const engine = makeEngine(makeFakeRepairCatalog([phoneScreenPremium]))
    const estimate = await engine.calculate({
      line: "repair",
      deviceCategory: "phone",
      repairTypeId: "screen_replacement",
      qualityTier: "premium_original",
      addonIds: [],
    })
    expect(estimate.referenceMXN).toBe(1450)
    expect(estimate.lowMXN).toBe(1200)
    expect(estimate.highMXN).toBe(3500)
    expect(estimate.confidence).toBe("local_validated")
    expect(estimate.requiresManualReview).toBe(false)
    expect(estimate.disclaimerKey).toBe(DISCLAIMER_KEYS.REPAIR_LOCAL)
    expect(estimate.breakdown).toEqual([{ labelKey: "test.phone.screen", amountMXN: 1450 }])
  })

  it("phone con quality_tier economic_incell", async () => {
    const engine = makeEngine(makeFakeRepairCatalog([phoneScreenIncell]))
    const estimate = await engine.calculate({
      line: "repair",
      deviceCategory: "phone",
      repairTypeId: "screen_replacement",
      qualityTier: "economic_incell",
      addonIds: [],
    })
    expect(estimate.referenceMXN).toBe(750)
    expect(estimate.lowMXN).toBe(600)
    expect(estimate.highMXN).toBe(950)
    expect(estimate.confidence).toBe("local_validated")
  })

  it("phone sin quality_tier", async () => {
    const engine = makeEngine(makeFakeRepairCatalog([phoneBattery]))
    const estimate = await engine.calculate({
      line: "repair",
      deviceCategory: "phone",
      repairTypeId: "battery_replacement",
      addonIds: [],
    })
    expect(estimate.referenceMXN).toBe(750)
    expect(estimate.lowMXN).toBe(500)
    expect(estimate.highMXN).toBe(1500)
    expect(estimate.confidence).toBe("local_validated")
    expect(estimate.breakdown).toHaveLength(1)
  })

  it("phone con add-on: suma al ref, low y high por igual", async () => {
    const engine = makeEngine(makeFakeRepairCatalog([phoneBattery], [addonHomePickup]))
    const estimate = await engine.calculate({
      line: "repair",
      deviceCategory: "phone",
      repairTypeId: "battery_replacement",
      addonIds: ["home_pickup_delivery"],
    })
    expect(estimate.referenceMXN).toBe(850)
    expect(estimate.lowMXN).toBe(600)
    expect(estimate.highMXN).toBe(1600)
    expect(estimate.breakdown).toEqual([
      { labelKey: "test.phone.battery", amountMXN: 750 },
      { labelKey: "test.addon.home", amountMXN: 100 },
    ])
  })

  it("console con add-on: confidence market_reference, disclaimer REPAIR_MARKET", async () => {
    const engine = makeEngine(makeFakeRepairCatalog([consoleJoystick], [addonHomePickup]))
    const estimate = await engine.calculate({
      line: "repair",
      deviceCategory: "console",
      repairTypeId: "console_joystick_drift",
      addonIds: ["home_pickup_delivery"],
    })
    expect(estimate.referenceMXN).toBe(600)
    expect(estimate.lowMXN).toBe(450)
    expect(estimate.highMXN).toBe(800)
    expect(estimate.confidence).toBe("market_reference")
    expect(estimate.disclaimerKey).toBe(DISCLAIMER_KEYS.REPAIR_MARKET)
  })

  it("console sin add-ons: una sola línea en breakdown", async () => {
    const engine = makeEngine(makeFakeRepairCatalog([consoleJoystick]))
    const estimate = await engine.calculate({
      line: "repair",
      deviceCategory: "console",
      repairTypeId: "console_joystick_drift",
      addonIds: [],
    })
    expect(estimate.breakdown).toHaveLength(1)
    expect(estimate.confidence).toBe("market_reference")
  })

  it("tablet devuelve unavailable (sin filas en el catálogo)", async () => {
    const engine = makeEngine(makeFakeRepairCatalog([]))
    const estimate = await engine.calculate({
      line: "repair",
      deviceCategory: "tablet",
      repairTypeId: "screen_replacement",
      addonIds: [],
    })
    expect(estimate.referenceMXN).toBe(0)
    expect(estimate.lowMXN).toBe(0)
    expect(estimate.highMXN).toBe(0)
    expect(estimate.confidence).toBe("unavailable")
    expect(estimate.requiresManualReview).toBe(true)
    expect(estimate.disclaimerKey).toBe(DISCLAIMER_KEYS.REPAIR_UNAVAILABLE)
    expect(estimate.breakdown).toEqual([])
  })

  it("repairTypeId inexistente devuelve unavailable", async () => {
    const engine = makeEngine(makeFakeRepairCatalog([phoneBattery]))
    const estimate = await engine.calculate({
      line: "repair",
      deviceCategory: "phone",
      repairTypeId: "nope_does_not_exist",
      addonIds: [],
    })
    expect(estimate.confidence).toBe("unavailable")
    expect(estimate.requiresManualReview).toBe(true)
    expect(estimate.disclaimerKey).toBe(DISCLAIMER_KEYS.REPAIR_UNAVAILABLE)
  })

  it("add-on desconocido se ignora sin escalar a manual review", async () => {
    const engine = makeEngine(makeFakeRepairCatalog([phoneBattery]))
    const estimate = await engine.calculate({
      line: "repair",
      deviceCategory: "phone",
      repairTypeId: "battery_replacement",
      addonIds: ["unknown_addon"],
    })
    expect(estimate.referenceMXN).toBe(750)
    expect(estimate.requiresManualReview).toBe(false)
    expect(estimate.breakdown).toEqual([{ labelKey: "test.phone.battery", amountMXN: 750 }])
  })
})

describe("pricing engine — invariantes", () => {
  const happyCases: Array<{ name: string; build: () => QuoteRequest }> = [
    {
      name: "software: 1 simple",
      build: () => ({ line: "software", selectedModuleIds: ["a-simple"] }),
    },
    {
      name: "software: mezcla",
      build: () => ({ line: "software", selectedModuleIds: ["a-simple", "b-medium", "c-complex"] }),
    },
    {
      name: "repair: phone con quality_tier",
      build: () => ({
        line: "repair",
        deviceCategory: "phone",
        repairTypeId: "screen_replacement",
        qualityTier: "premium_original",
        addonIds: [],
      }),
    },
    {
      name: "repair: console con add-on",
      build: () => ({
        line: "repair",
        deviceCategory: "console",
        repairTypeId: "console_joystick_drift",
        addonIds: ["home_pickup_delivery"],
      }),
    },
  ]

  it.each(happyCases)("low <= reference <= high en $name", async ({ build }) => {
    const engine = makeEngine(
      makeFakeRepairCatalog(
        [phoneScreenPremium, phoneScreenIncell, phoneBattery, consoleJoystick],
        [addonHomePickup],
      ),
    )
    const estimate = await engine.calculate(build())
    expect(estimate.lowMXN).toBeLessThanOrEqual(estimate.referenceMXN)
    expect(estimate.referenceMXN).toBeLessThanOrEqual(estimate.highMXN)
  })

  it("requiresManualReview=false solo cuando hubo match real", async () => {
    const engine = makeEngine(makeFakeRepairCatalog([phoneBattery]))
    const happy = await engine.calculate({
      line: "repair",
      deviceCategory: "phone",
      repairTypeId: "battery_replacement",
      addonIds: [],
    })
    expect(happy.requiresManualReview).toBe(false)

    const unavailable = await engine.calculate({
      line: "repair",
      deviceCategory: "tablet",
      repairTypeId: "screen_replacement",
      addonIds: [],
    })
    expect(unavailable.requiresManualReview).toBe(true)

    const unknownType = await engine.calculate({
      line: "repair",
      deviceCategory: "phone",
      repairTypeId: "does_not_exist",
      addonIds: [],
    })
    expect(unknownType.requiresManualReview).toBe(true)

    const emptySelection = await engine.calculate({ line: "software", selectedModuleIds: [] })
    expect(emptySelection.requiresManualReview).toBe(true)

    const unknownModule = await engine.calculate({
      line: "software",
      selectedModuleIds: ["b-medium", "missing"],
    })
    expect(unknownModule.requiresManualReview).toBe(true)
  })
})

describe("pricing engine — confianza se preserva", () => {
  it.each<[RepairDataConfidence, string]>([
    ["local_validated", DISCLAIMER_KEYS.REPAIR_LOCAL],
    ["market_reference", DISCLAIMER_KEYS.REPAIR_MARKET],
  ])("data_confidence=%s -> disclaimer correcto", async (confidence, expectedKey) => {
    const ref: RepairPriceReference = {
      id: "r",
      deviceCategory: "phone",
      repairTypeId: "battery_replacement",
      nameKey: "test.phone.battery",
      qualityTier: null,
      referencePriceMXN: 750,
      priceRangeMinMXN: 500,
      priceRangeMaxMXN: 1500,
      dataConfidence: confidence,
      notes: null,
    }
    const engine = makeEngine(makeFakeRepairCatalog([ref]))
    const estimate = await engine.calculate({
      line: "repair",
      deviceCategory: "phone",
      repairTypeId: "battery_replacement",
      addonIds: [],
    })
    expect(estimate.confidence).toBe(confidence)
    expect(estimate.disclaimerKey).toBe(expectedKey)
  })
})

describe("pricing engine — fallback degradado cuando Supabase lanza", () => {
  function makeThrowingCatalog(): RepairCatalogPort {
    return {
      getRepairPriceReference: vi.fn(() => {
        throw new Error("Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.")
      }),
      getRepairServiceAddon: vi.fn(async () => null),
    }
  }

  it("repairTypeId conocido → fallback market_reference con precio real, no manual review", async () => {
    const engine = makeEngine(makeThrowingCatalog())
    const estimate = await engine.calculate({
      line: "repair",
      deviceCategory: "phone",
      repairTypeId: "screen_replacement",
      qualityTier: "premium_original",
      addonIds: [],
    })
    expect(estimate.confidence).toBe("market_reference")
    expect(estimate.requiresManualReview).toBe(false)
    expect(estimate.lowMXN).toBe(1200)
    expect(estimate.highMXN).toBe(3500)
    expect(estimate.referenceMXN).toBe(1450)
    expect(estimate.breakdown).toHaveLength(1)
    expect(estimate.breakdown[0].labelKey).toBe("quoteCatalog.repairs.phone.screen")
    expect(estimate.disclaimerKey).toBe(DISCLAIMER_KEYS.REPAIR_MARKET)
  })

  it("repairTypeId desconocido → unavailable, no inventamos precio", async () => {
    const engine = makeEngine(makeThrowingCatalog())
    const estimate = await engine.calculate({
      line: "repair",
      deviceCategory: "phone",
      repairTypeId: "some_unknown_repair",
      addonIds: [],
    })
    expect(estimate.confidence).toBe("unavailable")
    expect(estimate.requiresManualReview).toBe(true)
    expect(estimate.referenceMXN).toBe(0)
    expect(estimate.disclaimerKey).toBe(DISCLAIMER_KEYS.REPAIR_UNAVAILABLE)
  })

  it("console_diagnostics también tiene fallback", async () => {
    const engine = makeEngine(makeThrowingCatalog())
    const estimate = await engine.calculate({
      line: "repair",
      deviceCategory: "console",
      repairTypeId: "power_issue",
      addonIds: [],
    })
    expect(estimate.confidence).toBe("market_reference")
    expect(estimate.lowMXN).toBe(500)
    expect(estimate.highMXN).toBe(1500)
  })
})
