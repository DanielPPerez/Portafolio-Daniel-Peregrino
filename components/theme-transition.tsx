"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface ThemeTransitionProps {
  isActive: boolean
  origin: { x: number; y: number }
  isDark: boolean
  onComplete: () => void
}

export function ThemeTransition({ isActive, origin, isDark, onComplete }: ThemeTransitionProps) {
  const [radius, setRadius] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isActive && typeof window !== "undefined") {
      const maxDim = Math.max(window.innerWidth, window.innerHeight)
      setRadius(maxDim * 1.5)
      // Pequeño retraso para que el click se registre bien
      const timer = setTimeout(() => setIsVisible(true), 50)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [isActive])

  const bgColor = isDark ? "#0a0a0a" : "#ffffff"

  return (
    <AnimatePresence>
      {isActive && isVisible && (
        <>
          {/* Overlay semi-transparente para suavizar la transición */}
          <motion.div
            className="fixed inset-0 z-[9998] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ backgroundColor: bgColor }}
          />

          {/* Círculo de expansión */}
          <motion.div
            className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="absolute rounded-full"
              style={{
                top: origin.y,
                left: origin.x,
                backgroundColor: bgColor,
                transform: "translate(-50%, -50%)",
                width: 0,
                height: 0,
              }}
              animate={{
                width: radius * 2,
                height: radius * 2,
              }}
              transition={{
                duration: 0.5, // Reducido de 0.7 a 0.5
                ease: [0.4, 0, 0.2, 1], // Easing más rápido
              }}
              onAnimationComplete={() => {
                // Pequeño retraso antes de completar para asegurar el renderizado
                setTimeout(onComplete, 100)
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
