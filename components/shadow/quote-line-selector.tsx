"use client"

import { Laptop, Wrench, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BusinessLineHint } from "@/lib/quote/types"

export type QuoteLineOption = {
  value: BusinessLineHint
  icon: LucideIcon
  label: string
  description: string
}

type Props = {
  options: ReadonlyArray<QuoteLineOption>
  onSelect: (value: BusinessLineHint) => void
  current?: BusinessLineHint | null
  title?: string
  subtitle?: string
}

export function defaultLineOptions(t: {
  software: string
  softwareDescription: string
  repair: string
  repairDescription: string
}): ReadonlyArray<QuoteLineOption> {
  return [
    {
      value: "software",
      icon: Laptop,
      label: t.software,
      description: t.softwareDescription,
    },
    {
      value: "repair",
      icon: Wrench,
      label: t.repair,
      description: t.repairDescription,
    },
  ]
}

export function QuoteLineSelector({ options, onSelect, current, title, subtitle }: Props) {
  return (
    <div className="mx-auto max-w-2xl">
      {title && <h3 className="text-center text-lg font-semibold text-foreground">{title}</h3>}
      {subtitle && <p className="mt-1 text-center text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const Icon = opt.icon
          const isCurrent = current === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={cn(
                "flex flex-col items-start gap-2 rounded-2xl border bg-card p-5 text-left transition-colors",
                isCurrent
                  ? "border-brand ring-2 ring-brand/30"
                  : "border-border hover:border-brand/40",
              )}
              aria-pressed={isCurrent}
            >
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-foreground">{opt.label}</span>
              <span className="text-xs text-muted-foreground">{opt.description}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
