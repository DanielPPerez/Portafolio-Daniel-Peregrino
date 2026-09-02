import "server-only"
import { z } from "zod"
import type { ChatMessage } from "./types"

/**
 * Extractor de intención (Fase 4). Clasifica el texto libre del cliente en un
 * IntentExtractionResult estructurado. NUNCA emite cifras de dinero — el JSON schema
 * no tiene campo de precio; los precios los calcula PricingEngine (Fase 3) después.
 *
 * El schema se construye dinámicamente leyendo los IDs válidos del catálogo:
 * si el catálogo cambia, este módulo se actualiza solo.
 */

export type IntentBusinessLine = "software" | "repair" | "unclear"

export type IntentRepairFields = {
  deviceCategory: "phone" | "tablet" | "console"
  repairTypeId: string
  qualityTier: "premium_original" | "economic_incell" | null
  addonIds: string[]
}

export type IntentExtractionResult = {
  businessLine: IntentBusinessLine
  softwareModuleIds: string[]
  repairFields: IntentRepairFields | null
  readyForEstimate: boolean
  /** Texto visible al cliente. El modelo NO incluye cifras aquí; las agrega PricingEngine. */
  replyText: string
}

export type ExtractIntentInput = {
  history: ChatMessage[]
  locale: "es" | "en"
  validSoftwareModuleIds: readonly string[]
  validRepairTypeIds: readonly string[]
  validAddonIds: readonly string[]
  /** Pista opcional de la UI. Sesga la primera clasificación, no la fuerza. */
  businessLineHint?: "software" | "repair"
}

const resultSchema = z.object({
  businessLine: z.enum(["software", "repair", "unclear"]),
  softwareModuleIds: z.array(z.string()),
  // Gemini puede omitirlo cuando businessLine ≠ "repair"; lo aceptamos como null o ausente.
  repairFields: z
    .object({
      deviceCategory: z.enum(["phone", "tablet", "console"]),
      repairTypeId: z.string(),
      qualityTier: z.enum(["premium_original", "economic_incell"]).nullable(),
      addonIds: z.array(z.string()),
    })
    .nullable()
    .optional(),
  readyForEstimate: z.boolean(),
  replyText: z.string(),
})

/** Lanzada por extractIntent ante respuesta inválida o fallo de red. */
export class IntentExtractionError extends Error {
  override readonly name = "IntentExtractionError"
  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message)
  }
}

const DEFAULT_MODEL = "gemini-2.5-flash-lite"
const REQUEST_TIMEOUT_MS = 15_000

function resolveModel(): string {
  return process.env.GEMINI_MODEL ?? DEFAULT_MODEL
}

function buildResponseSchema(input: ExtractIntentInput): Record<string, unknown> {
  return {
    type: "OBJECT",
    properties: {
      businessLine: {
        type: "STRING",
        enum: ["software", "repair", "unclear"],
      },
      softwareModuleIds: {
        type: "ARRAY",
        items: { type: "STRING", enum: [...input.validSoftwareModuleIds] },
      },
      repairFields: {
        type: "OBJECT",
        nullable: true,
        properties: {
          deviceCategory: {
            type: "STRING",
            enum: ["phone", "tablet", "console"],
          },
          repairTypeId: {
            type: "STRING",
            enum: [...input.validRepairTypeIds],
          },
          qualityTier: {
            type: "STRING",
            nullable: true,
            enum: ["premium_original", "economic_incell"],
          },
          addonIds: {
            type: "ARRAY",
            items: { type: "STRING", enum: [...input.validAddonIds] },
          },
        },
        required: ["deviceCategory", "repairTypeId", "qualityTier", "addonIds"],
      },
      readyForEstimate: { type: "BOOLEAN" },
      replyText: { type: "STRING" },
    },
    required: ["businessLine", "softwareModuleIds", "readyForEstimate", "replyText"],
    propertyOrdering: [
      "businessLine",
      "softwareModuleIds",
      "repairFields",
      "readyForEstimate",
      "replyText",
    ],
  }
}

