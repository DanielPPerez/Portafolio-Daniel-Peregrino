import { z } from "zod"
import type { ChatMessage, QuoteTurn } from "./types"

/** Indica si el cotizador con IA está configurado (hay API key de Gemini). */
export function isQuoteAiConfigured(): boolean {
  return Boolean(process.env.GOOGLE_API_KEY)
}

// Modelo de Gemini a usar (puede sobrescribirse vía env)
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-1.5-pro-latest"

// Esquema para validar la salida del modelo (permitimos que los campos del estimate sean opcionales)
const resultSchema = z.object({
  reply: z.string(),
  requirements: z.array(z.string()),
  estimate: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      currency: z.string().optional(),
    })
    .nullable()
    .optional(),
})

// Prompt del sistema mejorado para conversación activa y comprensión profunda
const SYSTEM_PROMPT = `Eres el asistente de cotización de RedFox_Solutions, una agencia freelance full stack
(desarrollo web/móvil e integración de IA). Tu trabajo es guiar una conversación estructurada para comprender completamente el proyecto del cliente y proporcionar un estimado preliminar.

INSTRUCCIONES CLAVE:
1. ESCUCHA ACTIVA: Antes de responder, reflexiona brevemente (en tu proceso de pensamiento) sobre qué información clave ha proporcionado el usuario. Luego, confirma tu comprensión parafraseando sus puntos principales en tu respuesta.

2. INFORMACIÓN OBLIGATORIA A RECopilar (debes obtener al menos una indicación de cada uno antes de proporcionar un estimado):
   - Nombre del proyecto (o cómo le gustaría llamarlo)
   - Descripción detallada del proyecto
   - Alcance específico / funcionalidades o módulos requeridos
   - Presupuesto aproximado o rango que tienen en mente
   - Fecha límite deseada o plazo estimado
   - Entregables esperados
   - Notas adicionales o restricciones importantes

3. MANEJO DE RESPUESTAS:
   - Si el usuario proporciona información relevante: Extrae los detalles, confirma lo entendido y pregunta por el siguiente elemento faltante.
   - Si el usuario se desvía del tema: Reconoce amablemente su comentario, luego suavemente redirige la conversación hacia los detalles del proyecto necesarios para el cotizador.
   - Si el usuario da respuestas vagas o incompletas: Haz preguntas específicas y abiertas para aclarar (ej: En lugar de "¿Cuál es su presupuesto?", pregunte "¿Está pensando en una inversión más cercana a los $10,000 MXN, $50,000 MXN, o más para este proyecto?").
   - Nunca asumas información; siempre solicita aclaraciones cuando haya ambigüedad.

4. CUÁNDO PROPORCIONAR UN ESTIMADO:
   Solo proporcione un campo "estimate" cuando haya información suficiente para hacer una estimación razonable de ALMENOS:
   - Tipo de proyecto (sitio web, app móvil, etc.)
   - Alcance básico (páginas clave, funcionalidades principales)
   - Rango presupuestario aproximado del cliente
   - Plazo tentativo
   Cuando proporcione el estimate, debe estar en USD y mencionar el equivalente en MXN en su respuesta textual ("reply").

5. ESTILO DE COMUNICACIÓN:
   - Use un tono profesional, cercano y paciente.
   - Haga un máximo de 2 preguntas concretas por turno.
   - Siempre termine sus respuestas con una pregunta abierta que impulse la conversación hacia adelante, excepto cuando proporcione el estimado final.
   - Evite jerga técnica innecesaria; explique los conceptos en términos simples.

MODELO DE PRECIOS (FX ~18.5 MXN/USD; cliente recién egresado, arranca en el extremo bajo y sube con experiencia):
- Hora: USD 14–24 (local) / 250–450 MXN.
- Landing / sitio simple: USD 400–900 / 7,500–17,000 MXN.
- Sitio corporativo + CMS: USD 1,000–2,500 / 19,000–46,000 MXN.
- Web app full stack (auth/DB/panel): USD 2,500–6,000 / 46,000–110,000 MXN.
- App móvil multiplataforma: USD 3,000–7,000 / 55,000–130,000 MXN.
- Integración IA / chatbot RAG: USD 1,200–4,000 / 22,000–74,000 MXN.

REGLAS DE FORMATO DE SALIDA:
- "requirements": Lista acumulativa y actualizada de requisitos clave identificados (máximo 5-7 elementos más importantes).
- "estimate": Objeto con {min: número, max: número, currency: "USD"} cuando tenga suficiente información; null en caso contrario.
- Nunca incluya campos undefined en estimate; si falta información, devuelva null.`

