"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, Menu, X } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageToggle } from "@/components/language-toggle"
import { ThemeToggle } from "@/components/shadow/theme-toggle"
import { usePageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ShadowNavbar() {
  const { t } = useLanguage()
  const { slideTo } = usePageTransition()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  // Navegación con overlay slide-right de vuelta al portafolio.
  const goPortfolio = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || (e as React.MouseEvent).button !== 0) return
    e.preventDefault()
    setOpen(false)
    slideTo("/", "right")
  }

  const links = [
    { id: "servicios", label: t.shadow.nav.services },
    { id: "proceso", label: t.shadow.nav.process },
    { id: "cotizar", label: t.shadow.nav.quote },
    { id: "testimonios", label: t.shadow.nav.testimonials },
    { id: "faq", label: t.shadow.nav.faq },
    { id: "contacto", label: t.shadow.nav.contact },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <nav className="relative flex h-[4.4rem] w-full items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo + nombre — extremo izquierdo */}
        <a
          href="#hero"
          className="flex shrink-0 items-center gap-2 text-[1.05rem] font-semibold tracking-tight text-foreground"
        >
          <motion.span
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="relative size-9"
          >
            <Image
              src="/new_logo.png"
              alt="RedFox_Solutions"
              fill
              sizes="36px"
              className="object-contain"
            />
          </motion.span>
          <span className="text-foreground">Red</span>
          <span className="text-red-500">Fox</span>
          <span className="text-foreground">Solutions</span>
        </a>

        {/* Secciones — centradas (en flujo normal, no se solapan) */}
        <ul className="hidden flex-1 items-center justify-center gap-1 xl:flex">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className="whitespace-nowrap rounded-md px-3.5 py-2 text-[0.95rem] text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Cluster derecho — extremo derecho */}
        <div className="ml-auto flex shrink-0 items-center gap-2 xl:ml-0">
          <LanguageToggle variant="sober" className="hidden sm:inline-flex" />
          <ThemeToggle />
          <Button
            render={<Link href="/" onClick={goPortfolio} />}
            nativeButton={false}
            variant="ghost"
            className="hidden whitespace-nowrap text-[0.95rem] md:inline-flex"
          >
            <ArrowLeft className="size-[18px]" aria-hidden="true" />
            {t.shadow.nav.backToPortfolio}
          </Button>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-card text-foreground xl:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-background/95 px-4 py-4 backdrop-blur-md xl:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between gap-3">
            <LanguageToggle variant="sober" />
            <Button
              render={<Link href="/" onClick={goPortfolio} />}
              nativeButton={false}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              {t.shadow.nav.backToPortfolio}
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
