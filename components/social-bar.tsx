"use client"

import { socialLinks } from "@/lib/site-data"
import { cn } from "@/lib/utils"

export function SocialBar({ variant = "neon" }: { variant?: "neon" | "sober" }) {
  const neon = variant === "neon"
  return (
    <ul className="flex flex-wrap items-center gap-3">
      {socialLinks.map((social) => {
        const Icon = social.icon
        return (
          <li key={social.name}>
            <a
              href={social.href}
              target={social.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={social.name}
              className={cn(
                "group inline-flex size-11 items-center justify-center rounded-full border transition-all",
                neon
                  ? "border-white/10 bg-white/5 text-white/70 hover:border-neon-purple/60 hover:text-white hover:glow-border-purple"
                  : "border-border bg-card text-muted-foreground hover:border-brand hover:text-brand",
              )}
            >
              <Icon className="size-5" />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
