import { NextResponse } from "next/server"
import { z } from "zod"
import { isQuoteAiConfigured } from "@/lib/quote/claude"
import { es } from "@/lib/i18n/es"
import { en } from "@/lib/i18n/en"
import { createMockQuoteEngine } from "@/lib/quote/mock-engine"
import { createQuoteEngine } from "@/lib/quote/quote-engine"

const bodySchema = z.object({
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .min(1)
    .max(50),
  locale: z.enum(["es", "en"]).optional(),
  businessLineHint: z.enum(["software", "repair"]).optional(),
})

/** Cotizador IA: recibe el historial y devuelve la respuesta del motor (Fase 4) o fallback mock. */
export async function POST(req: Request) {
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

  const locale = parsed.data.locale ?? "es"
  const dict = locale === "es" ? es : en

  if (!isQuoteAiConfigured()) {
    const servicePricesMXN = dict.shadow.services.items.map((item) => item.price)
    const servicePricesUSD = servicePricesMXN
      .map((price) => {
        const num = price.replace(/,/g, "").match(/\d+(\.\d+)?/)
        return num !== null ? Number(num[0]) : null
      })
      .filter((num): num is number => num !== null)
      .map((usd) => `$${Math.round(usd / 18.5)} USD`)
      .filter(Boolean) as string[]

    const mockEngine = createMockQuoteEngine({
      softwareScript: dict.shadow.quote.scriptSoftware,
      repairScript: dict.shadow.quote.scriptRepair,
      servicePrices: servicePricesUSD,
      latencyMs: 500,
      businessLineHint: parsed.data.businessLineHint,
    })

    const turn = await mockEngine.send(parsed.data.history)
    return NextResponse.json(turn)
  }

  try {
    const engine = createQuoteEngine({
      businessLineHint: parsed.data.businessLineHint,
      locale,
    })
    const turn = await engine.send(parsed.data.history)
    return NextResponse.json(turn)
  } catch (err) {
    // @sideffect log estructurado del fallo inesperado del motor (regla 06).
    // Serializamos a JSON para que el logger de Next dev no lo aplane a {}.
    console.error(
      JSON.stringify({
        op: "quote.api",
        locale,
        hint: parsed.data.businessLineHint,
        historyLen: parsed.data.history.length,
        err: (err as Error).message,
        stack: (err as Error).stack,
      }),
    )
    return NextResponse.json({ error: "ai_error" }, { status: 500 })
  }
}
