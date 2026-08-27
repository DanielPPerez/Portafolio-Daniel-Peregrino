"use client"

import { Award, BadgeCheck, Briefcase, ExternalLink, FileText } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { useLanguage } from "@/lib/i18n/language-context"
import { certifications } from "@/lib/site-data"
import Image from "next/image"
import { useState } from "react"

export function Experience() {
  const { t } = useLanguage()
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const handleImageError = (certName: string) => {
    setImageErrors((prev) => ({ ...prev, [certName]: true }))
  }

  // Determinar si mostrar imagen o placeholder
  const shouldShowImage = (cert: (typeof certifications)[0]) => {
    return cert.imageUrl && !imageErrors[cert.name]
  }

  // Determinar si es un PDF
  const isPdf = (cert: (typeof certifications)[0]) => {
    return cert.url.toLowerCase().endsWith(".pdf")
  }

  return (
    <section id="experiencia" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-sm text-neon-blue">
            {"// "}
            {t.experience.title}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            {t.experience.title}
          </h2>
          <p className="mt-3 max-w-2xl text-foreground/60">{t.experience.subtitle}</p>
        </Reveal>

        <div className="mt-12 max-w-3xl">
          <ol className="relative border-l border-border pl-8">
            {t.experience.items.map((item, i) => (
              <Reveal key={item.company} delay={i * 0.1}>
                <li className="mb-10 last:mb-0">
                  <span className="absolute -left-3 flex size-6 items-center justify-center rounded-full border border-neon-purple/50 bg-[#0c0c12] glow-border-purple">
                    <Briefcase className="size-3 text-neon-purple" aria-hidden="true" />
                  </span>
                  <p className="font-mono text-xs text-neon-blue">{item.period}</p>
                  <h3 className="mt-1 text-lg font-semibold text-foreground">{item.role}</h3>
                  <p className="text-sm text-foreground/50">{item.company}</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/65">
                    {item.description}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal>
          <div className="mt-12">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neon-purple">
              <Award className="size-4" aria-hidden="true" />
              {t.experience.certificationsTitle}
            </h3>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {certifications.map((cert) => (
                <a
                  key={cert.name}
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col items-center rounded-xl border border-border bg-gradient-to-br from-white/5 to-transparent p-6 transition-all duration-300 hover:border-neon-purple/50 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-neon-purple/5"
                >
                  {/* Badge Image */}
                  {shouldShowImage(cert) ? (
                    <div className="relative mb-4 size-28 transition-transform duration-300 group-hover:scale-105">
                      <Image
                        src={cert.imageUrl!}
                        alt={`${cert.issuer} - ${cert.name}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 112px, 112px"
                        onError={() => handleImageError(cert.name)}
                        priority={false}
                      />
                    </div>
                  ) : (
                    /* Placeholder cuando no hay imagen o falla la carga */
                    <div className="mb-4 flex size-28 items-center justify-center rounded-full bg-gradient-to-br from-neon-purple/10 to-neon-blue/10 border border-neon-purple/20">
                      <BadgeCheck className="size-12 text-neon-purple/40" />
                    </div>
                  )}

                  {/* PDF Badge - muestra un indicador visual */}
                  {isPdf(cert) && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-neon-purple/10 px-2 py-0.5 text-[10px] text-neon-purple border border-neon-purple/20">
                      <FileText className="size-3" />
                      PDF
                    </div>
                  )}

                  {/* Issuer */}
                  <div className="text-center text-xs font-medium uppercase tracking-wider text-neon-blue">
                    {cert.issuer}
                  </div>

                  {/* Certification Name */}
                  <p className="mt-2 text-center text-sm font-semibold leading-snug text-foreground">
                    {cert.name}
                  </p>

                  {/* "PROVIDED BY" text - similar a la primera imagen */}
                  {cert.issuer === "AWS Academy" && (
                    <p className="mt-1 text-center text-[10px] uppercase text-foreground/30">
                      PROVIDED BY Credly
                    </p>
                  )}

                  {/* View Button */}
                  <div className="mt-4 flex items-center justify-center gap-1.5 text-sm text-foreground/55 transition-colors group-hover:text-neon-purple">
                    {isPdf(cert) ? "Ver PDF" : t.experience.viewCredential}
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
