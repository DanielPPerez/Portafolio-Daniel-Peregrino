/** Puerto que decide si se muestra el calendario de reservas.
 *  Implementaciones posibles: Google Calendar públicos, Calendly, Cal.com, etc.
 */
export interface SchedulingGate {
  /** Envía la solicitud de reunión y devuelve si fue aprobada y la URL del calendario.
   *  Si approved es false, no se muestra el calendario.
   */
  submit(input: MeetingRequestInput): Promise<{ approved: boolean; bookingUrl?: string }>
}

/** Información de contacto reutilizada del formulario de contacto (Prompt 2). */
export type ContactInfo = Pick<
  import("@/lib/validation/contact").ContactInput,
  "name" | "email" | "phone" | "socialLinks"
>

/** Datos de la empresa / rol del solicitante. */
export type CompanyInfo = {
  companyName?: string
  role?: string // cargo de quien agenda
  projectBudgetRange?: string // reutilizar las mismas franjas del cotizador si aplica
}

/** Entrada completa del formulario de calificación (incluye campo anti‑spam honeypot). */
export type MeetingRequestInput = ContactInfo &
  CompanyInfo & {
    honeypot?: string // campo oculto, debe llegar vacío para humanos
  }