function buildSystemPrompt(input: ExtractIntentInput, locale: "es" | "en"): string {
  const modulesList = input.validSoftwareModuleIds.join(", ")
  const repairsList = input.validRepairTypeIds.join(", ")
  const addonsList = input.validAddonIds.join(", ")
  const hintLine = input.businessLineHint
    ? `\nPISTA DE LA UI: el usuario seleccionó la línea "${input.businessLineHint}" al inicio. Úsala como preferencia si la conversación es ambigua, pero confía en tu propio juicio si los mensajes la contradicen.`
    : ""

  return `Eres el asistentente de clasificación de intención de RedFox_Solutions.${hintLine}

REGLAS DURAS (nunca las rompas):
1. NUNCA menciones cifras de dinero (MXN, USD, "$X,XXX", rangos, "aproximadamente...").
   Los precios los calcula otro sistema, no tú.
2. Tu salida es EXCLUSIVAMENTE el JSON estructurado según el schema. Nada de texto fuera del JSON.

GESTIÓN DE CONVERSACIÓN (evita loops y reconoce typos):
- Lee TODO el historial antes de responder. No repitas preguntas ya hechas y ya respondidas.
- Si el cliente da respuestas incompletas, con typos, o en lenguaje coloquial (ej. "se me vayo",
  "xbox one series x", "se rompio la pantalla"), INFIERE la intención y agrégala al contexto;
  confirma brevemente lo inferido en replyText y sigue, no repitas la pregunta idéntica.
- Avanza siempre hacia readyForEstimate=true: si ya tienes los datos clave (línea, deviceCategory,
  repairTypeId, qualityTier), marca readyForEstimate=true aunque el cliente no haya dicho "ok".
- Solo pregunta lo que sigue si falta algo específico y relevante para el cálculo del precio.

Tu trabajo:
- Identificar la línea de negocio ("software", "repair" o "unclear") a partir de la conversación.
- Clasificar los IDs correctos desde los enums provistos en el schema.
- Si falta información (ej. no sabes si la pantalla es original o genérica, no tienes dispositivo),
  marca readyForEstimate=false y redacta una pregunta de seguimiento en replyText.
- replyText es lo que verá el cliente en el chat. Tono profesional, breve, en ${locale === "es" ? "español" : "inglés"}.

LÍNEAS DE NEGOCIO:
- software: proyectos de desarrollo (sitio web, app, ERP, etc.).
- repair: reparación de electrónicos (phone, tablet, console).
- unclear: saludo, tema no relacionado, o información insuficiente para clasificar.

ADAPTACIÓN POR LÍNEA en replyText:
- Si businessLine="repair", NO uses vocabulario de proyectos de software (no digas "proyecto",
  "desarrollo", "autenticación", "panel de administración"). Habla de dispositivo, falla, repuesto,
  calidad, tiempo de reparación.
- Si businessLine="software", evita términos de taller (no digas "dispositivo", "pantalla rota",
  "batería", "consola") salvo que el cliente los haya mencionado.

CATÁLOGO (referencia — los enums del schema son la fuente de verdad):
- Software modules: ${modulesList}
- Repair types: ${repairsList}
- Add-ons: ${addonsList}

Si el cliente menciona algo fuera del catálogo, deja el array vacío y marca readyForEstimate=false.`
}

function buildContents(history: ChatMessage[]): unknown[] {
  const firstUserIdx = history.findIndex((m) => m.role === "user")
  const relevant = firstUserIdx === -1 ? [] : history.slice(firstUserIdx)
  return relevant.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }))
}

/** Indica si el extractor tiene API key configurada. */
export function isIntentExtractorConfigured(): boolean {
  return Boolean(process.env.GOOGLE_API_KEY)
}

export async function extractIntent(input: ExtractIntentInput): Promise<IntentExtractionResult> {
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) {
    throw new IntentExtractionError("GOOGLE_API_KEY is not configured")
  }

  const model = resolveModel()
  const systemPrompt = buildSystemPrompt(input, input.locale)
  const responseSchema = buildResponseSchema(input)
  const contents = buildContents(input.history)

  if (contents.length === 0) {
    return {
      businessLine: "unclear",
      softwareModuleIds: [],
      repairFields: null,
      readyForEstimate: false,
      replyText:
        input.locale === "es"
          ? "¿Qué te gustaría cotizar? Cuéntame del proyecto o de la reparación que necesitas."
          : "What would you like a quote for? Tell me about the project or the repair you need.",
    }
  }

  const requestBody = {
    model: `models/${model}`,
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: {
      temperature: 0,
      topP: 1,
      maxOutputTokens: 1024,
      responseMimeType: "application/json",
      responseSchema,
    },
  }

  let res: Response
  try {
    res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      },
    )
  } catch (err) {
    throw new IntentExtractionError(`Extractor fetch failed: ${(err as Error).message}`, err)
  }

  if (!res.ok) {
    const errorText = await res.text()
    throw new IntentExtractionError(`Extractor API error: ${res.status} ${errorText}`)
  }

  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  }
  const candidate = data.candidates?.[0]
  const textParts = candidate?.content?.parts ?? []
  const text = textParts.map((p) => ("text" in p ? (p as { text: string }).text : "")).join("")

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new IntentExtractionError("Extractor returned non-JSON content")
  }

  const validated = resultSchema.safeParse(parsed)
  if (!validated.success) {
    throw new IntentExtractionError(
      `Extractor output did not match schema: ${validated.error.message}`,
    )
  }

  return validated.data as IntentExtractionResult
}
