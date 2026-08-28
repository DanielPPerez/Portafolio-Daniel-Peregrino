"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThemeTransition } from "@/components/theme-transition"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [veil, setVeil] = useState<{ x: number; y: number; fromDark: boolean } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="relative">
        <Sun className="h-5 w-5" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  const handleToggle = () => {
    const rect = buttonRef.current?.getBoundingClientRect()
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2

    const newTheme = isDark ? "light" : "dark"

    // Paint-first: aplica el tema inmediatamente (variables CSS). El contenido
    // se recolorea desde el primer frame sin bloquear el hilo principal.
    setTheme(newTheme)

    // Velo puramente decorativo. Con prefers-reduced-motion no se monta siquiera.
    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!reduceMotion) {
      setVeil({ x, y, fromDark: isDark })
    }
  }

  return (
    <>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className="relative"
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      {veil && <ThemeTransition origin={veil} onComplete={() => setVeil(null)} />}
    </>
  )
}
