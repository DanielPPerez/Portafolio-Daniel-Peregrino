"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { socialLinks } from "@/lib/site-data"
import { useLanguage } from "@/lib/i18n/language-context"
import { cn } from "@/lib/utils"

export function SocialBar({ variant = "neon" }: { variant?: "neon" | "sober" }) {
  const { t } = useLanguage()
  const neon = variant === "neon"
  const [copied, setCopied] = useState(false)

  const itemClass = cn(
    "group inline-flex size-11 items-center justify-center rounded-full border transition-all",
    neon
      ? "border-white/10 bg-white/5 text-white/70 hover:border-neon-purple/60 hover:text-white hover:glow-border-purple"
      : "border-border bg-card text-muted-foreground hover:border-brand hover:text-brand",
  )

  /** Copia el correo al portapapeles y muestra el tooltip de confirmación. */
  async function copyEmail(email: string) {
    try {
      // @sensitive el correo es PII; aquí mostrarlo/copiarlo es intencional
      // @sideffect escribe en el portapapeles del navegador
      await navigator.clipboard.writeText(email)
    } catch {
      // El navegador puede bloquear el portapapeles; el tooltip igual revela el correo.
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <ul className="flex flex-wrap items-center gap-3">
      {socialLinks.map((social) => {
        const Icon = social.icon

        // El correo no abre cliente: al pulsar copia y revela la dirección en un tooltip.
        if (social.href.startsWith("mailto:")) {
          const email = social.href.replace("mailto:", "")
          return (
            <li key={social.name} className="relative">
              <button
                type="button"
                onClick={() => copyEmail(email)}
                aria-label={`${email} — ${t.contact.emailCopied}`}
                title={email}
                className={itemClass}
              >
                {copied ? <Check className="size-5" /> : <Icon className="size-5" />}
              </button>
              {copied && (
                <span
                  role="status"
                  className={cn(
                    "absolute -top-11 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border px-3 py-1.5 text-xs shadow-lg",
                    neon
                      ? "border-neon-purple/40 bg-[#0c0c12] text-white"
                      : "border-border bg-card text-foreground",
                  )}
                >
                  {t.contact.emailCopied}: {email}
                </span>
              )}
            </li>
          )
        }

        return (
          <li key={social.name}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className={itemClass}
            >
              <Icon className="size-5" />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
