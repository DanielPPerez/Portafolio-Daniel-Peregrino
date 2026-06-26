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
  { name: "LinkedIn", href: "https://www.linkedin.com/in/daniel-p-perez/", icon: LinkedinIcon },
  { name: "Instagram", href: "https://www.instagram.com/chaditofox/", icon: InstagramIcon },
  { name: "TikTok", href: "https://www.tiktok.com/@chaditofox?lang=es", icon: TikTokIcon },
  { name: "GitHub", href: "https://github.com/DanielPPerez", icon: GithubIcon },
  { name: "Email", href: "mailto:danielperegrinoperez@gmail.com", icon: MailIcon },
]

// Rutas reales de los PDFs en /public/cv (el espacio del archivo EN va URL-encoded).
export const CV_PATHS = {
  es: "/cv/Daniel-Peregrino-Full-Stack_CV.pdf",
  en: "/cv/Daniel%20Peregrino_Full-Stack_CV_ENGLISH.pdf",
} as const

// Embed público de Google Calendar; configurable por env con fallback al placeholder.
export const CALENDAR_SRC =
  process.env.NEXT_PUBLIC_CALENDAR_SRC ??
  "https://calendar.google.com/calendar/embed?src=PLACEHOLDER&ctz=America%2FLima"

export type Certification = {
  issuer: string
  name: string
  url: string
}

// Certificaciones con enlace a la badge virtual.
// AWS -> URL pública de Credly (viene en el PDF). Cisco -> PDF de la credencial en /public/badges
// (solo traen QR de verificación, sin URL legible; sustituible por Credly si se obtiene).
// Kaggle -> perfil público (la sincronización automática requiere backend; pendiente).
// Para añadir más certificaciones basta con agregar un objeto a este array.
export const certifications: Certification[] = [
  { issuer: "AWS Academy", name: "Cloud Foundations", url: "https://www.credly.com/go/7rICEgFK" },
  { issuer: "AWS Academy", name: "Cloud Operations", url: "https://www.credly.com/go/9rxSOtxR" },
  {
    issuer: "AWS Academy",
    name: "Cloud Security Foundations",
    url: "https://www.credly.com/go/l6gfX93S",
  },
  {
    issuer: "Cisco",
    name: "Introduction to Cybersecurity",
    url: "/badges/I2CSUpdate20260623-30-5vf9uf.pdf",
  },
  {
    issuer: "Cisco",
    name: "Introduction to IoT",
    url: "/badges/IntrotoIoTUpdate20260623-30-od6ruh.pdf",
  },
  {
    issuer: "Cisco",
    name: "Network Support and Security",
    url: "/badges/NetworkSupportandSecurityUpdate20260623-30-bxoehw.pdf",
  },
  {
    issuer: "Cisco",
    name: "Operating Systems Basics",
    url: "/badges/OperatingSystemsBasicsUpdate20260623-31-wihhfg.pdf",
  },
  { issuer: "Kaggle", name: "Computer Vision", url: "https://www.kaggle.com/danielperegrino" },
]
