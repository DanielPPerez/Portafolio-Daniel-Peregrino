import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { LanguageProvider } from "@/lib/i18n/language-context"
import { ShadowThemeProvider } from "@/components/shadow/theme-provider"
import { PageTransitionProvider } from "@/components/page-transition"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Daniel Peregrino — Ingeniero Full Stack & IA",
  description:
    "Portafolio de Daniel Peregrino Perez, Ingeniero Full Stack especializado en arquitectura de software e integración de IA. Conoce también RedFox_Solutions, su agencia de desarrollo a medida.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ShadowThemeProvider>
          <LanguageProvider>
            <PageTransitionProvider>{children}</PageTransitionProvider>
          </LanguageProvider>
        </ShadowThemeProvider>
        {/* Analytics omitted to avoid script tag warning */}
      </body>
    </html>
  )
}
