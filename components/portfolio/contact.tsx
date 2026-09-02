"use client"

import { MapPin } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { SocialBar } from "@/components/social-bar"
import { useLanguage } from "@/lib/i18n/language-context"

export function Contact() {
  const { t } = useLanguage()

  return (
    <section id="contacto" className="py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <p className="font-mono text-sm text-neon-blue">
            {"// "}
            {t.contact.title}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl text-glow-purple">
            {t.contact.title}
          </h2>
          <p className="mt-3 text-lg font-medium text-foreground">{t.contact.subtitle}</p>
          <p className="mt-4 text-pretty text-foreground/70">{t.contact.availability}</p>
          <p className="mt-4 inline-flex items-center justify-center gap-2 text-sm text-foreground/80">
            <MapPin className="size-4 shrink-0 text-neon-purple" aria-hidden="true" />
            <span>{t.contact.location}</span>
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col items-center gap-4">
            <p className="text-sm uppercase tracking-wider text-foreground/50">
              {t.contact.socials}
            </p>
            <SocialBar variant="neon" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
