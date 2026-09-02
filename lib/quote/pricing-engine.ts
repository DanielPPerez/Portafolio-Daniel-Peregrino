/**
 * Motor de cálculo de precios (Fase 3).
 *
 * Función pura y determinística: toma un QuoteRequest (datos ya estructurados) y devuelve
 * un QuoteEstimate calculado únicamente desde los catálogos de Fase 1 (software) y Fase 2
 * (reparación). Cero LLM, cero heurísticas — la única forma de llegar a un número es
 * pasando por un catálogo. Si no hay match, devolvemos "unavailable" en vez de inventar.
 *
 * Separación extracción ≠ cálculo (ADR-0013): el LLM de Fase 4 SOLO clasifica texto libre
 * en este QuoteRequest. Esta función NUNCA recibe texto libre.
 */

import { softwareServiceCatalog, type SoftwareServiceCatalog } from "./catalog"
import {
  getRepairPriceReference,
  getRepairServiceAddon,
  type QualityTier,
  type RepairDataConfidence,
  type RepairPriceReference,
  type RepairServiceAddon,
} from "./repair-catalog"

export type QuoteLine = "software" | "repair"

export type SoftwareQuoteRequest = {
  line: "software"
  selectedModuleIds: string[]
}

export type RepairQuoteRequest = {
  line: "repair"
  deviceCategory: "phone" | "tablet" | "console"
  repairTypeId: string
  qualityTier?: "premium_original" | "economic_incell"
  addonIds: string[]
}

export type QuoteRequest = SoftwareQuoteRequest | RepairQuoteRequest

export type QuoteLineItem = {
  labelKey: string
  amountMXN: number
}

export type QuoteConfidence = "local_validated" | "market_reference" | "calibrated" | "unavailable"

export type QuoteEstimate = {
  referenceMXN: number
  lowMXN: number
  highMXN: number
  breakdown: QuoteLineItem[]
  /** De dónde salió el dato — le dice al usuario qué tan firme es el número. */
  confidence: QuoteConfidence
  /** true si el request no pudo resolverse con los catálogos — el cotizador (Fase 5) muestra
   *  "cotización manual" en vez de un número. */
  requiresManualReview: boolean
  disclaimerKey: string
}

export interface PricingEngine {
  calculate(request: QuoteRequest): Promise<QuoteEstimate>
}

/**
 * Variación simétrica aplicada al total de módulos de software para generar el rango min/max.
 * Catálogo calibrado con un solo proyecto de referencia (ADR-0011); 15% es un ancho modesto
 * que refleja la incertidumbre real entre proyectos sin diluir la señal del ancla.
 */
export const SOFTWARE_ESTIMATE_VARIANCE = 0.15

/**
 * Claves i18n de los disclaimers que el motor devuelve. La Fase 5 los traduce desde
 * lib/i18n/{es,en}.ts; este módulo no los importa para mantenerse puro.
 */
export const DISCLAIMER_KEYS = {
  SOFTWARE_OK: "quotePricing.disclaimer.softwareCalibrated",
  SOFTWARE_HAS_UNKNOWN: "quotePricing.disclaimer.softwareHasUnknownModule",
  SOFTWARE_EMPTY: "quotePricing.disclaimer.softwareEmptySelection",
  REPAIR_LOCAL: "quotePricing.disclaimer.repairLocalValidated",
  REPAIR_MARKET: "quotePricing.disclaimer.repairMarketReference",
  REPAIR_UNAVAILABLE: "quotePricing.disclaimer.repairUnavailable",
} as const

/**
 * Precios de referencia nacional embebidos como **fallback degradado**.
 * Se usan SOLO cuando el catálogo de Supabase NO responde (BD caída, URL inválida, etc.),
 * nunca como primera opción (ADR-0012: el catálogo Supabase es la fuente de verdad).
 *
 * Si el repairTypeId está en esta tabla, devolvemos `confidence: "market_reference"`
 * (precio orientativo nacional, pendiente validación local) en vez de "unavailable".
 * Esto evita que una Supabase caída congele el cotizador en "cotización manual" eterno.
 *
 * Los valores provienen de `supabase/seeds/05_repair_price_references.sql` (punto medio
 * de cada fila); la tabla está clave por repairTypeId con variante por qualityTier
 * cuando aplica (pantallas).
 */
type FallbackReference = {
  referencePriceMXN: number
  priceRangeMinMXN: number
  priceRangeMaxMXN: number
  nameKey: string
  dataConfidence: RepairDataConfidence
}

