import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest"
import { extractIntent, IntentExtractionError } from "./intent-extractor"
import type { ChatMessage } from "./types"

const SAMPLE_MODULES = ["authentication", "products", "users"]
const SAMPLE_REPAIRS = ["battery_replacement", "screen_replacement"]
const SAMPLE_ADDONS = ["home_pickup_delivery", "advanced_diagnostics"]

function mockFetchResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

function successEnvelope(text: string): unknown {
  return { candidates: [{ content: { parts: [{ text }] } }] }
}

const baseInput = {
  history: [{ role: "user" as const, content: "Quiero un sitio web con login" }],
  locale: "es" as const,
  validSoftwareModuleIds: SAMPLE_MODULES,
  validRepairTypeIds: SAMPLE_REPAIRS,
  validAddonIds: SAMPLE_ADDONS,
}

let fetchSpy: MockInstance<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>

beforeEach(() => {
  process.env.GOOGLE_API_KEY = "test-key"
  process.env.GEMINI_MODEL = "gemini-2.5-flash-lite"
  fetchSpy = vi.spyOn(globalThis, "fetch") as MockInstance<
    (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
  >
})

afterEach(() => {
  vi.restoreAllMocks()
  delete process.env.GOOGLE_API_KEY
  delete process.env.GEMINI_MODEL
})

describe("extractIntent — happy path", () => {
  it("envía el request con responseSchema que enumera los IDs del catálogo", async () => {
    fetchSpy.mockResolvedValue(
      mockFetchResponse(
        successEnvelope(
          JSON.stringify({
            businessLine: "software",
            softwareModuleIds: ["authentication"],
            repairFields: null,
            readyForEstimate: true,
            replyText: "Listo, te paso el estimado.",
          }),
        ),
      ),
    )

    await extractIntent(baseInput)

    const call = fetchSpy.mock.calls[0]
    expect(call).toBeDefined()
    const init = call[1] as RequestInit
    const body = JSON.parse(init.body as string) as {
      generationConfig: {
        responseSchema: {
          type: string
          properties: Record<string, { type: string; enum?: string[]; items?: { enum?: string[] } }>
        }
      }
    }
    const schema = body.generationConfig.responseSchema
    expect(schema.type).toBe("OBJECT")
    expect(schema.properties.businessLine).toMatchObject({
      type: "STRING",
      enum: ["software", "repair", "unclear"],
    })
    const modulesSchema = schema.properties.softwareModuleIds
    expect(modulesSchema.items?.enum).toEqual(SAMPLE_MODULES)
  })

  it("devuelve el IntentExtractionResult parseado", async () => {
    fetchSpy.mockResolvedValue(
      mockFetchResponse(
        successEnvelope(
          JSON.stringify({
            businessLine: "software",
            softwareModuleIds: ["authentication", "products"],
            repairFields: null,
            readyForEstimate: true,
            replyText: "Te paso el estimado de tu sitio web.",
          }),
        ),
      ),
    )

    const result = await extractIntent(baseInput)
    expect(result.businessLine).toBe("software")
    expect(result.softwareModuleIds).toEqual(["authentication", "products"])
    expect(result.readyForEstimate).toBe(true)
    expect(result.replyText).toMatch(/estimado/)
  })
})

describe("extractIntent — casos de error", () => {
  it("lanza IntentExtractionError si la respuesta no matchea el schema", async () => {
    fetchSpy.mockResolvedValue(
      mockFetchResponse(
        successEnvelope(
          JSON.stringify({
            businessLine: "invalid_value",
            softwareModuleIds: [],
            readyForEstimate: false,
            replyText: "hola",
          }),
        ),
      ),
    )

    await expect(extractIntent(baseInput)).rejects.toBeInstanceOf(IntentExtractionError)
  })

  it("lanza IntentExtractionError si la API responde 5xx", async () => {
    fetchSpy.mockResolvedValue(mockFetchResponse({ error: "internal" }, 500))

    await expect(extractIntent(baseInput)).rejects.toBeInstanceOf(IntentExtractionError)
  })

  it("lanza IntentExtractionError si fetch rechaza (red caída)", async () => {
    fetchSpy.mockRejectedValue(new TypeError("network down"))

    await expect(extractIntent(baseInput)).rejects.toBeInstanceOf(IntentExtractionError)
  })

  it("lanza IntentExtractionError si la respuesta no es JSON", async () => {
    fetchSpy.mockResolvedValue(mockFetchResponse(successEnvelope("esto no es JSON válido {")))

    await expect(extractIntent(baseInput)).rejects.toBeInstanceOf(IntentExtractionError)
  })
})

describe("extractIntent — casos sin red", () => {
  it("devuelve pregunta de aclaración sin llamar a la API si no hay historial de usuario", async () => {
    const history: ChatMessage[] = [
      { role: "assistant", content: "Hola, ¿qué te gustaría cotizar?" },
    ]
    const result = await extractIntent({ ...baseInput, history })
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(result.businessLine).toBe("unclear")
    expect(result.readyForEstimate).toBe(false)
    expect(result.replyText.length).toBeGreaterThan(0)
  })

  it("lanza IntentExtractionError si GOOGLE_API_KEY no está configurada", async () => {
    delete process.env.GOOGLE_API_KEY
    await expect(extractIntent(baseInput)).rejects.toBeInstanceOf(IntentExtractionError)
  })
})
