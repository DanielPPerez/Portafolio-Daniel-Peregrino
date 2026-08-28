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

// Embed público de Google Calendar para reservas; configurable por env.
export const CALENDAR_BOOKING_SRC = process.env.NEXT_PUBLIC_CALENDAR_BOOKING_SRC ?? "" // dejar vacío si no se configura; el componente manejará la ausencia

export type Certification = {
  issuer: string
  name: string
  url: string
  imageUrl?: string // Opcional para badges visuales
  isPdf?: boolean // true cuando la URL apunta a un PDF de credencial
}

// Certificaciones con enlace a la badge virtual.
// AWS -> URL pública de Credly (viene en el PDF). Cisco -> PDF de la credencial en /public/badges
// (solo traen QR de verificación, sin URL legible; sustituible por Credly si se obtiene).
// Kaggle -> perfil público (la sincronización automática requiere backend; pendiente).
// Para añadir más certificaciones basta con agregar un objeto a este array.
export const certifications: Certification[] = [
  {
    issuer: "AWS Academy",
    name: "Cloud Foundations",
    url: "https://www.credly.com/go/7rICEgFK",
    imageUrl:
      "https://images.credly.com/size/340x340/images/e3541a0c-dd4a-4820-8052-5001006efc85/blob", // URL real de Credly
  },
  {
    issuer: "AWS Academy",
    name: "Cloud Operations",
    url: "https://www.credly.com/go/9rxSOtxR",
    imageUrl:
      "https://images.credly.com/size/340x340/images/07e7ba52-aea4-431f-ba2d-a4113efd1d5a/blob",
  },
  {
    issuer: "AWS Academy",
    name: "Cloud Security Foundations",
    url: "https://www.credly.com/go/l6gfX93S",
    imageUrl:
      "https://images.credly.com/size/340x340/images/7f7ea828-a10d-44f8-8baa-58a9c1af7671/blob",
  },
  {
    issuer: "Cisco",
    name: "Introduction to Cybersecurity",
    url: "public/badges/I2CSUpdate20260623-30-5vf9uf.pdf",
    imageUrl:
      "https://images.credly.com/size/340x340/images/af8c6b4e-fc31-47c4-8dcb-eb7a2065dc5b/I2CS__1_.png",
    // Para Cisco no tenemos imagen de Credly, usaremos un placeholder o logo
  },
  {
    issuer: "Cisco",
    name: "Introduction to IoT",
    url: "/badges/IntrotoIoTUpdate20260623-30-od6ruh.pdf",
    imageUrl:
      "https://images.credly.com/size/340x340/images/fce226c2-0f13-4e17-b60c-24fa6ffd88cb/Intro2IoT.png",
  },
  {
    issuer: "Cisco",
    name: "Network Support and Security",
    url: "/badges/NetworkSupportandSecurityUpdate20260623-30-bxoehw.pdf",
    imageUrl:
      "https://images.credly.com/size/340x340/images/a4dd891f-7bf5-4938-8241-50dc81e8cc00/image.png",
  },
  {
    issuer: "Cisco",
    name: "Operating Systems Basics",
    url: "/badges/OperatingSystemsBasicsUpdate20260623-31-wihhfg.pdf",
    imageUrl:
      "https://images.credly.com/size/340x340/images/dcdf1a3c-2594-4f4c-a33a-050b4bca58b5/image.png",
  },
  {
    issuer: "Kaggle",
    name: "Computer Vision",
    url: "https://www.kaggle.com/danielperegrino",
    // Kaggle no tiene badge específico, usaremos logo genérico
  },
]