const REPAIR_FALLBACK_PRICES: Record<string, FallbackReference> = {
  screen_replacement: {
    referencePriceMXN: 1450,
    priceRangeMinMXN: 1200,
    priceRangeMaxMXN: 3500,
    nameKey: "quoteCatalog.repairs.phone.screen",
    dataConfidence: "market_reference",
  },
  battery_replacement: {
    referencePriceMXN: 750,
    priceRangeMinMXN: 500,
    priceRangeMaxMXN: 1500,
    nameKey: "quoteCatalog.repairs.phone.battery",
    dataConfidence: "market_reference",
  },
  charging_port: {
    referencePriceMXN: 500,
    priceRangeMinMXN: 300,
    priceRangeMaxMXN: 1000,
    nameKey: "quoteCatalog.repairs.phone.chargingPort",
    dataConfidence: "market_reference",
  },
  diagnostics: {
    referencePriceMXN: 250,
    priceRangeMinMXN: 0,
    priceRangeMaxMXN: 500,
    nameKey: "quoteCatalog.repairs.phone.diagnostics",
    dataConfidence: "market_reference",
  },
  power_issue: {
    referencePriceMXN: 800,
    priceRangeMinMXN: 500,
    priceRangeMaxMXN: 1500,
    nameKey: "quoteCatalog.repairs.console.powerSupply",
    dataConfidence: "market_reference",
  },
  console_diagnostics: {
    referencePriceMXN: 200,
    priceRangeMinMXN: 0,
    priceRangeMaxMXN: 400,
    nameKey: "quoteCatalog.repairs.console.diagnostics",
    dataConfidence: "market_reference",
  },
  water_damage: {
    referencePriceMXN: 1800,
    priceRangeMinMXN: 1000,
    priceRangeMaxMXN: 3000,
    nameKey: "quoteCatalog.repairs.phone.waterResistance",
    dataConfidence: "market_reference",
  },
  data_recovery: {
    referencePriceMXN: 2500,
    priceRangeMinMXN: 1000,
    priceRangeMaxMXN: 5000,
    nameKey: "quoteCatalog.repairs.phone.dataRecovery",
    dataConfidence: "market_reference",
  },
}

export type RepairCatalogPort = {
  getRepairPriceReference: (
    deviceCategory: "phone" | "tablet" | "console",
    repairTypeId: string,
    qualityTier?: QualityTier,
  ) => Promise<RepairPriceReference | null>
  getRepairServiceAddon: (addonId: string) => Promise<RepairServiceAddon | null>
}

export type PricingEngineOptions = {
  softwareCatalog?: SoftwareServiceCatalog
  repairCatalog?: RepairCatalogPort
}

const defaultRepairCatalog: RepairCatalogPort = {
  getRepairPriceReference,
  getRepairServiceAddon,
}

export function createPricingEngine(options: PricingEngineOptions = {}): PricingEngine {
  const softwareCatalog = options.softwareCatalog ?? softwareServiceCatalog
  const repairCatalog = options.repairCatalog ?? defaultRepairCatalog

  return {
    async calculate(request: QuoteRequest): Promise<QuoteEstimate> {
      if (request.line === "software") {
        return calculateSoftware(request, softwareCatalog)
      }
      return calculateRepair(request, repairCatalog)
    },
  }
}

function calculateSoftware(
  request: SoftwareQuoteRequest,
  catalog: SoftwareServiceCatalog,
): QuoteEstimate {
  const { selectedModuleIds } = request

  if (selectedModuleIds.length === 0) {
    return {
      referenceMXN: 0,
      lowMXN: 0,
      highMXN: 0,
      breakdown: [],
      confidence: "calibrated",
      requiresManualReview: true,
      disclaimerKey: DISCLAIMER_KEYS.SOFTWARE_EMPTY,
    }
  }

  const moduleById = new Map(catalog.modules.map((m) => [m.id, m]))
  const breakdown: QuoteLineItem[] = []
  let referenceMXN = 0
  let unknownCount = 0

  for (const id of selectedModuleIds) {
    const mod = moduleById.get(id)
    if (!mod) {
      unknownCount += 1
      continue
    }
    const price = catalog.baseModulePriceMXN * catalog.complexityMultiplier[mod.complexity]
    referenceMXN += price
    breakdown.push({ labelKey: mod.nameKey, amountMXN: price })
  }

  const variance = referenceMXN * SOFTWARE_ESTIMATE_VARIANCE
  const lowMXN = Math.round(referenceMXN - variance)
  const highMXN = Math.round(referenceMXN + variance)

  return {
    referenceMXN,
    lowMXN,
    highMXN,
    breakdown,
    confidence: "calibrated",
    requiresManualReview: unknownCount > 0,
    disclaimerKey:
      unknownCount > 0 ? DISCLAIMER_KEYS.SOFTWARE_HAS_UNKNOWN : DISCLAIMER_KEYS.SOFTWARE_OK,
  }
}

