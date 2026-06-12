"use client"

import { Reveal } from "@/components/reveal"
import { useLanguage } from "@/lib/i18n/language-context"

export function TechStack() {
  const { t } = useLanguage()

  return (
    <section id="stack" className="border-y border-white/5 bg-white/[0.02] py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-sm text-neon-blue">// {t.techStack.title}</p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{t.techStack.title}</h2>
          <p className="mt-3 max-w-2xl text-white/60">{t.techStack.subtitle}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {t.techStack.groups.map((group, i) => (
            <Reveal key={group.name} delay={i * 0.08}>
              <div className="h-full rounded-xl border border-white/10 bg-[#0c0c12] p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neon-purple">
                  {group.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.techs.map((tech) => (
                    <span
                      key={tech}
                      className="cursor-default rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/75 transition-all hover:border-neon-blue/50 hover:text-white hover:glow-border-blue"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
