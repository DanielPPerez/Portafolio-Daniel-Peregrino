import "server-only"
import {
  createPricingEngine,
  type PricingEngine,
  type QuoteEstimate,
  type QuoteRequest,
  DISCLAIMER_KEYS,
} from "./pricing-engine"
import {
  extractIntent,
  type ExtractIntentInput,
  type IntentExtractionResult,
  type IntentRepairFields,
} from "./intent-extractor"
import type { BusinessLineHint, ChatMessage, QuoteEngine, QuoteTurn } from "./types"
import {
  getRepairPriceReferences,
  getRepairServiceAddons,
  type DeviceCategory,
  type RepairServiceAddon,
} from "./repair-catalog"
import { softwareServiceCatalog } from "./catalog"

/**
 * QuoteEngine del cotizador (Fase 4). Orquesta el extractor de intención con el motor
 * determinístico de Fase 3. Separación estricta: el LLM NUNCA calcula precio.
 */

export type CreateQuoteEngineOptions = {
  pricingEngine?: PricingEngine
  extractor?: (input: ExtractIntentInput) => Promise<IntentExtractionResult>
  loadRepairCatalog?: () => Promise<{
    repairTypeIds: readonly string[]
    addonIds: readonly string[]
  }>
  businessLineHint?: BusinessLineHint
  /** Locale del cliente para que el LLM responda en el idioma correcto. */
  locale?: "es" | "en"
}

const defaultRepairCatalogLoader = async () => {
  // @sideffect lee Supabase; si las env vars faltan O Supabase falla (URL inválida, BD
  // caída, etc.), devuelve catálogos vacíos en vez de tirar el motor — la rama repair
  // caerá a "unavailable" / manual review por diseño (Fase 3).
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { repairTypeIds: [], addonIds: [] } as const
  }
  try {
    const phoneRefs = await getRepairPriceReferences("phone")
    const consoleRefs = await getRepairPriceReferences("console")
    const tabletRefs = await getRepairPriceReferences("tablet")
    const repairTypeIds = [
      ...new Set([...phoneRefs, ...consoleRefs, ...tabletRefs].map((r) => r.repairTypeId)),
    ]
    const addons = await getRepairServiceAddons()
    return { repairTypeIds, addonIds: addons.map((a: RepairServiceAddon) => a.addonId) }
  } catch (err) {
    // @sideffect no tirar el motor: la rama repair sin catálogo cae a manual review.
    console.error(
      JSON.stringify({
        op: "quote.repairCatalogLoad",
        err: (err as Error).message,
      }),
    )
    return { repairTypeIds: [], addonIds: [] } as const
  }
}

const manualReviewMessages = {
  es: {
    unavailable:
      "Esto requiere una cotización manual — todavía no tengo datos de esa categoría. ¿Te parece si agendamos una llamada?",
    unknownModule:
      "Tengo los módulos principales, pero mencionaste algo que no reconozco del catálogo. ¿Me confirmas qué incluye exactamente? Te lo paso a revisión manual.",
    generic:
      "Hubo un detalle que necesito validar antes de darte un número. ¿Me das un día? Te confirmo por correo.",
  },
  en: {
    unavailable:
      "This needs a manual quote — I don't have data for that category yet. Want to schedule a call?",
    unknownModule:
      "I have the main modules, but you mentioned something I don't recognize. Can you confirm what's included? I'll route this for manual review.",
    generic:
      "There's a detail I need to verify before giving you a number. Can I get back to you in a day by email?",
  },
} as const

const REQUIREMENT_LABELS = {
  es: { software: "Software", repair: "Reparación", addons: "Extras", pending: "(pendiente)" },
  en: { software: "Software", repair: "Repair", addons: "Add-ons", pending: "(pending)" },
} as const

/**
 * Frases del bot que indican que ya se ofreció (o se está ofreciendo) una cotización
 * manual. Se usan para el loop-breaker: si el usuario ya respondió a una de estas,
 * no se vuelve a preguntar.
 */
const MANUAL_REVIEW_MARKERS = ["cotización manual", "a manual quote", "requires manual review"]

type Locale = "es" | "en"

function composeManualReviewMessage(
  estimate: QuoteEstimate,
  locale: Locale,
  hasUnknownSoftwareModule: boolean,
): string {
  const dict = manualReviewMessages[locale]
  if (estimate.confidence === "unavailable") return dict.unavailable
  if (hasUnknownSoftwareModule) return dict.unknownModule
  return dict.generic
}

function buildRequirements(extraction: IntentExtractionResult, locale: Locale): string[] {
  const labels = REQUIREMENT_LABELS[locale]
  const reqs: string[] = []
  if (extraction.businessLine === "software") {
    reqs.push(`${labels.software}: ${extraction.softwareModuleIds.join(", ") || labels.pending}`)
  } else if (extraction.businessLine === "repair" && extraction.repairFields) {
    const r = extraction.repairFields
    reqs.push(
      `${labels.repair}: ${r.deviceCategory} → ${r.repairTypeId}${r.qualityTier ? ` (${r.qualityTier})` : ""}`,
    )
    if (r.addonIds.length > 0) reqs.push(`${labels.addons}: ${r.addonIds.join(", ")}`)
  }
  return reqs
}