async function calculateRepair(
  request: RepairQuoteRequest,
  catalog: RepairCatalogPort,
): Promise<QuoteEstimate> {
  let reference: RepairPriceReference | null
  try {
    reference = await catalog.getRepairPriceReference(
      request.deviceCategory,
      request.repairTypeId,
      request.qualityTier,
    )
  } catch (err) {
    // @sideffect Supabase caído: caímos a precios de referencia nacional embebidos.
    console.error(
      JSON.stringify({
        op: "pricing.repairCatalogThrow",
        repairTypeId: request.repairTypeId,
        deviceCategory: request.deviceCategory,
        err: (err as Error).message,
      }),
    )
    return calculateRepairFallback(request)
  }

  // El catálogo respondió pero no hay fila para este repair (null) → unavailable real.
  if (!reference) {
    return {
      referenceMXN: 0,
      lowMXN: 0,
      highMXN: 0,
      breakdown: [],
      confidence: "unavailable",
      requiresManualReview: true,
      disclaimerKey: DISCLAIMER_KEYS.REPAIR_UNAVAILABLE,
    }
  }

  const breakdown: QuoteLineItem[] = [
    { labelKey: reference.nameKey, amountMXN: reference.referencePriceMXN },
  ]
  let referenceMXN = reference.referencePriceMXN
  let lowMXN = reference.priceRangeMinMXN
  let highMXN = reference.priceRangeMaxMXN

  for (const addonId of request.addonIds) {
    const addon = await catalog.getRepairServiceAddon(addonId)
    if (!addon) continue
    referenceMXN += addon.priceMXN
    lowMXN += addon.priceMXN
    highMXN += addon.priceMXN
    breakdown.push({ labelKey: addon.nameKey, amountMXN: addon.priceMXN })
  }

  return {
    referenceMXN,
    lowMXN,
    highMXN,
    breakdown,
    confidence: reference.dataConfidence as RepairDataConfidence,
    requiresManualReview: false,
    disclaimerKey:
      reference.dataConfidence === "market_reference"
        ? DISCLAIMER_KEYS.REPAIR_MARKET
        : DISCLAIMER_KEYS.REPAIR_LOCAL,
  }
}

/**
 * Fallback degradado para repair cuando Supabase lanza (no cuando devuelve null).
 * Usa precios de referencia nacional embebidos. Para repairTypeId CONOCIDO,
 * devuelve confidence "market_reference" con un número real y requiresManualReview=false
 * (el frontend muestra el precio + botón de agendar) — así el cotizador no se estanca.
 * Para repairTypeId DESCONOCIDO, devuelve unavailable + requiresManualReview=true
 * (genuine manual review, ni se inventa un precio).
 */
function calculateRepairFallback(request: RepairQuoteRequest): QuoteEstimate {
  const fallback = REPAIR_FALLBACK_PRICES[request.repairTypeId]
  if (fallback) {
    const breakdown: QuoteLineItem[] = [
      { labelKey: fallback.nameKey, amountMXN: fallback.referencePriceMXN },
    ]

    // Los addons no vienen del catálogo en fallback; el usuario los agrega en la llamada.
    void request.addonIds

    return {
      referenceMXN: fallback.referencePriceMXN,
      lowMXN: fallback.priceRangeMinMXN,
      highMXN: fallback.priceRangeMaxMXN,
      breakdown,
      confidence: fallback.dataConfidence,
      requiresManualReview: false,
      disclaimerKey: DISCLAIMER_KEYS.REPAIR_MARKET,
    }
  }

  // repairTypeId desconocido → unavailable real (no inventamos precios).
  return {
    referenceMXN: 0,
    lowMXN: 0,
    highMXN: 0,
    breakdown: [],
    confidence: "unavailable",
    requiresManualReview: true,
    disclaimerKey: DISCLAIMER_KEYS.REPAIR_UNAVAILABLE,
  }
}
