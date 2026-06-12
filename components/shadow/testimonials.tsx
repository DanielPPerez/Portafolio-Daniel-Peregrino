"use client"

import { Star, Quote } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Reveal } from "@/components/reveal"
import { useLanguage } from "@/lib/i18n/language-context"

export function ShadowTestimonials() {
  const { t } = useLanguage()

  return (
    <section id="testimonios" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t.shadow.testimonials.title}
            </h2>
            <p className="mt-3 text-muted-foreground">{t.shadow.testimonials.subtitle}</p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {t.shadow.testimonials.items.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.1}>
              <figure className="flex h-full flex-col rounded-xl border border-border bg-card p-6">
                <Quote className="size-7 text-brand" aria-hidden="true" />
                <blockquote className="mt-4 flex-1 text-pretty leading-relaxed text-foreground">
                  {item.quote}
                </blockquote>
                <div className="mt-5 flex items-center gap-1" aria-label="5 de 5 estrellas">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="size-4 fill-brand text-brand" aria-hidden="true" />
                  ))}
                </div>
                <figcaption className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-brand/10 text-sm font-semibold text-brand">
                      {item.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.company}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