/**
 * Ejecuta un turno del cotizador con Gemini y devuelve la respuesta estructurada.
 */
export async function runQuoteTurn(
  history: ChatMessage[],
  locale: "es" | "en",
): Promise<QuoteTurn> {
  // Descarta saludos iniciales del asistente hasta el primer mensaje de usuario
  const firstUserIdx = history.findIndex((m) => m.role === "user")
  const relevantHistory = firstUserIdx === -1 ? [] : history.slice(firstUserIdx)

  if (relevantHistory.length === 0) {
    return { reply: "", requirements: [] }
  }

  // Prepara los mensajes para Gemini: rol "user" o "model"
  const geminiMessages = relevantHistory.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }))

  // Construye el request body
  const requestBody = {
    model: `models/${GEMINI_MODEL}`,
    system_instruction: {
      parts: [
        { text: `${SYSTEM_PROMPT}\nResponde en ${locale === "es" ? "español" : "English"}.` },
      ],
    },
    contents: geminiMessages,
    generationConfig: {
      temperature: 0.3, // Ligeramente aumentado para mejor manejo de respuestas variadas
      topP: 0.8,
      maxOutputTokens: 1024,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          reply: { type: "STRING" },
          requirements: { type: "ARRAY", items: { type: "STRING" } },
          estimate: {
            type: "OBJECT",
            properties: {
              min: { type: "NUMBER" },
              max: { type: "NUMBER" },
              currency: { type: "STRING" },
            },
          },
        },
        propertyOrdering: ["reply", "requirements", "estimate"],
        required: ["reply", "requirements"], // Aseguramos que siempre haya respuesta y requisitos
      },
    },
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      },
    )

    if (!res.ok) {
      const errorText = await res.text()
      console.error("Gemini API error:", errorText)
      throw new Error(`Gemini error: ${res.status}`)
    }

    const data = await res.json()

    // Extraer el texto del primer candidato
    const candidate = data.candidates?.[0]
    if (!candidate) throw new Error("No candidates returned")

    const textParts = candidate.content?.parts?.filter((p: { text?: string }) => "text" in p) ?? []
    const text = textParts.length > 0 ? (textParts[0] as { text: string }).text : ""

    // Intentar parsear JSON
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      // Si no es JSON válido, intentar extraer entre llaves
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          parsed = JSON.parse(match[0])
        } catch {
          throw new Error("Model output is not valid JSON")
        }
      } else {
        throw new Error("Model output is not valid JSON")
      }
    }

    // Validar con Zod
    const validated = resultSchema.safeParse(parsed)
    if (!validated.success) {
      console.error("Validation error:", validated.error)
      throw new Error("Model output does not match expected schema")
    }

    // Si estimate es un objeto pero le faltan campos obligatorios, lo tratamos como null (información insuficiente)
    let estimate = validated.data.estimate
    if (estimate !== null && estimate !== undefined && typeof estimate === "object") {
      if (
        estimate.min === undefined ||
        estimate.max === undefined ||
        estimate.currency === undefined
      ) {
        estimate = null
      }
    }

    return {
      reply: validated.data.reply,
      requirements: validated.data.requirements,
      estimate: estimate ?? undefined,
    }
  } catch (err) {
    console.error("Error in quote generation:", err)
    // En caso de error, lanzamos para que el route maneje el 502
    throw err
  }
}
