"use client"

import { Children, useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const AUTOPLAY_INTERVAL_MS = 3500
const SWIPE_THRESHOLD_PX = 40

type TechCarouselProps = {
  children: React.ReactNode[]
}

export function TechCarousel({ children }: TechCarouselProps) {
  const slides = Children.toArray(children)
  const count = slides.length
  const [rotationIndex, setRotationIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(1200)
  const [isMounted, setIsMounted] = useState(false)
  const viewportRef = useRef<HTMLDivElement>(null)
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const touchStartXRef = useRef<number | null>(null)
  const isDraggingRef = useRef(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    if (!viewportRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setViewportWidth(entry.contentRect.width)
        }
      }
    })
    observer.observe(viewportRef.current)
    return () => observer.disconnect()
  }, [])

  const activeIndex = ((rotationIndex % count) + count) % count

  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current)
    if (reducedMotion || count <= 1) return
    autoplayRef.current = setInterval(() => {
      setRotationIndex((prev) => prev + 1)
    }, AUTOPLAY_INTERVAL_MS)
  }, [reducedMotion, count])

  const pauseAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current)
  }, [])

  useEffect(() => {
    startAutoplay()
    return () => pauseAutoplay()
  }, [startAutoplay, pauseAutoplay])

  const handleManualNav = (action: () => void) => {
    action()
    startAutoplay()
  }

  const prevSlide = () => handleManualNav(() => setRotationIndex((prev) => prev - 1))
  const nextSlide = () => handleManualNav(() => setRotationIndex((prev) => prev + 1))

  const goToSlide = (targetIndex: number) => {
    handleManualNav(() => {
      let diff = targetIndex - activeIndex
      if (diff > count / 2) diff -= count
      if (diff < -count / 2) diff += count
      setRotationIndex((prev) => prev + diff)
    })
  }

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    pauseAutoplay()
    isDraggingRef.current = true
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    touchStartXRef.current = clientX
  }

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDraggingRef.current || touchStartXRef.current === null) return
    const clientX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX
    const diffX = clientX - touchStartXRef.current

    if (diffX < -SWIPE_THRESHOLD_PX) {
      nextSlide()
    } else if (diffX > SWIPE_THRESHOLD_PX) {
      prevSlide()
    } else {
      startAutoplay()
    }

    isDraggingRef.current = false
    touchStartXRef.current = null
  }

  // DIMENSIONES MÁS GRANDES para mejor legibilidad
  const cellWidth = Math.min(
    viewportWidth * 0.85, // Más ancho (era 0.72)
    viewportWidth < 640 ? 380 : 780, // Más grande en móvil y desktop
  )
  const angleStep = 360 / Math.max(1, count)
  const ringRadius = Math.max(280, cellWidth / (2 * Math.tan(Math.PI / Math.max(1, count))))

  const formatValue = (value: number, decimals = 3) => {
    return Number(value.toFixed(decimals))
  }

  const formattedRingRadius = formatValue(ringRadius)
  const formattedCellWidth = formatValue(cellWidth)

  if (!isMounted) {
    return (
      <div className="relative w-full py-6 select-none">
        <div className="relative mx-auto h-[34rem] sm:h-[38rem] w-full max-w-7xl overflow-visible">
          <div className="relative h-full w-full flex items-center justify-center">
            <div className="text-foreground/40">Cargando carrusel...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative w-full py-8 select-none"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={startAutoplay}
      onFocus={pauseAutoplay}
      onBlur={startAutoplay}
    >
      <button
        type="button"
        aria-label="Área anterior"
        onClick={prevSlide}
        className="absolute left-2 sm:left-6 top-1/2 z-40 -translate-y-1/2 rounded-full border border-neon-purple/60 bg-[#0c0c14]/90 p-4 text-neon-purple shadow-[0_0_30px_rgba(168,85,247,0.4)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-neon-purple hover:bg-[#141424] focus:outline-none focus:ring-2 focus:ring-neon-purple"
      >
        <ChevronLeft className="h-7 w-7 text-neon-purple" />
      </button>

      <div
        ref={viewportRef}
        className="relative mx-auto h-[34rem] sm:h-[38rem] w-full max-w-7xl overflow-visible [perspective:1800px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
      >
        <div
          className="relative h-full w-full [transform-style:preserve-3d] transition-transform duration-700 ease-out"
          style={{
            transform: `translateZ(${-formattedRingRadius}px) rotateY(${-rotationIndex * angleStep}deg)`,
          }}
        >
          {slides.map((slide, i) => {
            const cellAngle = i * angleStep
            let diff = i - activeIndex
            while (diff > count / 2) diff -= count
            while (diff < -count / 2) diff += count

            const isFront = diff === 0
            const isSide = Math.abs(diff) === 1
            const isVisible = Math.abs(diff) <= 1.5

            const opacity = isFront ? 1 : isSide ? 0.6 : 0.05
            const filter = isFront ? "none" : "brightness(0.6) blur(1px)"
            const pointerEvents = isFront ? "auto" : "none"
            const visibility = isVisible ? "visible" : "hidden"
            const scale = isFront ? 1 : isSide ? 0.95 : 0.9

            return (
              <div
                key={i}
                aria-hidden={!isFront}
                className="absolute top-0 h-full [transform-style:preserve-3d] transition-all duration-700"
                style={{
                  left: "50%",
                  width: `${formattedCellWidth}px`,
                  transform: `translateX(-50%) rotateY(${cellAngle}deg) translateZ(${formattedRingRadius}px) scale(${scale})`,
                  opacity,
                  filter,
                  pointerEvents,
                  visibility,
                }}
              >
                <div className="mx-auto h-full w-full">{slide}</div>
              </div>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        aria-label="Área siguiente"
        onClick={nextSlide}
        className="absolute right-2 sm:right-6 top-1/2 z-40 -translate-y-1/2 rounded-full border border-neon-purple/60 bg-[#0c0c14]/90 p-4 text-neon-purple shadow-[0_0_30px_rgba(168,85,247,0.4)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-neon-purple hover:bg-[#141424] focus:outline-none focus:ring-2 focus:ring-neon-purple"
      >
        <ChevronRight className="h-7 w-7 text-neon-purple" />
      </button>

      <div className="mt-8 flex justify-center items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir al área ${i + 1}`}
            onClick={() => goToSlide(i)}
            className={`h-3 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-10 bg-neon-purple shadow-[0_0_16px_var(--neon-purple)]"
                : "w-3 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
