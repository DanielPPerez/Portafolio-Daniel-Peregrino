import React from "react"
import { ShadowNavbar } from "@/components/shadow/navbar"
import { ShadowHero } from "@/components/shadow/hero"
import { ShadowServices } from "@/components/shadow/services"
import { ShadowProcess } from "@/components/shadow/process"
import { QuoteChat } from "@/components/shadow/quote-chat"
import { ShadowTestimonials } from "@/components/shadow/testimonials"
import { ShadowFaq } from "@/components/shadow/faq"
import { ShadowContactForm } from "@/components/shadow/contact-form"
import { ShadowCalendar } from "@/components/shadow/calendar"
import { ShadowFooter } from "@/components/shadow/footer"

export default function Shadow360Page() {
  return (
    <div
      className="min-h-screen scroll-smooth bg-background text-foreground"
      style={
        {
          "--brand": "var(--neon-red)",
          "--brand-foreground": "#fff",
        } as React.CSSProperties
      }
    >
      <ShadowNavbar />
      <main>
        <ShadowHero />
        <ShadowServices />
        <ShadowProcess />
        <QuoteChat />
        <ShadowTestimonials />
        <ShadowFaq />
        <ShadowContactForm />
        <ShadowCalendar />
      </main>
      <ShadowFooter />
    </div>
  )
}
