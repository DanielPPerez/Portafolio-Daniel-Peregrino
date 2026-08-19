import { z } from "zod"

/**
 * Schema del formulario de contacto. Las claves de error ("name" | "email" | "message")
 * se mapean en el cliente a los textos i18n (`t.shadow.contactForm.errors`), de modo que
 * la validación vive en un solo lugar (DRY) y sirve tanto en el server action como, si se
 * quiere, en el cliente.
 */
export const contactSchema = z.object({
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

export type ContactInput = z.infer<typeof contactSchema>
export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>
