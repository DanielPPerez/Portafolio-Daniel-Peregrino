"use client"

import { motion } from "framer-motion"
import { ArrowDown, ArrowRight, CalendarCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"

export function ShadowHero() {
  const { t } = useLanguage()

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-20"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />
      {/* Halo de acento rojo */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 size-[40rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--neon-red), var(--neon-red) 55%, transparent 75%)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
        <motion.img
          src="/new_logo.png"
          alt="RedFox_Solutions"
          className="h-14 w-auto mx-auto mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-medium text-brand"
        >
          {t.shadow.hero.tagline}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl"
        >
          <span className="text-gray-900">Red</span>
          <span className="ml-1 text-red-500">Fox</span>
          <span className="ml-1 text-gray-900">Solutions</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
        >
          {t.shadow.hero.description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            render={<a href="#agenda" />}
            nativeButton={false}
            size="lg"
            className="bg-brand text-brand-foreground hover:opacity-90"
          >
            <CalendarCheck className="size-4" aria-hidden="true" />
            {t.shadow.hero.ctaCall}
          </Button>
          <Button render={<a href="#servicios" />} nativeButton={false} size="lg" variant="outline">
            {t.shadow.hero.ctaServices}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </motion.div>
      </div>

      <motion.a
        href="#servicios"
        aria-label="Scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-muted-foreground"
      >
        <ArrowDown className="size-6 animate-bounce" />
      </motion.a>
    </section>
  )
}
