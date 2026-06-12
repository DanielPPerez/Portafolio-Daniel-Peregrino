"use client"

import { useEffect, useRef } from "react"

/**
 * Performant Matrix-style character rain rendered on a canvas.
 * - Uses requestAnimationFrame and throttles redraws.
 * - Pauses automatically when the tab is hidden.
 * - Subtle neon palette so it never competes with foreground text.
 */
export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return
    const context = canvasEl.getContext("2d")
    if (!context) return
    // Bindings ya estrechados a no-nulos para que las funciones internas (closures) los vean así.
    const canvas = canvasEl
    const ctx = context

    const chars = "アァカサタナハマヤラワン0123456789ABCDEFｦｧｨｩABCDEF<>=/*-+".split("")
    const neon = ["#a855f7", "#3b82f6", "#ef4444"]
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
      colors = new Array(columns).fill(0).map(() => neon[Math.floor(Math.random() * neon.length)])
    }

    setup()

    let raf = 0
    let last = 0
    const interval = 1000 / 18 // throttle to ~18fps for subtlety + perf

    function draw(time: number) {
      raf = requestAnimationFrame(draw)
      if (time - last < interval) return
      last = time

      ctx.fillStyle = "rgba(8, 8, 12, 0.12)"
      ctx.fillRect(0, 0, width, height)
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize
        ctx.fillStyle = colors[i]
        ctx.globalAlpha = 0.55
        ctx.fillText(text, x, y)
        ctx.globalAlpha = 1

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0
          colors[i] = neon[Math.floor(Math.random() * neon.length)]
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
      className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
    />
  )
}
