"use client"

import { useLanguage } from "@/lib/i18n/language-context"

export function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  const links = [
    { id: "inicio", label: t.nav.home },
    { id: "acerca", label: t.nav.about },
    { id: "proyectos", label: t.nav.projects },
    { id: "stack", label: t.nav.techStack },
    { id: "experiencia", label: t.nav.experience },
    { id: "contacto", label: t.nav.contact },
  ]

  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center sm:px-6">
        <p className="font-mono text-lg font-bold text-foreground text-glow-purple">DP</p>
        <nav>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="text-sm text-foreground/55 transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-xs text-foreground/40">{t.footer.builtWith}</p>
        <p className="text-xs text-foreground/40">
          © {year} Daniel Peregrino Perez. {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
