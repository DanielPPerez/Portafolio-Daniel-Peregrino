import type { ChatMessage, BusinessLineHint, QuoteEngine, QuoteTurn } from "./types"
import type { QuoteEstimate } from "./pricing-engine"

// Motor de cotización SIMULADO (solo UI). Devuelve respuestas guiadas a partir de guiones
// localizados — uno por línea de negocio — y deriva el estimado de las tarifas de servicios
// ya existentes en el diccionario i18n, para no duplicar precios (DRY).
//
// La UI envía `businessLineHint` desde el line-selector; el motor mock lo usa para elegir
// el guion correcto. Si el hint no viene (o no se puede inferir de la conversación), se
// intenta detectar por palabras clave; en último caso cae al guion de software.
//
// TODO: reemplazar por un ClaudeQuoteEngine que implemente la misma interfaz QuoteEngine
// (route handler `app/api/quote/route.ts` llamando a Gemini con GOOGLE_API_KEY).
// La UI no cambiará porque depende del contrato, no de esta implementación.

export type QuoteScriptStep = {
  reply: string
  requirements: string[]
  withEstimate?: boolean
}

export type QuoteScript = {
  steps: QuoteScriptStep[]
  fallback: string
}

export type MockQuoteConfig = {
  /** Guion de la línea de software. Normalmente `t.shadow.quote.scriptSoftware`. */
  softwareScript: QuoteScript
  /** Guion de la línea de reparación. Normalmente `t.shadow.quote.scriptRepair`. */
  repairScript: QuoteScript
  /**
   * Precios de servicios (p. ej. "$2,500 USD") para derivar el estimado sin duplicarlos.
   * Se usan para ambas líneas en el mock; el motor real delega a PricingEngine (Fase 3).
   */
  servicePrices: string[]
  /** Latencia simulada en ms (para mostrar el estado "escribiendo..."). */
  latencyMs?: number
  /**
   * Pista opcional de la UI. Si la conversación no da señales claras, este hint
   * determina qué guion se ejecuta. La UI ya lo manda en cada request.
   */
  businessLineHint?: BusinessLineHint
}

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const unique = (values: string[]): string[] => Array.from(new Set(values))

// "$2,500 USD" -> 2500 ; "$120 USD/h" -> null (omitimos tarifas por hora del rango)
function parsePrice(raw: string): number | null {
  if (raw.includes("/")) return null
  const match = raw.replace(/,/g, "").match(/\d+(\.\d+)?/)
  return match ? Number(match[0]) : null
}

// Detección barata por palabras clave para la rama mock; en el motor real esto lo hace
// el LLM extractor (Fase 4). Si el hint de la UI está, gana.
const REPAIR_KEYWORDS =
  /(pantalla|celular|teléfono|phone|tablet|consola|console|batería|battery|ipad|iphone|android|samsung|xbox|playstation|nintendo|mojado|water|no enciende|won.?t turn|broken|rot[oa])/i

function inferLine(history: ChatMessage[], hint?: BusinessLineHint): BusinessLineHint | "auto" {
  if (hint) return hint
  const userText = history
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join(" ")
  if (REPAIR_KEYWORDS.test(userText)) return "repair"
  return "auto"
}

export function createMockQuoteEngine(config: MockQuoteConfig): QuoteEngine {
  const { softwareScript, repairScript, servicePrices, latencyMs = 650, businessLineHint } = config

  const computeEstimate = (line: BusinessLineHint): QuoteEstimate => {
    const prices = servicePrices.map(parsePrice).filter((n): n is number => n !== null && n > 0)
    const baseUSD = prices.length ? Math.min(...prices) : 2500
    const maxUSD = Math.round(baseUSD * 1.8)
    const FX = 18.5
    const baseMXN = Math.round(baseUSD * FX)
    const maxMXN = Math.round(maxUSD * FX)
    return {
      referenceMXN: Math.round((baseMXN + maxMXN) / 2),
      lowMXN: baseMXN,
      highMXN: maxMXN,
      breakdown: [{ labelKey: "quoteCatalog.mock.serviceEstimate", amountMXN: baseMXN }],
      confidence: "calibrated",
      requiresManualReview: false,
      disclaimerKey:
        line === "repair"
          ? "quotePricing.disclaimer.repairLocalValidated"
          : "quotePricing.disclaimer.softwareCalibrated",
    }
  }

  return {
    async send(history: ChatMessage[]): Promise<QuoteTurn> {
      await delay(latencyMs)

      const userTurns = history.filter((m) => m.role === "user").length

      // Decide el guion: el hint de la UI manda; si no, detectamos por palabras clave.
      const inferred = inferLine(history, businessLineHint)
      const line: BusinessLineHint = inferred === "auto" ? "software" : inferred
      const script = line === "repair" ? repairScript : softwareScript
      const steps = script.steps

      // Sin mensajes del usuario aún: devolvemos el primer paso como apertura.
      if (userTurns <= 0) {
        return { reply: steps[0]?.reply ?? "", requirements: [] }
      }

      const reachedCount = Math.min(userTurns, steps.length)
      const reached = steps.slice(0, reachedCount)
      const requirements = unique(reached.flatMap((s) => s.requirements))
      const estimate = reached.some((s) => s.withEstimate) ? computeEstimate(line) : undefined

      // Más allá del guion: mantenemos requisitos/estimado y damos una respuesta de cierre.
      if (userTurns > steps.length) {
        return { reply: script.fallback, requirements, estimate }
      }

      return { reply: steps[userTurns - 1].reply, requirements, estimate }
    },
  }
}
