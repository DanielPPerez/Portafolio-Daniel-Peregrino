import type { ComponentType } from "react"
import { TikTokIcon } from "@/components/icons/tiktok-icon"
import { GithubIcon, InstagramIcon, LinkedinIcon, MailIcon } from "@/components/icons/social-icons"

// Todos los iconos sociales son componentes SVG propios con la misma firma, de modo que
// el renderizado es uniforme (sin casos especiales por marca).
export type IconComponent = ComponentType<{ className?: string }>

export type SocialLink = {
  name: string
  href: string
  icon: IconComponent
}

export const socialLinks: SocialLink[] = [
  { name: "LinkedIn", href: "https://www.linkedin.com/", icon: LinkedinIcon },
  { name: "Instagram", href: "https://www.instagram.com/", icon: InstagramIcon },
  { name: "TikTok", href: "https://www.tiktok.com/", icon: TikTokIcon },
  { name: "GitHub", href: "https://github.com/", icon: GithubIcon },
  { name: "Email", href: "mailto:daniel.peregrino@example.com", icon: MailIcon },
]

// Rutas reales de los PDFs en /public/cv (el espacio del archivo EN va URL-encoded).
export const CV_PATHS = {
  es: "/cv/Daniel-Peregrino-Full-Stack_CV.pdf",
  en: "/cv/Daniel%20Peregrino_Full-Stack_CV_ENGLISH.pdf",
} as const

// Public Google Calendar embed placeholder
export const CALENDAR_SRC =
  "https://calendar.google.com/calendar/embed?src=PLACEHOLDER&ctz=America%2FLima"
