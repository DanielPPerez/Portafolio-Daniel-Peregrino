"use client"

import { Languages } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { cn } from "@/lib/utils"

export function LanguageToggle({
  className,
  variant = "neon",
}: {
  className?: string
  variant?: "neon" | "sober"
}) {
  const { locale, setLocale } = useLanguage()

  return (
    <div
      role="group"
      aria-label="Language selector"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border p-1 pl-2.5 text-[0.8rem] font-medium",
        variant === "neon" ? "border-white/15 bg-white/5" : "border-border bg-muted",
        className,
      )}
    >
      <Languages
        className={cn("size-4", variant === "neon" ? "text-white/60" : "text-muted-foreground")}
        aria-hidden="true"
      />
      {(["es", "en"] as const).map((code) => {
        const active = locale === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={active}
            className={cn(
              "rounded-full px-3 py-1.5 uppercase transition-colors focus-visible:outline-none focus-visible:ring-2",
              variant === "neon"
                ? active
                  ? "bg-neon-purple/90 text-white focus-visible:ring-neon-purple"
                  : "text-white/60 hover:text-white focus-visible:ring-white/40"
                : active
                  ? "bg-brand text-brand-foreground focus-visible:ring-brand"
                  : "text-muted-foreground hover:text-foreground focus-visible:ring-ring",
            )}
          >
            {code}
          </button>
        )
      })}
    </div>
  )
}
