import { z } from "zod"

/**
 * Schema del formulario de contacto. Las claves de error ("name" | "email" | "message")
 * se mapean en el cliente a los textos i18n (`t.shadow.contactForm.errors`), de modo que
 * la validación vive en un solo lugar (DRY) y sirve tanto en el server action como, si se
 * quiere, en el cliente.
 */
export const contactSchema = z
  .object({
    name: z.string().trim().min(1, "name"),
    email: z.string().trim().email("email"),
    projectType: z.string().trim().optional(),
    message: z.string().trim().min(1, "message"),
    // Extended project brief fields (all optional for backwards compatibility)
    projectName: z.string().trim().optional(),
    projectDescription: z.string().trim().optional(),
    projectScope: z.string().trim().optional(),
    budget: z.string().trim().optional(),
    timeline: z.string().trim().optional(),
    deliverables: z.string().trim().optional(),
    additionalNotes: z.string().trim().optional(),
  })
  // Nuevos campos de paso 2 (datos de contacto)
  .extend({
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
  })
  // Regla de negocio: al menos un canal de contacto debe estar presente
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
      // No apuntamos a un campo específico porque la regla involucra varios
      path: [], // se mostrará como error de formulario general
    },
  )

export type ContactInput = z.infer<typeof contactSchema>
export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>
