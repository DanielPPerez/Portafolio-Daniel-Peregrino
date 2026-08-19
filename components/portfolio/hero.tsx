"use client"

import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { MatrixRain } from "@/components/matrix-rain"
import { CvButton } from "@/components/cv-button"
import { useLanguage } from "@/lib/i18n/language-context"

export function Hero() {
  const { t } = useLanguage()

  return (
    <section id="inicio" className="relative flex min-h-screen items-center overflow-hidden">
      <MatrixRain />
      {/* gradient veil so text stays readable */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#08080c]/60 via-[#08080c]/80 to-[#08080c]" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 size-[42rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--neon-purple), transparent 60%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-sm text-neon-blue text-glow-blue"
        >
          {t.hero.greeting}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-3 text-balance text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Daniel <span className="text-neon-purple text-glow-purple">Peregrino</span> Perez
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg"
        >
          {t.hero.role}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          {/* Ver CV (modal) + Descargar CV */}
          <CvButton />
        </motion.div>
      </div>

      <motion.a
        href="#estadisticas"
        aria-label="Scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/40"
      >
        <ArrowDown className="size-6 animate-bounce" />
      </motion.a>
    </section>
  )
}
