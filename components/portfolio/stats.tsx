"use client"

import { CountUp } from "@/components/count-up"
import { Reveal } from "@/components/reveal"
import { useLanguage } from "@/lib/i18n/language-context"

export function Stats() {
  const { t } = useLanguage()

  return (
    <section id="estadisticas" className="border-y border-white/5 bg-white/[0.02] py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {t.stats.items.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <div className="text-center">
                <p className="text-4xl font-bold text-white sm:text-5xl text-glow-purple">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm text-white/55">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
