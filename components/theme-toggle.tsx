"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThemeTransition } from "@/components/theme-transition"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionOrigin, setTransitionOrigin] = useState({ x: 0, y: 0 })
  const [targetTheme, setTargetTheme] = useState(false)
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
    if (isTransitioning) return

    const rect = buttonRef.current?.getBoundingClientRect()
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2

    const newTheme = isDark ? "light" : "dark"
    setTransitionOrigin({ x, y })
    setTargetTheme(newTheme === "dark")
    setIsTransitioning(true)
  }

  const handleTransitionComplete = () => {
    setTheme(targetTheme ? "dark" : "light")
    // Pequeño delay para que el cambio de tema ocurra después de la animación
    setTimeout(() => {
      setIsTransitioning(false)
    }, 100)
  }

  return (
    <>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        disabled={isTransitioning}
        className="relative"
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      <ThemeTransition
        isActive={isTransitioning}
        origin={transitionOrigin}
        isDark={targetTheme}
        onComplete={handleTransitionComplete}
      />
    </>
  )
}
