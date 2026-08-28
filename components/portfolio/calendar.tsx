"use client"

import { useEffect, useState } from "react"
import { CalendarDays } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { CALENDAR_BOOKING_SRC } from "@/lib/site-data"
import { useLanguage } from "@/lib/i18n/language-context"
import { MeetingRequestForm } from "@/components/shadow/meeting-request-form"

export function Calendar() {
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
          {approved ? (
            <div className="mt-10 overflow-hidden rounded-xl border border-border bg-black p-2">
              <div className="overflow-hidden rounded-lg">
                <iframe
                  src={bookingUrl || CALENDAR_BOOKING_SRC}
                  title={t.calendar.title}
                  className="h-[420px] w-full"
                  style={{ filter: "invert(0.92) hue-rotate(180deg)" }}
                  loading="lazy"
                />
              </div>
            </div>
          ) : (
            <MeetingRequestForm onApproval={handleApproval} />
          )}
        </Reveal>
      </div>
    </section>
  )
}
