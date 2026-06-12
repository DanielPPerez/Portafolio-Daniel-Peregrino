"use client"

import Image from "next/image"
import { Reveal } from "@/components/reveal"
import { useLanguage } from "@/lib/i18n/language-context"

export function About() {
  const { t } = useLanguage()

  return (
    <section id="acerca" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-sm text-neon-blue">// {t.about.title}</p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{t.about.subtitle}</h2>
        </Reveal>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[320px_1fr]">
          <Reveal>
            <div className="relative mx-auto w-full max-w-xs">
              <div
                className="absolute -inset-2 rounded-2xl opacity-50 blur-xl"
                style={{ background: "linear-gradient(135deg, var(--neon-purple), var(--neon-blue))" }}
                aria-hidden="true"
              />
              <div className="relative overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src="/images/avatar.png"
                  alt="Daniel Peregrino Perez"
                  width={400}
                  height={500}
                  priority
                  className="aspect-[4/5] w-full object-cover object-top"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="space-y-5">
              {t.about.paragraphs.map((p, i) => (
                <p key={i} className="text-pretty leading-relaxed text-white/70">
                  {p}
                </p>
              ))}
              <div className="flex flex-wrap gap-2 pt-2">
                {t.about.highlights.map((h) => (
                  <span
                    key={h}
                    className="rounded-full border border-neon-purple/30 bg-neon-purple/10 px-3 py-1 text-sm text-white/80"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
