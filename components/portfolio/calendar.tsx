"use client"

import { CalendarDays } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { CALENDAR_SRC } from "@/lib/site-data"
import { useLanguage } from "@/lib/i18n/language-context"

const isUsableCalendarSrc = Boolean(CALENDAR_SRC) && !CALENDAR_SRC.includes("TU_CALENDARIO")

export function Calendar() {
  const { t } = useLanguage()

  return (
    <section className="border-y border-border bg-surface-tinted py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="flex items-center gap-2 font-mono text-sm text-neon-blue">
            <CalendarDays className="size-4" aria-hidden="true" />
            {t.calendar.title}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            {t.calendar.title}
          </h2>
          <p className="mt-3 max-w-2xl text-foreground/60">{t.calendar.subtitle}</p>
        </Reveal>

        <Reveal delay={0.1}>
          {isUsableCalendarSrc ? (
            <div className="mt-10 overflow-hidden rounded-xl border border-border bg-black p-2">
              <div className="overflow-hidden rounded-lg">
                <iframe
                  src={CALENDAR_SRC}
                  title={t.calendar.title}
                  className="h-[420px] w-full"
                  style={{ filter: "invert(0.92) hue-rotate(180deg)" }}
                  loading="lazy"
                />
              </div>
            </div>
          ) : (
            <p className="mt-10 rounded-xl border border-border bg-background/40 p-6 text-sm text-foreground/60">
              {t.calendar.unavailable}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
