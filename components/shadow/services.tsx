"use client"

import { Check, Code2, Smartphone, Sparkles, Search } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useLanguage } from "@/lib/i18n/language-context"

const icons = [Code2, Smartphone, Sparkles, Search]

export function ShadowServices() {
  const { t } = useLanguage()

  return (
    <section id="servicios" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t.shadow.services.title}
            </h2>
            <p className="mt-3 text-muted-foreground">{t.shadow.services.subtitle}</p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {t.shadow.services.items.map((service, i) => {
            const Icon = icons[i % icons.length]
            return (
              <Reveal key={service.title} delay={i * 0.08}>
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex size-11 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        <Icon className="size-5" aria-hidden="true" />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{t.shadow.services.from}</p>
                        <p className="text-lg font-semibold text-foreground">{service.price}</p>
                      </div>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-foreground">{service.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.deliverables.map((d) => (
                        <li key={d} className="flex items-center gap-2 text-sm text-foreground/80">
                          <Check className="size-4 shrink-0 text-brand" aria-hidden="true" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
