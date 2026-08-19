"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

// TODO: next‑themes (v0.x) emits a script‑tag warning in Next.js 16+/React 19
//       (see https://github.com/pacocoursey/next-themes/issues/385).
//       The warning is only shown in development and does not affect runtime
//       behavior or production builds. It is safe to ignore.
export function ShadowThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