function buildQuoteRequest(extraction: IntentExtractionResult): QuoteRequest | null {
  if (extraction.businessLine === "software") {
    if (extraction.softwareModuleIds.length === 0) return null
    return { line: "software", selectedModuleIds: extraction.softwareModuleIds }
  }
  if (extraction.businessLine === "repair" && extraction.repairFields) {
    const r: IntentRepairFields = extraction.repairFields
    return {
      line: "repair",
      deviceCategory: r.deviceCategory,
      repairTypeId: r.repairTypeId,
      qualityTier: r.qualityTier ?? undefined,
      addonIds: r.addonIds,
    }
  }
  return null
}

export function createQuoteEngine(options: CreateQuoteEngineOptions = {}): QuoteEngine {
  const pricingEngine = options.pricingEngine ?? createPricingEngine()
  const extractor = options.extractor ?? extractIntent
  const loadRepairCatalog = options.loadRepairCatalog ?? defaultRepairCatalogLoader
  const businessLineHint = options.businessLineHint
  const locale: Locale = options.locale ?? "es"

  return {
    async send(history: ChatMessage[]): Promise<QuoteTurn> {
      const validSoftwareModuleIds = softwareServiceCatalog.modules.map((m) => m.id)
      const { repairTypeIds, addonIds } = await loadRepairCatalog()

      // Si la línea de reparación fue forzada por hint pero el catálogo está vacío
      // (Supabase caído / sin datos), omitimos el hint: el extractor puede clasificar
      // libremente y no producir repair types inexistentes que luego rompan el schema.
      const effectiveHint =
        businessLineHint === "repair" && repairTypeIds.length === 0 ? undefined : businessLineHint

      let extraction: IntentExtractionResult
      try {
        extraction = await extractor({
          history,
          locale,
          validSoftwareModuleIds,
          validRepairTypeIds: repairTypeIds,
          validAddonIds: addonIds,
          businessLineHint: effectiveHint,
        })
      } catch (err) {
        // @sideffect log estructurado; serializamos para que no se aplane a {}.
        console.error(
          JSON.stringify({
            op: "quote.extractor",
            locale,
            hint: businessLineHint,
            err: (err as Error).message,
            stack: (err as Error).stack,
          }),
        )
        return {
          reply:
            locale === "es"
              ? "Tuve un problema procesando tu mensaje. ¿Lo intentamos de nuevo?"
              : "I had a problem processing your message. Can we try again?",
          requirements: [],
        }
      }

      const requirements = buildRequirements(extraction, locale)

      if (!extraction.readyForEstimate) {
        return { reply: extraction.replyText, requirements }
      }

      const request = buildQuoteRequest(extraction)
      if (!request) {
        return { reply: extraction.replyText, requirements }
      }

      // Detección de loop: ¿el asistente ya ofreció cotización manual en un turno previo?
      // Si el usuario ya confirmó (o rechazó), no volvemos a preguntar: cerramos con CTA.
      const assistantReplies = history.filter((m) => m.role === "assistant")
      const alreadyOfferedManualReview = assistantReplies.some((m) =>
        MANUAL_REVIEW_MARKERS.some((marker) => m.content.includes(marker)),
      )

      let estimate: QuoteEstimate
      try {
        estimate = await pricingEngine.calculate(request)
      } catch (err) {
        // @sideffect log estructurado; el motor de precios no debe hundir el cotizador.
        console.error(
          JSON.stringify({
            op: "quote.pricing",
            locale,
            line: request.line,
            err: (err as Error).message,
            stack: (err as Error).stack,
          }),
        )
        // Degradación gracefully: si el motor de precios lanza (p. ej. Supabase caído),
        // caemos a unavailable. El loop-breaker más abajo decide si repetir o cerrar.
        estimate = {
          referenceMXN: 0,
          lowMXN: 0,
          highMXN: 0,
          breakdown: [],
          confidence: "unavailable",
          requiresManualReview: true,
          disclaimerKey:
            request.line === "repair"
              ? DISCLAIMER_KEYS.REPAIR_UNAVAILABLE
              : DISCLAIMER_KEYS.SOFTWARE_HAS_UNKNOWN,
        }
      }

      // Loop breaker: si ya ofrecimos manual review y el estimate sigue sin datos,
      // cerramos con CTA definitiva (el usuario ya respondió "sí/claro").
      if (estimate.requiresManualReview && alreadyOfferedManualReview) {
        return {
          reply:
            locale === "es"
              ? "¡Perfecto! Agendo la llamada y confirmamos el precio final en taller. Te contactamos en menos de 24 horas."
              : "Perfect! I've scheduled the call and will confirm the final price in shop. We'll reach out within 24 hours.",
          requirements,
        }
      }

      if (estimate.requiresManualReview) {
        const hasUnknownSoftwareModule =
          request.line === "software" &&
          estimate.breakdown.length < request.selectedModuleIds.length
        return {
          reply: composeManualReviewMessage(estimate, locale, hasUnknownSoftwareModule),
          requirements,
        }
      }

      return { reply: extraction.replyText, requirements, estimate }
    },
  }
}

export type { DeviceCategory }
