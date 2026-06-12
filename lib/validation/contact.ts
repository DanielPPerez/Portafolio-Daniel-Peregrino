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
})

export type ContactInput = z.infer<typeof contactSchema>
export type ContactFieldErrors = Partial<Record<"name" | "email" | "message", string>>
