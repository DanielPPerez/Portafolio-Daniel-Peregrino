"use client"

import { Download, Eye, FileText } from "lucide-react"
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

export function CvButton() {
  const { t, locale } = useLanguage()
  const cvPath = CV_PATHS[locale]

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
        <DialogContent className="max-w-3xl border-white/10 bg-[#0c0c12] text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <FileText className="size-4 text-neon-purple" aria-hidden="true" />
              Daniel Peregrino — CV
            </DialogTitle>
          </DialogHeader>
          <div className="h-[70vh] w-full overflow-hidden rounded-md border border-white/10 bg-white">
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
