/**
 * Arma un mensaje MIME RFC 2822 para Gmail API (`users.messages.send` raw).
 * El Subject va en encoded-word UTF-8 (RFC 2047) para evitar mojibake
 * tipo "reuniÃƒÂ³n" cuando hay tildes.
 */
export function encodeGmailRawMessage(options: {
  to: string
  from: string
  subject: string
  html: string
}): string {
  const encodedSubject = `=?UTF-8?B?${Buffer.from(options.subject, "utf8").toString("base64")}?=`
  const htmlB64 = Buffer.from(options.html, "utf8").toString("base64")

  const mime =
    `To: ${options.to}\r\n` +
    `From: ${options.from}\r\n` +
    `Subject: ${encodedSubject}\r\n` +
    `MIME-Version: 1.0\r\n` +
    `Content-Type: text/html; charset=UTF-8\r\n` +
    `Content-Transfer-Encoding: base64\r\n\r\n` +
    `${htmlB64}`

  return Buffer.from(mime, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}
