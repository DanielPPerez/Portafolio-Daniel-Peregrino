import type { ChatMessage, Estimate, QuoteEngine, QuoteTurn } from "./types"

// Motor de cotización SIMULADO (solo UI). Devuelve respuestas guiadas a partir de un
// guion localizado y deriva el estimado de las tarifas de servicios ya existentes en el
// diccionario i18n, para no duplicar precios (DRY).
//
// TODO: reemplazar por un ClaudeQuoteEngine que implemente la misma interfaz QuoteEngine
// (route handler `app/api/quote/route.ts` llamando a `claude-opus-4-8` con ANTHROPIC_API_KEY).
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
  /** Guion de la conversación, normalmente `t.shadow.quote.script`. */
  script: QuoteScript
  /** Precios de servicios (p. ej. "$2,500 USD") para derivar el estimado sin duplicarlos. */
  servicePrices: string[]
  /** Latencia simulada en ms (para mostrar el estado "escribiendo..."). */
  latencyMs?: number
}

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const unique = (values: string[]): string[] => Array.from(new Set(values))

// "$2,500 USD" -> 2500 ; "$120 USD/h" -> null (omitimos tarifas por hora del rango)
function parsePrice(raw: string): number | null {
  if (raw.includes("/")) return null
  const match = raw.replace(/,/g, "").match(/\d+(\.\d+)?/)
  return match ? Number(match[0]) : null
}

export function createMockQuoteEngine(config: MockQuoteConfig): QuoteEngine {
  const { script, servicePrices, latencyMs = 650 } = config

  const computeEstimate = (): Estimate => {
    const prices = servicePrices.map(parsePrice).filter((n): n is number => n !== null && n > 0)
    const base = prices.length ? Math.min(...prices) : 2500
    return { min: base, max: Math.round(base * 1.8), currency: "USD" }
  }

  return {
    async send(history: ChatMessage[]): Promise<QuoteTurn> {
      await delay(latencyMs)

      const userTurns = history.filter((m) => m.role === "user").length
      const steps = script.steps

      // Sin mensajes del usuario aún: devolvemos el primer paso como apertura.
      if (userTurns <= 0) {
        return { reply: steps[0]?.reply ?? "", requirements: [] }
      }

      const reachedCount = Math.min(userTurns, steps.length)
      const reached = steps.slice(0, reachedCount)
      const requirements = unique(reached.flatMap((s) => s.requirements))
      const estimate = reached.some((s) => s.withEstimate) ? computeEstimate() : undefined

      // Más allá del guion: mantenemos requisitos/estimado y damos una respuesta de cierre.
      if (userTurns > steps.length) {
        return { reply: script.fallback, requirements, estimate }
      }

      return { reply: steps[userTurns - 1].reply, requirements, estimate }
    },
  }
}
