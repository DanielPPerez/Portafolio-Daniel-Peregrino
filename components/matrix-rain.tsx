"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

/**
 * Performant Matrix-style character rain rendered on a canvas.
 * - Uses requestAnimationFrame and throttles redraws.
 * - Pauses automatically when the tab is hidden.
 * - Adapts palette to current theme (dark vs light) per-frame, sin reconstruir
 *   el canvas en cada cambio de tema (desacoplado del click del toggle).
 */
export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  // Reflejo del tema para leerlo dentro del loop de rAF sin re-montar el effect.
  const themeRef = useRef(resolvedTheme)

  useEffect(() => {
    themeRef.current = resolvedTheme
  }, [resolvedTheme])

  useEffect(() => {
    // Paleta según tema — se resuelve por frame, no en el tick del click.
    const paletteFor = (isDark: boolean): string[] =>
      isDark
        ? ["#a855f7", "#3b82f6", "#ef4444"]
        : ["rgba(124, 58, 237, 0.6)", "rgba(37, 99, 235, 0.6)", "rgba(220, 38, 38, 0.6)"]

    const canvasEl = canvasRef.current
    if (!canvasEl) return
    const context = canvasEl.getContext("2d")
    if (!context) return
    const canvas = canvasEl
    const ctx = context

    const chars = "アァカサタナハマヤラワン0123456789ABCDEFｦｧｨｩABCDEF<>=/*-+".split("")
    const fontSize = 16
    let columns = 0
    let drops: number[] = []
    let colors: string[] = []
    let width = 0
    let height = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function setup() {
      width = canvas.parentElement?.clientWidth ?? window.innerWidth
      height = canvas.parentElement?.clientHeight ?? window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      columns = Math.floor(width / fontSize)
      drops = new Array(columns).fill(0).map(() => Math.floor((Math.random() * height) / fontSize))
      const palette = paletteFor(themeRef.current === "dark")
      colors = new Array(columns)
        .fill(0)
        .map(() => palette[Math.floor(Math.random() * palette.length)])
    }

    setup()

    let raf = 0
    let last = 0
    const interval = 1000 / 18
    let lastThemeDark = themeRef.current === "dark"

    function draw(time: number) {
      raf = requestAnimationFrame(draw)
      if (time - last < interval) return
      last = time

      const isDark = themeRef.current === "dark"
      const palette = paletteFor(isDark)

      // Si el tema cambió desde el último frame, recolorea las gotas (barato:
      // solo re-asigna strings, no reconstruye dimensiones ni arreglos).
      if (isDark !== lastThemeDark) {
        lastThemeDark = isDark
        for (let i = 0; i < colors.length; i++) {
          colors[i] = palette[Math.floor(Math.random() * palette.length)]
        }
      }

      // Fondo adaptado al tema - más transparente en claro para no tapar
      ctx.fillStyle = isDark ? "rgba(8, 8, 12, 0.12)" : "rgba(255, 255, 255, 0.05)"
      ctx.fillRect(0, 0, width, height)
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize
        ctx.fillStyle = colors[i]
        // Mayor opacidad en modo claro para que se vea mejor
        ctx.globalAlpha = isDark ? 0.55 : 0.7
        ctx.fillText(text, x, y)
        ctx.globalAlpha = 1

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0
          colors[i] = palette[Math.floor(Math.random() * palette.length)]
        }
        drops[i]++
      }
    }

    raf = requestAnimationFrame(draw)

    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(raf)
      } else {
        last = 0
        lastThemeDark = themeRef.current === "dark"
        raf = requestAnimationFrame(draw)
      }
    }

    let resizeTimer: ReturnType<typeof setTimeout>
    function handleResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(setup, 150)
    }

    document.addEventListener("visibilitychange", handleVisibility)
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener("visibilitychange", handleVisibility)
      window.removeEventListener("resize", handleResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  )
}
