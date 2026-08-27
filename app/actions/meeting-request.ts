"use server"

import {
  meetingRequestSchema,
  type MeetingRequestInput,
  type MeetingRequestFieldErrors,
} from "@/lib/validation/meeting-request"
import { google } from "googleapis"
import { promises as fs } from "fs"
import path from "path"
import { createClient } from "@supabase/supabase-js"

// Inicializa el cliente de Gmail OAuth2 (reutilizado de contact.ts)
const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground", // URL de redirección para OAuth2
)

// Establece las credenciales usando las variables de entorno
oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
})

const gmail = google.gmail({ version: "v1", auth: oauth2Client })

// Supabase client (service role for server actions)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const isValidSupabaseUrl = Boolean(
  supabaseUrl && (supabaseUrl.startsWith("http://") || supabaseUrl.startsWith("https://")),
)
if (!isValidSupabaseUrl || !supabaseServiceRoleKey) {
  console.error("⚠️ Missing or invalid Supabase URL/key; leads will not be stored in DB")
}
const supabase =
  isValidSupabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl!, supabaseServiceRoleKey)
    : null

// Ruta donde guardaremos una copia local de los leads (opcional, para respaldo)
const LEADS_FILE = path.join(process.cwd(), "data", "leads.json")

/**
 * Aplica una etiqueta a un correo recientemente enviado en Gmail
 * (requiere que el correo ya exista en la cuenta)
 */
async function applyLabelToSentEmail(messageId: string, labelName: string) {
  try {
    // Primero, verifica si la etiqueta existe; si no, créala
    const labelsRes = await gmail.users.labels.list({ userId: "me" })
    const labels = labelsRes.data.labels || []
    let labelId = labels.find((l) => l.name === labelName)?.id

    if (!labelId) {
      // Crear la etiqueta si no existe
      const labelRes = await gmail.users.labels.create({
        userId: "me",
        requestBody: {
          name: labelName,
          labelListVisibility: "labelShow",
          messageListVisibility: "show",
        },
      })
      labelId = labelRes.data.id ?? undefined
      if (!labelId) throw new Error(`No se pudo obtener el id de la etiqueta "${labelName}"`)
    }

    // En este punto labelId es string (nunca null/undefined)
    const resolvedLabelId: string = labelId!

    // Aplicar la etiqueta al mensaje
    await gmail.users.messages.modify({
      userId: "me",
      id: messageId,
      requestBody: {
        addLabelIds: [resolvedLabelId],
      },
    })

    console.log(`✅ Etiqueta "${labelName}" aplicada al mensaje ${messageId}`)
  } catch (error) {
    console.error("❌ Error aplicando etiqueta en Gmail:", error)
    // No lanzamos error aquí para no bloquear el envío principal
  }
}

/**
 * Guarda el lead en la tabla meeting_requests de Supabase
 */
async function saveMeetingLead(data: MeetingRequestInput) {
  if (!supabase) return
  try {
    const { error } = await supabase.from("meeting_requests").insert([
      {
        id: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        social_links: data.socialLinks ?? null,
        company_name: data.companyName ?? null,
        role: data.role ?? null,
        project_budget_range: data.projectBudgetRange ?? null,
        // honeypot not stored
        created_at: new Date().toISOString(),
      },
    ])
    if (error) {
      console.error("❌ Error guardando lead de reunión en Supabase:", error)
    } else {
      console.log("✅ Lead de reunión guardado en Supabase")
    }
  } catch (err) {
    console.error("❌ Excepción al guardar lead de reunión:", err)
  }
}

/**
 * (Opcional) Guardar copia local en JSON para respaldo
 */
async function saveLocalLead(data: MeetingRequestInput, gmailMessageId: string) {
  try {
    const raw = await fs.readFile(LEADS_FILE, "utf-8")
    const leads: Array<{
      name: string
      email: string
      phone: string | null
      socialLinks: Array<{
        platform: "whatsapp" | "instagram" | "linkedin" | "other"
        value: string
      }> | null
      companyName: string | null
      role: string | null
      projectBudgetRange: string | null
      receivedAt: string
      gmailMessageId: string
    }> = JSON.parse(raw)

    leads.push({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      socialLinks: data.socialLinks ?? null,
      companyName: data.companyName ?? null,
      role: data.role ?? null,
      projectBudgetRange: data.projectBudgetRange ?? null,
      receivedAt: new Date().toISOString(),
      gmailMessageId: gmailMessageId,
    })

    await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2))
  } catch (fileError) {
    console.warn("⚠️ No se pudo guardar copia local del lead:", fileError)
    // Continuamos de todas formas - el correo ya se envió
  }
}

export type MeetingRequestState = {
  ok: boolean
  approved?: boolean
  bookingUrl?: string
  fieldErrors?: MeetingRequestFieldErrors & { message?: string }
} | null

