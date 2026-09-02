import { describe, expect, it, vi } from "vitest"
import { createQuoteEngine } from "./quote-engine"
import type { IntentExtractionResult } from "./intent-extractor"
import type { QuoteEstimate } from "./pricing-engine"

/**
 * Engine mockeado con un extractor y pricing que controlamos.
 * No hace llamadas a red ni a Supabase.
 */
function makeEngine(options: {
  extraction: IntentExtractionResult
  pricingEngine?: { calculate: (req: unknown) => Promise<QuoteEstimate> }
  locale?: "es" | "en"
  businessLineHint?: "software" | "repair"
  loadRepairCatalog?: () => Promise<{ repairTypeIds: string[]; addonIds: string[] }>
}) {
  return createQuoteEngine({
    extractor: vi.fn().mockResolvedValue(options.extraction),
    pricingEngine: options.pricingEngine,
    locale: options.locale,
    businessLineHint: options.businessLineHint,
    loadRepairCatalog:
      options.loadRepairCatalog ?? (async () => ({ repairTypeIds: [], addonIds: [] })),
  })
}

const UNAVAILABLE_REPAIR_ESTIMATE: QuoteEstimate = {
  referenceMXN: 0,
  lowMXN: 0,
  highMXN: 0,
  breakdown: [],
  confidence: "unavailable",
  requiresManualReview: true,
  disclaimerKey: "quotePricing.disclaimer.repairUnavailable",
}

const MANUAL_REVIEW_REPLY_ES =
  "Esto requiere una cotización manual — todavía no tengo datos de esa categoría."
const MANUAL_REVIEW_REPLY_EN =
  "This needs a manual quote — I don't have data for that category yet."

describe("createQuoteEngine — loop breaker y pricing fallback", () => {
  it("primer intento de repair con pricing que falla → manual review", async () => {
    const extraction: IntentExtractionResult = {
      businessLine: "repair",
      softwareModuleIds: [],
      repairFields: {
        deviceCategory: "phone",
        repairTypeId: "screen_replacement",
        qualityTier: "premium_original",
        addonIds: [],
      },
      readyForEstimate: true,
      replyText: "Confirmado, iPhone con pantalla rota.",
    }
    const engine = makeEngine({
      extraction,
      pricingEngine: { calculate: async () => UNAVAILABLE_REPAIR_ESTIMATE },
    })
    // No hay mensajes previos → no loop → devuelve manual review.
    const turn = await engine.send([{ role: "user", content: "hola" }])
    expect(turn.reply).toContain("cotización manual")
    expect(turn.estimate).toBeUndefined()
  })

  it("si ya se ofreció manual review y pricing sigue fallando → cierra con CTA (no repite)", async () => {
    const extraction: IntentExtractionResult = {
      businessLine: "repair",
      softwareModuleIds: [],
      repairFields: {
        deviceCategory: "phone",
        repairTypeId: "screen_replacement",
        qualityTier: "premium_original",
        addonIds: [],
      },
      readyForEstimate: true,
      replyText: "Confirmado.",
    }
    const engine = makeEngine({
      extraction,
      pricingEngine: { calculate: async () => UNAVAILABLE_REPAIR_ESTIMATE },
    })
    // El historial incluye un mensaje previo del asistente con la frase de manual review.
    const history = [
      { role: "user" as const, content: "reparación pantalla" },
      { role: "assistant" as const, content: MANUAL_REVIEW_REPLY_ES },
      { role: "user" as const, content: "claro" },
    ]
    const turn = await engine.send(history)
    // El loop-breaker cierra con CTA definitiva, no repite el mensaje de manual review.
    expect(turn.reply).toContain("Agendo la llamada")
    expect(turn.reply).not.toContain("cotización manual")
    expect(turn.estimate).toBeUndefined()
  })

  it("si ya se ofreció manual review (EN) y pricing sigue fallando → cierra con CTA en inglés", async () => {
    const extraction: IntentExtractionResult = {
      businessLine: "repair",
      softwareModuleIds: [],
      repairFields: {
        deviceCategory: "phone",
        repairTypeId: "screen_replacement",
        qualityTier: null,
        addonIds: [],
      },
      readyForEstimate: true,
      replyText: "Confirmed.",
    }
    const engine = makeEngine({
      extraction,
      locale: "en",
      pricingEngine: { calculate: async () => UNAVAILABLE_REPAIR_ESTIMATE },
    })
    const history = [
      { role: "user" as const, content: "broken screen" },
      { role: "assistant" as const, content: MANUAL_REVIEW_REPLY_EN },
      { role: "user" as const, content: "yes" },
    ]
    const turn = await engine.send(history)
    expect(turn.reply).toContain("I've scheduled the call")
    expect(turn.reply).not.toContain("manual quote")
  })

  it("si pricing devuelve unavailable pero NO se ofreció manual review aún → manual review normal", async () => {
    const extraction: IntentExtractionResult = {
      businessLine: "repair",
      softwareModuleIds: [],
      repairFields: {
        deviceCategory: "phone",
        repairTypeId: "unknown_type",
        qualityTier: null,
        addonIds: [],
      },
      readyForEstimate: true,
      replyText: "Confirmado.",
    }
    const engine = makeEngine({
      extraction,
      pricingEngine: { calculate: async () => UNAVAILABLE_REPAIR_ESTIMATE },
    })
    const turn = await engine.send([{ role: "user", content: "hola" }])
    expect(turn.reply).toContain("cotización manual")
  })
})
