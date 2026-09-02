"use client"

import { Children, useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const AUTOPLAY_INTERVAL_MS = 3500
const SWIPE_THRESHOLD_PX = 40
const MOBILE_BREAKPOINT = 768

type TechCarouselProps = {
  children: React.ReactNode[]
}

export function TechCarousel({ children }: TechCarouselProps) {
  const slides = Children.toArray(children)
  const count = slides.length
  const [rotationIndex, setRotationIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(
    typeof window === "undefined" ? 1200 : window.innerWidth,
  )
  const [isMounted, setIsMounted] = useState(false)
  const viewportRef = useRef<HTMLDivElement>(null)
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const touchStartXRef = useRef<number | null>(null)
  const isDraggingRef = useRef(false)

  useEffect(() => {
    setIsMounted(true)
    const update = () => setViewportWidth(window.innerWidth)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const activeIndex = ((rotationIndex % count) + count) % count
  const isMobile = viewportWidth < MOBILE_BREAKPOINT

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

  const arrows = (
    <>
      <button
        type="button"
        aria-label="Área anterior"
        onClick={prevSlide}
        className="absolute left-1 sm:left-6 top-1/2 z-40 -translate-y-1/2 rounded-full border border-neon-purple/60 bg-[#0c0c14]/90 p-2 sm:p-4 text-neon-purple shadow-[0_0_30px_rgba(168,85,247,0.4)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-neon-purple hover:bg-[#141424] focus:outline-none focus:ring-2 focus:ring-neon-purple"
      >
        <ChevronLeft className="h-5 w-5 sm:h-7 sm:w-7 text-neon-purple" />
      </button>
      <button
        type="button"
        aria-label="Área siguiente"
        onClick={nextSlide}
        className="absolute right-1 sm:right-6 top-1/2 z-40 -translate-y-1/2 rounded-full border border-neon-purple/60 bg-[#0c0c14]/90 p-2 sm:p-4 text-neon-purple shadow-[0_0_30px_rgba(168,85,247,0.4)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-neon-purple hover:bg-[#141424] focus:outline-none focus:ring-2 focus:ring-neon-purple"
      >
        <ChevronRight className="h-5 w-5 sm:h-7 sm:w-7 text-neon-purple" />
      </button>
    </>
  )

  const dots = (
    <div className="mt-6 flex justify-center items-center gap-3 sm:mt-8">
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
  )

  if (!isMounted) {
    return (
      <div className="relative w-full py-6 select-none">
        <div className="relative mx-auto min-h-48 w-full max-w-7xl" />
      </div>
    )
  }

  // Móvil / tablet: slider 2D de una card completa (sin anillo 3D).
  if (isMobile) {
    return (
      <div
        className="relative w-full py-4 select-none"
        onMouseEnter={pauseAutoplay}
        onMouseLeave={startAutoplay}
      >
        {arrows}
        <div
          ref={viewportRef}
          className="relative mx-auto w-full overflow-hidden px-10"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <div key={i} className="w-full min-w-0 shrink-0" aria-hidden={i !== activeIndex}>
                {slide}
              </div>
            ))}
          </div>
        </div>
        {dots}
      </div>
    )
  }

  const isTablet = viewportWidth < 1024
  const cellWidth = isTablet
    ? Math.min(viewportWidth * 0.62, 520)
    : Math.min(viewportWidth * 0.72, 780)
  const angleStep = 360 / Math.max(1, count)
  const derivedRadius = cellWidth / (2 * Math.tan(Math.PI / Math.max(1, count)))
  const ringRadius = isTablet ? Math.max(220, derivedRadius) : Math.max(280, derivedRadius)
  const perspectivePx = isTablet ? 1200 : 1800
  const formattedRingRadius = Number(ringRadius.toFixed(3))
  const formattedCellWidth = Number(cellWidth.toFixed(3))

  return (
    <div
      className="relative w-full py-8 select-none"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={startAutoplay}
      onFocus={pauseAutoplay}
      onBlur={startAutoplay}
    >
      {arrows}

      <div
        ref={viewportRef}
        className="relative mx-auto h-[34rem] w-full max-w-7xl overflow-hidden lg:h-[38rem] lg:overflow-visible"
        style={{ perspective: `${perspectivePx}px` }}
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

            return (
              <div
                key={i}
                aria-hidden={!isFront}
                className="absolute top-0 h-full [transform-style:preserve-3d] transition-all duration-700"
                style={{
                  left: "50%",
                  width: `${formattedCellWidth}px`,
                  transform: `translateX(-50%) rotateY(${cellAngle}deg) translateZ(${formattedRingRadius}px) scale(${isFront ? 1 : isSide ? 0.95 : 0.9})`,
                  opacity: isFront ? 1 : isSide ? 0.6 : 0.05,
                  filter: isFront ? "none" : "brightness(0.6) blur(1px)",
                  pointerEvents: isFront ? "auto" : "none",
                  visibility: isVisible ? "visible" : "hidden",
                }}
              >
                <div className="mx-auto h-full w-full overflow-auto">{slide}</div>
              </div>
            )
          })}
        </div>
      </div>

      {dots}
    </div>
  )
}
