"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"

type Dir = "left" | "right"
type Phase = "idle" | "cover" | "reveal"

type Ctx = { slideTo: (href: string, dir: Dir) => void }

const PageTransitionContext = createContext<Ctx | null>(null)

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext)
  if (!ctx) throw new Error("usePageTransition must be used within PageTransitionProvider")
  return ctx
}

/**
 * Transición tipo "overlay slide" (estilo animsition): al navegar, un panel barre la
 * pantalla cubriéndola (slide-in), se hace el cambio de ruta por debajo, y luego el panel
 * se desliza fuera (slide-out) revelando la nueva página.
 *
 * Dirección:
 *  - "left"  (ir a /RedFox_Solutions): entra desde la derecha → sale por la izquierda.
 *  - "right" (volver a /):        entra desde la izquierda → sale por la derecha.
 */
export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [phase, setPhase] = useState<Phase>("idle")
  const [dir, setDir] = useState<Dir>("left")
  const targetRef = useRef<string | null>(null)
  const phaseRef = useRef<Phase>("idle")
  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  const slideTo = useCallback(
    (href: string, d: Dir) => {
      if (phaseRef.current !== "idle" || href === pathname) return
      targetRef.current = href
      setDir(d)
      setPhase("cover")
    },
    [pathname],
  )

  // Cuando la ruta destino ya montó (oculta bajo el overlay), revelar.
  useEffect(() => {
    if (phase === "cover" && targetRef.current && pathname === targetRef.current) {
      setPhase("reveal")
    }
  }, [pathname, phase])

  const coverFrom = dir === "left" ? "100%" : "-100%"
  const revealTo = dir === "left" ? "-100%" : "100%"

  /** Avanza la máquina de estados del overlay al terminar cada animación. */
  function handleComplete() {
    if (phaseRef.current === "cover") {
      // @sideffect navegación: cambia la ruta una vez la pantalla está cubierta
      if (targetRef.current) router.push(targetRef.current)
    } else if (phaseRef.current === "reveal") {
      setPhase("idle")
      targetRef.current = null
    }
  }

  return (
    <PageTransitionContext.Provider value={{ slideTo }}>
      {children}
      {phase !== "idle" && (
        <motion.div
          key="page-overlay"
          aria-hidden="true"
          initial={{ x: coverFrom }}
          animate={{ x: phase === "cover" ? "0%" : revealTo }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={handleComplete}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-neon-purple via-[#0c0c12] to-[#ff3b30]"
          style={{ willChange: "transform" }}
        >
          <span className="font-mono text-2xl font-bold tracking-[0.3em] text-white/90 text-glow-purple sm:text-4xl">
            {dir === "left" ? "RedFox_Solutions" : "DP"}
          </span>
        </motion.div>
      )}
    </PageTransitionContext.Provider>
  )
}
