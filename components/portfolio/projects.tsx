"use client"

import { ExternalLink } from "lucide-react"
import { BrowserFrame } from "@/components/browser-frame"
import { Reveal } from "@/components/reveal"
import { useLanguage } from "@/lib/i18n/language-context"

const fallbacks: Record<string, string> = {
  web: "/images/project-web.png",
  figma: "/images/project-figma.png",
  game: "/images/project-game.png",
}

export function Projects() {
  const { t } = useLanguage()
  // console.log('t in Projects:', t)
  // console.log('t.projects:', t.projects)
  if (!t?.projects) return null

  return (
    <section id="proyectos" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-sm text-neon-blue">
            {"// "}
            {t.projects.title}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{t.projects.title}</h2>
          <p className="mt-3 max-w-2xl text-white/60">{t.projects.subtitle}</p>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {t.projects.items.map((project, i) => (
            <Reveal key={project.title} delay={i * 0.1}>
              <article className="group flex h-full flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all hover:border-neon-purple/40 hover:glow-border-purple">
                <BrowserFrame
                  url={project.url}
                  title={project.title}
                  visitLabel={t.projects.visit}
                  fallbackImage={fallbacks[project.type]}
                />
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-white">{project.title}</h3>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t.projects.visit}: ${project.title}`}
                      className="text-white/40 transition-colors hover:text-neon-purple"
                    >
                      <ExternalLink className="size-4" />
                    </a>
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs text-neon-blue"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
