"use server"

import { contactSchema, type ContactFieldErrors } from "@/lib/validation/contact"
import { google } from "googleapis"
import { promises as fs } from "fs"
import path from "path"

export type ContactState = {
  ok: boolean
  fieldErrors?: ContactFieldErrors
} | null

// Ruta donde guardaremos una copia local de los leads (opcional, para respaldo)
const LEADS_FILE = path.join(process.cwd(), "data", "leads.json")

// Inicializa el cliente de Gmail OAuth2
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

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Validación del formulario (mantuvimos los campos originales por compatibilidad)
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    projectType: formData.get("projectType"),
    message: formData.get("message"),
    // Campos nuevos del formulario ampliado (opcionales en validación por compatibilidad hacia atrás)
    projectName: formData.get("projectName") ?? "",
    projectDescription: formData.get("projectDescription") ?? "",
    projectScope: formData.get("projectScope") ?? "",
    budget: formData.get("budget") ?? "",
    timeline: formData.get("timeline") ?? "",
    deliverables: formData.get("deliverables") ?? "",
    additionalNotes: formData.get("additionalNotes") ?? "",
  })

  if (!parsed.success) {
    const fieldErrors: ContactFieldErrors = {}
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof ContactFieldErrors
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message
    }
    return { ok: false, fieldErrors }
  }

  const {
    name,
    email,
    projectType,
    message,
    projectName,
    projectDescription,
    projectScope,
    budget,
    timeline,
    deliverables,
    additionalNotes,
  } = parsed.data

  try {
    // ---------- 1. Envío del correo vía Gmail ----------
    const emailOptions = {
      from: `"RedFox_Solutions Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Tu correo: danielperegrinoperez@gmail.com
      subject: `Nuevo lead de contacto: ${projectName || "Proyecto sin nombre"}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2563eb;">Nuevo mensaje de contacto desde tu portafolio</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Tipo de proyecto:</strong> ${projectType}</p>

          ${projectName ? `<p><strong>Nombre del proyecto:</strong> ${projectName}</p>` : ""}
          ${projectDescription ? `<p><strong>Descripción:</strong><br/>${projectDescription}</p>` : ""}
          ${projectScope ? `<p><strong>Alcance / Módulos:</strong><br/>${projectScope}</p>` : ""}
          ${budget ? `<p><strong>Presupuesto aproximado:</strong> ${budget}</p>` : ""}
          ${timeline ? `<p><strong>Fecha de entrega deseada:</strong> ${timeline}</p>` : ""}
          ${deliverables ? `<p><strong>Entregables esperados:</strong><br/>${deliverables}</p>` : ""}
          ${additionalNotes ? `<p><strong>Notas adicionales:</strong><br/>${additionalNotes}</p>` : ""}

          <p><strong>Mensaje original:</strong><br/>${message}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 0.9em; color: #666;">
            Recibido el ${new Date().toLocaleString()} mediante el formulario de tu portafolio.
          </p>
        </div>
      `,
    }

    // Envía el correo
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

    // ---------- 2. Aplicar etiqueta "REDFOX" automáticamente ----------
    await applyLabelToSentEmail(messageId, "REDFOX")

    // ---------- 3. (Opcional) Guardar copia local en JSON para respaldo ----------
    try {
      const raw = await fs.readFile(LEADS_FILE, "utf-8")
      const leads: Array<{
        name: string
        email: string
        projectType: string
        message: string
        receivedAt: string
        gmailMessageId: string
      }> = JSON.parse(raw)

      leads.push({
        name,
        email,
        projectType: projectType ?? "",
        message: message ?? "",
        receivedAt: new Date().toISOString(),
        gmailMessageId: messageId,
      })

      await fs.writeFile(LEADS_FILE, JSON.stringify(leads, null, 2))
    } catch (fileError) {
      console.warn("⚠️ No se pudo guardar copia local del lead:", fileError)
      // Continuamos de todas formas - el correo ya se envió
    }

    // ---------- 4. Respuesta de éxito ----------
    return { ok: true }
  } catch (error) {
    console.error("❌ Error al procesar el formulario de contacto:", error)
    // En caso de error crítico, devolvemos fallo para que la UI muestre error
    return {
      ok: false,
      fieldErrors: {
        message: "Error interno al enviar el mensaje. Por favor, intenta de nuevo más tarde.",
      },
    }
  }
}
