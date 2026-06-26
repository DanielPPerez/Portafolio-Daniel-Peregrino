"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SocialBar } from "@/components/social-bar"
import { useLanguage } from "@/lib/i18n/language-context"
import { usePageTransition } from "@/components/page-transition"

export function ShadowFooter() {
  const { t } = useLanguage()
  const { slideTo } = usePageTransition()

  const goPortfolio = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || (e as React.MouseEvent).button !== 0) return
    e.preventDefault()
    slideTo("/", "right")
  }

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <Link href="/shadow360" className="text-lg font-bold tracking-tight text-foreground">
            Shadow<span className="text-brand">360</span>Solutions
          </Link>
          <p className="max-w-md text-pretty text-sm text-muted-foreground">
            {t.shadow.footer.tagline}
          </p>
          <SocialBar variant="sober" />
          <Link
            href="/"
            onClick={goPortfolio}
            className="inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand/80"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t.shadow.nav.backToPortfolio}
          </Link>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Shadow360Solutions. {t.shadow.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
