"use client"

import { CountUp } from "@/components/count-up"
import { Reveal } from "@/components/reveal"
import { useLanguage } from "@/lib/i18n/language-context"
import { projects } from "@/lib/projects"

export function Stats() {
  const { t } = useLanguage()
  // const projectCount = projects.length
  // if (!t?.stats) return null

  return (
    <section id="estadisticas" className="border-y border-white/5 bg-white/[0.02] py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {t.stats?.items.map((stat, index) => {
            // Replace the project count item (index 1) with the real count
            const statToShow =
              index === 1 // Assuming projects item is second in the array (index 1)
                ? { ...stat, value: projects.length }
                : stat

            return (
              <Reveal key={stat.label} delay={index * 0.1}>
                <div className="text-center">
                  <p className="text-4xl font-bold text-white sm:text-5xl text-glow-purple">
                    <CountUp to={statToShow.value} suffix={statToShow.suffix} />
                  </p>
                  <p className="mt-2 text-sm text-white/55">{statToShow.label}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
