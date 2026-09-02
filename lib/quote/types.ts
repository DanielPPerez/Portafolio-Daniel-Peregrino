// Contrato del cotizador. La UI depende solo de esta abstracción (Dependency Inversion),
// de modo que el motor concreto (mock ahora, Claude después) se puede intercambiar sin
// tocar el componente del chat.

import type { QuoteEstimate } from "./pricing-engine"

export type { QuoteEstimate } from "./pricing-engine"

/**
 * @deprecated Alias de QuoteEstimate para compatibilidad con el motor `@deprecated` en
 * `claude.ts`. Los consumidores activos deben usar QuoteEstimate directamente.
 */
export type Estimate = QuoteEstimate

export type ChatRole = "user" | "assistant"

export type ChatMessage = {
  role: ChatRole
  content: string
}

/**
 * Línea de negocio sugerida por la UI al inicio de la conversación. Se envía al backend
 * como pista opcional; el extractor (Fase 4) puede usarla para sesgar la primera
 * clasificación, pero el modelo conserva su juicio si la conversación contradice el hint.
 */
export type BusinessLineHint = "software" | "repair"

export type QuoteTurn = {
  /** Respuesta del asistente para mostrar en el chat. */
  reply: string
  /** Requisitos detectados hasta este punto de la conversación. */
  requirements: string[]
  /**
   * Estimado calculado por el motor determinístico (Fase 3). Ausente si el motor
   * aún no tiene suficiente información o si la cotización requiere revisión manual.
   */
  estimate?: QuoteEstimate
}

/**
 * Motor de cotización. Recibe el historial completo de la conversación y devuelve
 * el siguiente turno del asistente. Es asíncrono a propósito para que una implementación
 * real (p. ej. una llamada a Claude vía route handler) encaje sin cambiar la firma.
 */
export interface QuoteEngine {
  send(history: ChatMessage[]): Promise<QuoteTurn>
}
