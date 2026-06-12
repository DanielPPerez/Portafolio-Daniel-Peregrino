// Contrato del cotizador. La UI depende solo de esta abstracción (Dependency Inversion),
// de modo que el motor concreto (mock ahora, Claude después) se puede intercambiar sin
// tocar el componente del chat.

export type ChatRole = "user" | "assistant"

export type ChatMessage = {
  role: ChatRole
  content: string
}

export type Estimate = {
  min: number
  max: number
  currency: string
}

export type QuoteTurn = {
  /** Respuesta del asistente para mostrar en el chat. */
  reply: string
  /** Requisitos detectados hasta este punto de la conversación. */
  requirements: string[]
  /** Estimado aproximado, presente solo cuando el motor tiene suficiente información. */
  estimate?: Estimate
}

/**
 * Motor de cotización. Recibe el historial completo de la conversación y devuelve
 * el siguiente turno del asistente. Es asíncrono a propósito para que una implementación
 * real (p. ej. una llamada a Claude vía route handler) encaje sin cambiar la firma.
 */
export interface QuoteEngine {
  send(history: ChatMessage[]): Promise<QuoteTurn>
}
