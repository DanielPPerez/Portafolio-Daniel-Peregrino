"use client"

import { Reveal } from "@/components/reveal"
import { useLanguage } from "@/lib/i18n/language-context"
import { Code, Database, Cloud, Terminal, Package, Brain } from "lucide-react"

const getTechIcon = (tech: string) => {
  const lower = tech.toLowerCase()
  // Programming languages / frameworks
  if (
    [
      "next.js",
      "react",
      "vite",
      "flutter",
      "typescript",
      "javascript",
      "python",
      "java",
      "go",
      "rust",
      "cpp",
      "csharp",
      "ruby",
      "php",
      "swift",
      "kotlin",
      "nestjs",
      "fastapi",
      "django",
      "hexagonal architecture",
      "microservices",
    ].includes(lower)
  ) {
    return <Code className="h-4 w-4" />
  }
  // Databases
  if (
    ["postgresql", "mongodb", "redis", "supabase", "firebase", "mysql", "elasticsearch"].includes(
      lower,
    )
  ) {
    return <Database className="h-4 w-4" />
  }
  // Cloud / DevOps
  if (
    [
      "docker",
      "aws",
      "azure",
      "gcp",
      "railway",
      "heroku",
      "linux",
      "ubuntu",
      "debian",
      "kubernetes",
    ].includes(lower)
  ) {
    if (lower === "docker") return <Package className="h-4 w-4" />
    if (lower === "aws") return <Cloud className="h-4 w-4" />
    if (lower === "linux") return <Terminal className="h-4 w-4" />
    return <Cloud className="h-4 w-4" />
  }
  // AI / ML
  if (["langgraph", "rag", "yolo", "opencv", "tensorflow", "pytorch", "keras"].includes(lower)) {
    return <Brain className="h-4 w-4" />
  }
  // Default
  return <Code className="h-4 w-4" />
}

export function TechStack() {
  const { t } = useLanguage()

  return (
    <section id="stack" className="border-y border-white/5 bg-white/[0.02] py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-sm text-neon-blue">
            {"// "}
            {t.techStack.title}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{t.techStack.title}</h2>
          <p className="mt-3 max-w-2xl text-white/60">{t.techStack.subtitle}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {t.techStack.groups.map((group, i) => (
            <Reveal key={group.name} delay={i * 0.08}>
              <div className="h-full rounded-xl border border-white/10 bg-white/[0.02] p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neon-purple">
                  {group.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.techs.map((tech) => (
                    <div
                      key={tech}
                      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/75 transition-all hover:border-neon-blue/50 hover:text-white hover:glow-border-blue w-24"
                    >
                      {getTechIcon(tech)}
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
// Trivial change to trigger HMR update
