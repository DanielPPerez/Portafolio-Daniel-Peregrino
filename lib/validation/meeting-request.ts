import { z } from "zod"

/**
 * Esquema de validación para la solicitud de reunión (calificación antes del calendario).
 * Reutiliza los campos de ContactInput (nombre, email, teléfono, redes sociales, etc.)
 * y agrega información de la empresa y el campo honeypot anti‑spam.
 */
export const meetingRequestSchema = z
  .object({
    // --- ContactInfo (reutilizado) ---
    name: z.string().trim().min(1, "name"),
    email: z.string().trim().email("email"),
    // Los campos de teléfono y redes sociales son opcionales individualmente,
    // pero se requiere al menos uno (ver refinement más abajo).
    phone: z.string().trim().optional(),
    socialLinks: z
      .array(
        z.object({
          platform: z.enum(["whatsapp", "instagram", "linkedin", "other"]),
          value: z.string(),
        }),
      )
      .max(3)
      .optional(),
    // --- CompanyInfo ---
    companyName: z.string().trim().optional(),
    role: z.string().trim().optional(),
    projectBudgetRange: z.string().trim().optional(),
    // --- Anti‑spam honeypot (debe quedar vacío) ---
    honeypot: z.string().optional(),
  })

  // Refinamiento: al menos un canal de contacto (teléfono o red social) debe estar presente.
  .refine(
    (data) => {
      const hasPhone = typeof data.phone === "string" && data.phone.trim() !== ""
      const hasSocial =
        Array.isArray(data.socialLinks) &&
        data.socialLinks.some((link) => typeof link.value === "string" && link.value.trim() !== "")
      return hasPhone || hasSocial
    },
    {
      message: "Al menos un canal de contacto (teléfono o red social) es obligatorio",
      // Se muestra como error de formulario general (no asignado a campo específico).
      path: [],
    },
  )

// Tipo inferido para usar en el server action.
export type MeetingRequestInput = z.infer<typeof meetingRequestSchema>
export type MeetingRequestFieldErrors = Partial<Record<keyof MeetingRequestInput, string>>
