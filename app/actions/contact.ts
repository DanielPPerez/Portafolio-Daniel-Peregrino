"use server"

import { contactSchema, type ContactFieldErrors } from "@/lib/validation/contact"

export type ContactState = {
  ok: boolean
  fieldErrors?: ContactFieldErrors
} | null

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    projectType: formData.get("projectType"),
    message: formData.get("message"),
  })

  if (!parsed.success) {
    // Cada issue lleva como `message` la clave i18n del campo ("name" | "email" | "message").
    const fieldErrors: ContactFieldErrors = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof ContactFieldErrors
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message
    }
    return { ok: false, fieldErrors }
  }

  // En producción aquí se persistiría el lead o se enviaría un email.
  console.log("[contact] New lead:", parsed.data)

  // Simular latencia de procesamiento.
  await new Promise((r) => setTimeout(r, 600))

  return { ok: true }
}
