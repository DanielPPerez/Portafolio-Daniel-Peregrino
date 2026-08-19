import { NextResponse } from "next/server"
import { z } from "zod"
import { isQuoteAiConfigured, runQuoteTurn } from "@/lib/quote/claude"
import { es } from "@/lib/i18n/es"
import { en } from "@/lib/i18n/en"
import { createMockQuoteEngine } from "@/lib/quote/mock-engine"
import type { QuoteScript } from "@/lib/quote/mock-engine"

const bodySchema = z.object({
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .min(1)
    .max(50),
  locale: z.enum(["es", "en"]).optional(),
})

/** Cotizador IA: recibe el historial y devuelve la respuesta de Claude (o fallback mock si no está configurado). */
export async function POST(req: Request) {
  // Parsing común al inicio
  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 })
  }

  if (!isQuoteAiConfigured()) {
    // Fallback al motor mock usando el diccionario del idioma solicitado
    const locale = parsed.data.locale ?? "es"
    const dict = locale === "es" ? es : en
    const script: QuoteScript = dict.shadow.quote.script

    // Obtener precios de servicios (en MXN) y convertirlos a USD aproximado (1 USD ≈ 18.5 MXN)
    const servicePricesMXN = dict.shadow.services.items.map((item) => item.price)
    const servicePricesUSD = servicePricesMXN
      .map((price) => {
        const num = price.replace(/,/g, "").match(/\d+(\.\d+)?/)
        return num !== null ? Number(num[0]) : null
      })
      .filter((num): number => num !== null)
      .map((usd) => `$${Math.round(usd / 18.5)} USD`)
      .filter(Boolean) as string[]

    const mockEngine = createMockQuoteEngine({
      script,
      servicePrices: servicePricesUSD,
      latencyMs: 500,
    })

    const turn = await mockEngine.send(parsed.data.history)
    return NextResponse.json(turn)
  }

  // Ruta real con Claude/Gemini
  try {
    const turn = await runQuoteTurn(parsed.data.history, parsed.data.locale ?? "es")
    return NextResponse.json(turn)
  } catch {
    // @sideffect el error real se queda en el servidor; al cliente solo un código genérico.
    return NextResponse.json({ error: "ai_error" }, { status: 502 })
  }
}
