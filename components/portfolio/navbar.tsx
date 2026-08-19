"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Menu, X } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageToggle } from "@/components/language-toggle"
import { usePageTransition } from "@/components/page-transition"
import { cn } from "@/lib/utils"

const SECTIONS = ["inicio", "acerca", "proyectos", "stack", "experiencia", "contacto"] as const

export function PortfolioNavbar() {
  const { t } = useLanguage()
  const { slideTo } = usePageTransition()
  const [active, setActive] = useState<string>("inicio")
  const [open, setOpen] = useState(false)

  // Navegación con overlay slide-left hacia RedFox_Solutions (respeta ctrl/cmd/middle-click).
  const goShadow = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || (e as React.MouseEvent).button !== 0) return
    e.preventDefault()
    setOpen(false)
    slideTo("/RedFox_Solutions", "left")
  }

  const links = [
    { id: "inicio", label: t.nav.home },
    { id: "acerca", label: t.nav.about },
    { id: "proyectos", label: t.nav.projects },
    { id: "stack", label: t.nav.techStack },
    { id: "experiencia", label: t.nav.experience },
    { id: "contacto", label: t.nav.contact },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    )
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-all duration-300 border-b border-transparent bg-transparent">
      <nav className="relative flex h-[4.4rem] w-full items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* DP — extremo izquierdo */}
        <a href="#inicio" className="shrink-0 text-white text-glow-purple">
          DP
        </a>

        {/* Secciones — centradas (en flujo normal, no se solapan) */}
        <ul className="hidden flex-1 items-center justify-center gap-1 xl:flex">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={cn(
                  "relative whitespace-nowrap rounded-md px-3.5 py-2 text-[0.95rem] transition-colors",
                  active === link.id ? "text-white" : "text-white/60 hover:text-white",
                )}
              >
                {link.label}
                {active === link.id && (
                  <span className="absolute inset-x-3 -bottom-px h-px bg-neon-purple shadow-[0_0_8px_var(--neon-purple)]" />
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* Cluster derecho — ES/EN y RedFox_Solutions al extremo derecho */}
        <div className="ml-auto flex shrink-0 items-center gap-2 xl:ml-0">
          <LanguageToggle className="hidden sm:inline-flex" />
          <Link
            href="/RedFox_Solutions"
            onClick={goShadow}
            className="hidden items-center gap-1.5 whitespace-nowrap rounded-full border border-neon-blue/40 bg-neon-blue/10 px-5 py-2 text-[0.95rem] font-medium text-neon-blue transition-all hover:glow-border-blue hover:bg-neon-blue/20 md:inline-flex"
          >
            <span className="text-white">Red</span>
            <span className="text-red-500">Fox</span>
            <span className="text-white">Solutions</span>
            <ArrowRight className="size-[18px]" aria-hidden="true" />
          </Link>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="inline-flex size-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white xl:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border/20 bg-background/90 px-4 py-4 backdrop-blur-md xl:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm",
                    active === link.id ? "bg-background/10 text-white" : "text-white/60",
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="/RedFox_Solutions"
              onClick={goShadow}
              className="flex items-center justify-center gap-1.5 rounded-full border border-neon-blue/40 bg-neon-blue/10 px-4 py-2 text-center text-sm font-medium text-neon-blue"
            >
              <span className="text-white">Red</span>
              <span className="text-red-500">Fox</span>
              <span className="text-white">Solutions</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <div className="flex items-center justify-between">
              <LanguageToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
