"use client"

import { useState } from "react"
import { Download, ExternalLink, Eye, FileText, Maximize2, Minimize2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CV_PATHS } from "@/lib/site-data"
import { useLanguage } from "@/lib/i18n/language-context"
import { cn } from "@/lib/utils"

export function CvButton() {
  const { t, locale } = useLanguage()
  const cvPath = CV_PATHS[locale]
  const [expanded, setExpanded] = useState(false)

  const ctrlClass =
    "inline-flex size-8 items-center justify-center rounded-md border border-white/10 text-white/70 transition-colors hover:bg-white/10 hover:text-white"

  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger
          render={
            <Button
              size="sm"
              variant="outline"
              className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            />
          }
        >
          <Eye className="size-4" aria-hidden="true" />
          {t.nav.viewCV}
        </DialogTrigger>
        <DialogContent
          className={cn(
            "border-white/10 bg-[#0c0c12] text-white transition-[max-width] duration-200",
            expanded ? "max-w-[96vw] sm:max-w-[96vw]" : "max-w-3xl sm:max-w-3xl",
          )}
        >
          <DialogHeader className="flex-row items-center justify-between gap-2 pr-10">
            <DialogTitle className="flex items-center gap-2 text-white">
              <FileText className="size-4 text-neon-purple" aria-hidden="true" />
              {t.nav.cvTitle}
            </DialogTitle>
            <div className="flex items-center gap-1">
              <a
                href={cvPath}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.nav.openInNewTab}
                title={t.nav.openInNewTab}
                className={ctrlClass}
              >
                <ExternalLink className="size-4" />
              </a>
              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                aria-label={expanded ? t.nav.cvCollapse : t.nav.cvExpand}
                title={expanded ? t.nav.cvCollapse : t.nav.cvExpand}
                className={ctrlClass}
              >
                {expanded ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
              </button>
            </div>
          </DialogHeader>
          <div
            className={cn(
              "w-full overflow-hidden rounded-md border border-white/10 bg-white transition-[height] duration-200",
              expanded ? "h-[80vh]" : "h-[70vh]",
            )}
          >
            <iframe src={cvPath} title="Daniel Peregrino CV" className="h-full w-full" />
          </div>
          <div className="flex justify-end">
            <Button
              render={<a href={cvPath} download />}
              nativeButton={false}
              size="sm"
              className="bg-neon-purple text-white hover:bg-neon-purple/90"
            >
              <Download className="size-4" aria-hidden="true" />
              {t.nav.downloadCV}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Button
        render={<a href={cvPath} download />}
        nativeButton={false}
        size="sm"
        className="bg-neon-purple text-white hover:bg-neon-purple/90"
      >
        <Download className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">{t.nav.downloadCV}</span>
      </Button>
    </div>
  )
}
