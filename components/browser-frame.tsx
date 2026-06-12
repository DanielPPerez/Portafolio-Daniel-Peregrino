"use client"

import { useState } from "react"
import { ExternalLink, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

type BrowserFrameProps = {
  url: string
  title: string
  visitLabel: string
  /** Optional fallback image shown if the iframe fails / blocks embedding. */
  fallbackImage?: string
  variant?: "neon" | "sober"
}

export function BrowserFrame({
  url,
  title,
  visitLabel,
  fallbackImage,
  variant = "neon",
}: BrowserFrameProps) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  let host = url
  try {
    host = new URL(url).host
  } catch {
    host = url
  }

  const neon = variant === "neon"

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border",
        neon ? "border-white/10 bg-[#0c0c12]" : "border-border bg-muted/40",
      )}
    >
      {/* Top bar */}
      <div
        className={cn(
          "flex items-center gap-2 border-b px-3 py-2",
          neon ? "border-white/10 bg-white/5" : "border-border bg-muted",
        )}
      >
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-neon-red/80" />
          <span className="size-2.5 rounded-full bg-[#f5c453]" />
          <span className="size-2.5 rounded-full bg-[#5fd07a]" />
        </div>
        <div
          className={cn(
            "ml-2 flex flex-1 items-center gap-1.5 truncate rounded-md px-2 py-1 text-xs",
            neon ? "bg-black/40 text-white/60" : "bg-background text-muted-foreground",
          )}
        >
          <Globe className="size-3 shrink-0" aria-hidden="true" />
          <span className="truncate">{host}</span>
        </div>
      </div>

      {/* Viewport */}
      <div className="relative aspect-[16/10] w-full">
        {!failed ? (
          <>
            {!loaded && (
              <div
                className={cn(
                  "absolute inset-0 animate-pulse",
                  neon ? "bg-white/5" : "bg-muted",
                )}
                aria-hidden="true"
              />
            )}
            <iframe
              src={url}
              title={title}
              loading="lazy"
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-popups"
              className="h-full w-full bg-white"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
            />
          </>
        ) : (
          <div
            className={cn(
              "flex h-full w-full flex-col items-center justify-center gap-3 text-center",
              neon ? "bg-gradient-to-br from-[#14101f] to-[#0c0c12]" : "bg-muted",
            )}
          >
            {fallbackImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={fallbackImage} alt={title} className="h-full w-full object-cover" />
            ) : (
              <Globe
                className={cn("size-10", neon ? "text-neon-blue" : "text-muted-foreground")}
                aria-hidden="true"
              />
            )}
          </div>
        )}

        {/* Overlay visit button */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur transition-colors",
            neon
              ? "bg-neon-purple/90 text-white hover:bg-neon-purple"
              : "bg-brand text-brand-foreground hover:opacity-90",
          )}
        >
          {visitLabel}
          <ExternalLink className="size-3" aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
