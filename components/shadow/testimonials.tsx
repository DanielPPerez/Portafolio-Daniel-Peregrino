"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Reveal } from "@/components/reveal"
import { useLanguage } from "@/lib/i18n/language-context"

function TestimonialCard({ item }: { item: { name: string; company: string; quote: string } }) {
  return (
    <figure className="flex h-full w-[280px] shrink-0 flex-col rounded-xl border border-border bg-card p-6 sm:w-[320px]">
      <Quote className="size-7 text-brand" aria-hidden="true" />
      <blockquote className="mt-4 flex-1 text-pretty text-sm leading-relaxed text-foreground sm:text-base">
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
  )
}

export function ShadowTestimonials() {
  const { t } = useLanguage()
  const items = t.shadow.testimonials.items
  const firstSetRef = useRef<HTMLDivElement>(null)
  const [setWidth, setSetWidth] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const el = firstSetRef.current
    if (!el) return
    const measure = () => setSetWidth(el.offsetWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [items])

  const duration = Math.max(18, setWidth / 45)

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
      </div>

      <div
        className="relative mt-14 overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-40"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-40"
          aria-hidden="true"
        />

        <motion.div
          className="flex w-max"
          animate={{ x: setWidth === 0 ? 0 : [0, -setWidth] }}
          transition={{
            duration: paused ? duration * 40 : duration,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div ref={firstSetRef} className="flex shrink-0 gap-6 pr-6">
            {items.map((item) => (
              <TestimonialCard key={item.name} item={item} />
            ))}
          </div>
          <div className="flex shrink-0 gap-6 pr-6" aria-hidden="true">
            {items.map((item) => (
              <TestimonialCard key={`loop-${item.name}`} item={item} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
