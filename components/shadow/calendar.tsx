"use client"

import { useEffect, useState } from "react"
import { CalendarDays } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { CALENDAR_BOOKING_SRC } from "@/lib/site-data"
import { useLanguage } from "@/lib/i18n/language-context"
import { MeetingRequestForm } from "./meeting-request-form"

export function ShadowCalendar() {
  const { t } = useLanguage()
  const [approved, setApproved] = useState(false)
  const [bookingUrl, setBookingUrl] = useState<string | null>(null)

  // Check sessionStorage for prior approval in this session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("meetingRequestApproved")
      if (stored === "true") {
        setApproved(true)
        // Try to get the booking URL from sessionStorage as well
        const storedUrl = sessionStorage.getItem("meetingRequestBookingUrl")
        if (storedUrl) {
          setBookingUrl(storedUrl)
        }
      }
    }
  }, [])

  const handleApproval = (url: string) => {
    setApproved(true)
    setBookingUrl(url)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("meetingRequestApproved", "true")
      sessionStorage.setItem("meetingRequestBookingUrl", url)
    }
  }

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
          {approved ? (
            <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card p-2">
              <iframe
                src={bookingUrl || CALENDAR_BOOKING_SRC}
                title={t.shadow.calendar.title}
                className="h-[420px] w-full rounded-lg"
                loading="lazy"
              />
            </div>
          ) : (
            <MeetingRequestForm onApproval={handleApproval} />
          )}
        </Reveal>
      </div>
    </section>
  )
}
