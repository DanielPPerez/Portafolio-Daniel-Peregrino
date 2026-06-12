"use client"

import { CalendarDays } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { CALENDAR_SRC } from "@/lib/site-data"
import { useLanguage } from "@/lib/i18n/language-context"

export function ShadowCalendar() {
  const { t } = useLanguage()

  return (
    <section id="agenda" className="border-y border-border bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="flex items-center justify-center gap-2 text-sm font-medium text-brand">
              <CalendarDays className="size-4" aria-hidden="true" />
              {t.shadow.calendar.title}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t.shadow.calendar.title}
            </h2>
            <p className="mt-3 text-muted-foreground">{t.shadow.calendar.subtitle}</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card p-2">
            <iframe
              src={CALENDAR_SRC}
              title={t.shadow.calendar.title}
              className="h-[420px] w-full rounded-lg"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
