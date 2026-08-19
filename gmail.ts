// gmail.ts
import { config } from "dotenv"
config({ path: ".env.local" }) // <-- esto va ANTES de importar googleapis

import { google } from "googleapis"

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground",
)

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
})

const gmail = google.gmail({ version: "v1", auth: oauth2Client })

/** Type guard para errores tipo Axios sin depender de `any`. */
function isAxiosLikeError(
  err: unknown,
): err is { response?: { data?: unknown }; message?: string } {
  return typeof err === "object" && err !== null && ("response" in err || "message" in err)
}

;(async () => {
  try {
    const res = await gmail.users.labels.list({ userId: "me" })
    console.log(
      "✅ Token válido. Etiquetas:",
      res.data.labels?.map((l) => l.name),
    )
  } catch (err: unknown) {
    if (isAxiosLikeError(err)) {
      console.error("❌ Error al usar el token:", err.response?.data ?? err.message)
    } else {
      console.error("❌ Error al usar el token:", err)
    }
  }
})()
