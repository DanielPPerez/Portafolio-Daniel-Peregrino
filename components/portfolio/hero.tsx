"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowDown, ChevronLeft, ChevronRight } from "lucide-react"
import { MatrixRain } from "@/components/matrix-rain"
import { CvButton } from "@/components/cv-button"
import { useLanguage } from "@/lib/i18n/language-context"
import { HeroHighlightCards } from "@/components/portfolio/hero-highlight-cards"

export function Hero() {
  const { t } = useLanguage()
  const [showCards, setShowCards] = useState(true)

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center overflow-hidden py-14 lg:py-16"
    >
      <MatrixRain />
      {/* gradient veil so text stays readable */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--background)]/60 via-[var(--background)]/80 to-[var(--background)]" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 size-[42rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--neon-purple), transparent 60%)" }}
        aria-hidden="true"
      />

      {/* Botón flotante para desplegar / ocultar tarjetas */}
      <button
        type="button"
        onClick={() => setShowCards((prev) => !prev)}
        aria-label={showCards ? "Ocultar tarjetas" : "Desplegar tarjetas"}
        title={showCards ? "Ocultar tarjetas" : "Desplegar tarjetas"}
        className="absolute right-4 sm:right-6 top-1/2 z-30 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-neon-purple/60 bg-background/80 text-foreground backdrop-blur-md shadow-[0_0_18px_var(--neon-purple)] transition-all hover:scale-110 hover:border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-purple"
      >
        {showCards ? (
          <ChevronRight className="size-6 text-neon-purple" />
        ) : (
          <ChevronLeft className="size-6 text-neon-purple animate-pulse" />
        )}
      </button>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pr-12 lg:pr-16">
        <div className="relative flex flex-col lg:flex-row items-center justify-center min-h-[480px]">
          {/* Columna principal: Información con animación fluida e instantánea al centrarse */}
          <motion.div
            layout
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className={`w-full transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              showCards
                ? "lg:w-[56%] lg:mr-auto text-left"
                : "max-w-4xl mx-auto text-center flex flex-col items-center justify-center"
            }`}
          >
            <div className="w-full">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`font-mono text-sm sm:text-base font-semibold text-neon-blue text-glow-blue tracking-wide transition-all duration-500 ${
                  showCards ? "text-left" : "text-center"
                }`}
              >
                {t.hero.greeting}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className={`mt-3 text-balance text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl lg:text-8xl transition-all duration-500 ${
                  showCards ? "text-left" : "text-center"
                }`}
              >
                Daniel <span className="text-neon-purple text-glow-purple">Peregrino</span> Perez
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className={`mt-6 max-w-2xl text-pretty text-lg sm:text-xl font-medium leading-relaxed text-foreground/80 transition-all duration-500 ${
                  showCards ? "text-left" : "text-center mx-auto"
                }`}
              >
                {t.hero.role}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className={`mt-8 flex flex-wrap items-center gap-4 transition-all duration-500 ${
                  showCards ? "justify-start" : "justify-center"
                }`}
              >
                {/* Ver CV (modal) + Descargar CV */}
                <CvButton />
              </motion.div>
            </div>
          </motion.div>

          {/* Columna derecha: Clúster de tarjetas desplegables */}
          <AnimatePresence>
            {showCards && (
              <motion.div
                key="cards-container"
                initial={{ opacity: 0, x: 80, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                className="w-full lg:w-[41%] lg:absolute lg:right-0 shrink-0 mt-8 lg:mt-0 max-h-[calc(100vh-6.5rem)] overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1"
              >
                <HeroHighlightCards />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.a
        href="#estadisticas"
        aria-label="Scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/40 hover:text-white transition-colors"
      >
        <ArrowDown className="size-6 animate-bounce" />
      </motion.a>
    </section>
  )
}
