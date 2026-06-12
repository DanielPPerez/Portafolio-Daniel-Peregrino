"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"

/**
 * Transición de deslizamiento entre páginas: la página entrante se desliza desde la
 * derecha al ir a /shadow360 y desde la izquierda al volver a /.
 *
 * Al terminar conmutamos a un <div> SIN transform: un ancestro con `transform` (incluido
 * translateX(0)) rompe `position: fixed` (el navbar). `template.tsx` se remonta en cada
 * navegación, así que `done` se reinicia solo.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isShadow = pathname.startsWith("/shadow360")
  const [done, setDone] = useState(false)

  if (done) {
    return <div className="min-h-screen">{children}</div>
  }

  return (
    <div className="relative overflow-hidden">
      <motion.div
        initial={{ x: isShadow ? "100%" : "-100%" }}
        animate={{ x: 0 }}
        transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
        onAnimationComplete={() => setDone(true)}
        style={{ willChange: "transform" }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </div>
  )
}
