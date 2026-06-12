"use client"

import { Award, Briefcase } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { useLanguage } from "@/lib/i18n/language-context"

export function Experience() {
  const { t } = useLanguage()

  return (
    <section id="experiencia" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-sm text-neon-blue">// {t.experience.title}</p>
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
            <div className="flex flex-wrap gap-3">
              {t.experience.certifications.map((cert) => (
                <span
                  key={cert}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