export async function submitMeetingRequest(
  _prev: MeetingRequestState,
  formData: FormData,
): Promise<MeetingRequestState> {
  // Parse socialLinks from JSON string if needed
  const rawSocialLinks = formData.get("socialLinks")
  let socialLinksArray: Array<{
    platform: "whatsapp" | "instagram" | "linkedin" | "other"
    value: string
  }> = []
  if (typeof rawSocialLinks === "string") {
    try {
      const parsed = JSON.parse(rawSocialLinks)
      if (Array.isArray(parsed)) {
        socialLinksArray = parsed
      }
    } catch {
      socialLinksArray = []
    }
  }

  // Validación del formulario
  const parsed = meetingRequestSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    socialLinks: socialLinksArray.length > 0 ? socialLinksArray : undefined,
    companyName: formData.get("companyName") || undefined,
    role: formData.get("role") || undefined,
    projectBudgetRange: formData.get("projectBudgetRange") || undefined,
    honeypot: formData.get("honeypot") || undefined,
  })

  if (!parsed.success) {
    const fieldErrors: MeetingRequestFieldErrors & { message?: string } = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof MeetingRequestFieldErrors
      if (field) {
        fieldErrors[field] = issue.message
      } else if (!fieldErrors.message) {
        fieldErrors.message = issue.message
      }
    }
    return { ok: false, fieldErrors }
  }

  const { name, email, phone, socialLinks, companyName, role, projectBudgetRange, honeypot } =
    parsed.data

  // Si el campo honeypot contiene datos, es probablemente spam de un bot -> simular éxito silencioso
  if (honeypot && honeypot.trim() !== "") {
    console.warn("🤖 Bot detectado por el campo honeypot en solicitud de reunión. Ignorando.")
    return { ok: true, approved: false }
  }

  try {
    // ---------- 1. Envío del correo vía Gmail ----------
    const emailOptions = {
      from: `"RedFox_Solutions Meeting Form" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `Nueva solicitud de reunión: ${companyName || name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2563eb;">Nueva solicitud de reunión desde tu sitio web</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ""}
          ${socialLinks && socialLinks.length > 0 ? `<p><strong>Redes sociales:</strong><br/>${socialLinks.map((link) => `${link.platform}: ${link.value}`).join("<br/>")}</p>` : ""}
          ${companyName ? `<p><strong>Empresa:</strong> ${companyName}</p>` : ""}
          ${role ? `<p><strong>Rol:</strong> ${role}</p>` : ""}
          ${projectBudgetRange ? `<p><strong>Rango de presupuesto:</strong> ${projectBudgetRange}</p>` : ""}

          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 0.9em; color: #666;">
            Recibido el ${new Date().toLocaleString()} mediante el formulario de solicitud de reunión.
          </p>
        </div>
      `,
    }

    const sentMessage = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: Buffer.from(
          `To: ${emailOptions.to}\r\n` +
            `From: ${emailOptions.from}\r\n` +
            `Subject: ${emailOptions.subject}\r\n` +
            `MIME-Version: 1.0\r\n` +
            `Content-Type: text/html; charset=UTF-8\r\n\r\n` +
            `${emailOptions.html}`,
        )
          .toString("base64")
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, ""),
      },
    })

    const messageId = sentMessage.data.id
    if (!messageId) {
      throw new Error("Failed to obtain Gmail message ID")
    }
    console.log(`✅ Correo enviado vía Gmail. ID: ${messageId}`)

    // ---------- 2. Aplicar etiqueta "MEETING" automáticamente ----------
    await applyLabelToSentEmail(messageId, "MEETING")

    // ---------- 3. Guardar lead en Supabase ----------
    await saveMeetingLead({
      name,
      email,
      phone: phone ?? undefined,
      socialLinks: socialLinks ?? undefined,
      companyName: companyName ?? undefined,
      role: role ?? undefined,
      projectBudgetRange: projectBudgetRange ?? undefined,
    })

    // ---------- 4. (Opcional) Guardar copia local en JSON ----------
    await saveLocalLead(
      {
        name,
        email,
        phone: phone ?? undefined,
        socialLinks: socialLinks ?? undefined,
        companyName: companyName ?? undefined,
        role: role ?? undefined,
        projectBudgetRange: projectBudgetRange ?? undefined,
      },
      messageId,
    )

    // ---------- 5. Respuesta de éxito con aprobación ----------
    return {
      ok: true,
      approved: true,
      bookingUrl: process.env.NEXT_PUBLIC_CALENDAR_BOOKING_SRC ?? undefined,
    }
  } catch (error: unknown) {
    const errObj = error as { error?: { errors?: Array<{ reason?: string }> }; message?: string }
    const isInvalidGrant =
      errObj?.error?.errors?.[0]?.reason === "invalid_grant" ||
      (typeof error === "object" &&
        error !== null &&
        "message" in error &&
        String(errObj.message).includes("invalid_grant"))

    if (isInvalidGrant) {
      console.error("❌ Gmail refresh token inválido o revocado — necesita reautenticación manual")
    } else {
      console.error("❌ Error al procesar la solicitud de reunión:", error)
    }

    return {
      ok: false,
      fieldErrors: {
        message: "Error interno al enviar la solicitud. Por favor, intenta de nuevo más tarde.",
      },
    }
  }
}
