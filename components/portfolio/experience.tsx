"use client"

import { Award, BadgeCheck, Briefcase, ExternalLink } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { useLanguage } from "@/lib/i18n/language-context"
import { certifications } from "@/lib/site-data"

export function Experience() {
  const { t } = useLanguage()

  return (
    <section id="experiencia" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-sm text-neon-blue">
            {"// "}
            {t.experience.title}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{t.experience.title}</h2>
          <p className="mt-3 max-w-2xl text-white/60">{t.experience.subtitle}</p>
        </Reveal>

        <div className="mt-12 max-w-3xl">
          <ol className="relative border-l border-white/10 pl-8">
            {t.experience.items.map((item, i) => (
              <Reveal key={item.company} delay={i * 0.1}>
                <li className="mb-10 last:mb-0">
                  <span className="absolute -left-3 flex size-6 items-center justify-center rounded-full border border-neon-purple/50 bg-[#0c0c12] glow-border-purple">
                    <Briefcase className="size-3 text-neon-purple" aria-hidden="true" />
                  </span>
                  <p className="font-mono text-xs text-neon-blue">{item.period}</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">{item.role}</h3>
                  <p className="text-sm text-white/50">{item.company}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{item.description}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal>
          <div className="mt-12">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neon-purple">
              <Award className="size-4" aria-hidden="true" />
              {t.experience.certificationsTitle}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {certifications.map((cert) => (
                <a
                  key={cert.name}
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-neon-purple/50 hover:bg-white/[0.07] hover:glow-border-purple"
                >
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-neon-blue">
                    <BadgeCheck className="size-4 shrink-0" aria-hidden="true" />
                    {cert.issuer}
                  </div>
                  <p className="text-pretty font-medium leading-snug text-white">{cert.name}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm text-white/55 transition-colors group-hover:text-neon-purple">
                    {t.experience.viewCredential}
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
