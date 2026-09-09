"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/lib/i18n/language-context"
import { projects } from "@/lib/projects"
import { es as esDict } from "@/lib/i18n/es"
import { en as enDict } from "@/lib/i18n/en"

// Discriminated union for highlight cards
export type HighlightCard =
  | { kind: "primary"; tagline: string; headline: string; description: string; tags: string[] }
  | {
      kind: "latest-project"
      title: string
      period: string
      description: string
      bullets: string[]
    }
  | { kind: "current-role"; role: string; period: string; mode: string }
  | { kind: "tech-stack"; items: string[] }
  | { kind: "experience"; years: number; blurb: string }

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, x: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    x: 60,
    scale: 0.95,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function HeroHighlightCards() {
  const { t, locale } = useLanguage()
  const dict = locale === "es" ? esDict : enDict

  // 1. Primary Card: approved proposal copy from dictionary
  const primaryCardData = dict.highlight.primaryCard ?? {
    tagline: "Full Stack & AI Engineer",
    headline: "Arquitectura de software escalable e integración de IA",
    description:
      "Diseño e implemento microservicios mantenibles y frontends de alto rendimiento combinando Python, Next.js y agentes de IA.",
    tags: ["Python", "Next.js", "FastAPI", "IA / RAG", "Microservicios"],
  }

  const primaryCard: HighlightCard = {
    kind: "primary",
    tagline: primaryCardData.tagline,
    headline: primaryCardData.headline,
    description: primaryCardData.description,
    tags: primaryCardData.tags,
  }

  // 2. Latest Project: reuse projects[0]
  const latestProject = projects[0]
  const latestCard: HighlightCard = {
    kind: "latest-project",
    title: latestProject.title,
    period: "01/2026 — 04/2026",
    description: latestProject.description,
    bullets: latestProject.tags,
  }

  // 3. Current Role: reuse experience.items[0]
  const expItem = dict.experience.items[0]
  const currentRoleCard: HighlightCard = {
    kind: "current-role",
    role: expItem?.role ?? "Full Stack AI Specialist",
    period: expItem?.period ?? "Feb 2025 — Ene 2026",
    mode: expItem?.company ?? "Outlier AI",
  }

  // 4. Tech Stack: top technologies from techStack groups
  const techItems: string[] = []
  dict.techStack.groups.forEach((group) => {
    if (group.techs) {
      techItems.push(...group.techs.slice(0, 2))
    }
  })
  const techStackCard: HighlightCard = {
    kind: "tech-stack",
    items: techItems,
  }

  // 5. Experience Card: years from stats, blurb from about subtitle
  const yearsVal = typeof dict.stats.items[0]?.value === "number" ? dict.stats.items[0].value : 5
  const experienceCard: HighlightCard = {
    kind: "experience",
    years: yearsVal,
    blurb: dict.about.subtitle ?? "Ingeniero Full Stack & Arquitecto de Software",
  }

  const cards: HighlightCard[] = [
    primaryCard,
    latestCard,
    currentRoleCard,
    techStackCard,
    experienceCard,
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-2 sm:space-y-2.5"
    >
      {cards.map((card) => (
        <motion.div key={card.kind} variants={cardVariants}>
          <div className="rounded-xl border border-border bg-card/60 p-3 sm:p-3.5 shadow-sm backdrop-blur-sm transition-all hover:border-brand/40 hover:shadow-md">
            {card.kind === "primary" && (
              <>
                <p className="font-mono text-[10px] sm:text-xs font-semibold tracking-wider text-neon-blue uppercase">
                  {card.tagline}
                </p>
                <h2 className="mt-0.5 text-sm sm:text-base font-bold text-foreground leading-tight">
                  {card.headline}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                  {card.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-foreground/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}

            {card.kind === "latest-project" && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neon-purple">
                    {t.highlight.latestProject}
                  </h3>
                  <span className="font-mono text-[10px] text-muted-foreground">{card.period}</span>
                </div>
                <h2 className="mt-0.5 text-sm sm:text-base font-bold text-foreground leading-tight">
                  {card.title}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                  {card.description}
                </p>
                {card.bullets.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {card.bullets.map((b) => (
                      <span
                        key={b}
                        className="rounded-md border border-border bg-muted/30 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}

            {card.kind === "current-role" && (
              <>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neon-purple shrink-0">
                    {t.highlight.currentRole}
                  </h3>
                  <span className="rounded-full bg-brand/10 px-2 py-0.5 font-mono text-[10px] text-brand truncate max-w-[200px]">
                    {card.mode}
                  </span>
                </div>
                <p className="mt-0.5 font-mono text-xs sm:text-sm font-bold text-foreground leading-tight">
                  {card.role}
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{card.period}</p>
              </>
            )}

            {card.kind === "tech-stack" && (
              <>
                <h3 className="mb-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neon-purple">
                  {t.highlight.techStack}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {card.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-foreground/85"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </>
            )}

            {card.kind === "experience" && (
              <>
                <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neon-purple">
                  {t.highlight.experience}
                </h3>
                <p className="mt-0.5 font-mono text-xs sm:text-sm font-bold text-neon-blue">
                  {card.years}+ {t.stats.items[0]?.label ?? "Años de experiencia"}
                </p>
                <p className="mt-0.5 text-[10px] sm:text-xs text-muted-foreground truncate">
                  {card.blurb}
                </p>
              </>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
