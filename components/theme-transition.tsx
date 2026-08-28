"use client"

import { useEffect, useRef, type CSSProperties } from "react"

interface ThemeTransitionProps {
  origin: { x: number; y: number; fromDark: boolean }
  onComplete: () => void
}

/**
 * Velo decorativo del cambio de tema (paint-first).
 *
 * El contenido real ya está en el tema nuevo desde el primer frame (la llamada
 * a `setTheme` ocurre antes de montar este componente). Este div pinta el color
 * del tema ANTERIOR y se encoge con `clip-path` desde pantalla-completa hasta el
 * punto del click, "revelando" el tema nuevo. Es animación CSS pura (clip-path),
 * desacoplada por completo del costo de re-renderizar componentes pesados.
 */
export function ThemeTransition({ origin, onComplete }: ThemeTransitionProps) {
  const veilRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = veilRef.current
    if (!el) return
    const handleEnd = (e: AnimationEvent) => {
      if (e.animationName === "theme-veil-reveal") {
        onComplete()
      }
    }
    el.addEventListener("animationend", handleEnd)
    return () => el.removeEventListener("animationend", handleEnd)
  }, [onComplete])

  // Color de fondo del tema que se está abandonando, igual que las variables CSS.
  const bg = origin.fromDark ? "oklch(0.145 0 0)" : "oklch(1 0 0)"

  const style = {
    background: bg,
    "--veil-x": `${origin.x}px`,
    "--veil-y": `${origin.y}px`,
  } as CSSProperties

  return <div ref={veilRef} aria-hidden="true" className="theme-veil" style={style} />
}
