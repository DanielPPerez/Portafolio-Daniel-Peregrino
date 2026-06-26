"use client"

import { Compass, PenTool, Code, LifeBuoy } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { useLanguage } from "@/lib/i18n/language-context"

const icons = [Compass, PenTool, Code, LifeBuoy]

export function ShadowProcess() {
  const { t } = useLanguage()

  return (
    <section id="proceso" className="border-y border-border bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t.shadow.process.title}
            </h2>
            <p className="mt-3 text-muted-foreground">{t.shadow.process.subtitle}</p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.shadow.process.steps.map((step, i) => {
            const Icon = icons[i % icons.length]
            return (
              <Reveal key={step.title} delay={i * 0.1}>
                <div className="relative h-full rounded-xl border border-border bg-card p-6">
                  <span className="absolute right-4 top-4 font-mono text-3xl font-bold text-border">
                    0{i + 1}
                  </span>
                  <div className="flex size-11 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
