# ARCHITECTURE — Portafolio Daniel Peregrino

> Decisiones estructurales y mapa de capas. El **por qué** de cada decisión vive como ADR en
> [`_project-standard/context/DECISIONS.md`](_project-standard/context/DECISIONS.md).

## Visión general

Aplicación **Next.js 16 (App Router)**, frontend-only, con dos rutas que son dos "mundos":

- `/` — **Portafolio personal** (estética oscura/neón).
- `/shadow360` — **Shadow360Solutions**, la agencia (estética clara con acentos púrpura/rojo, modo claro/oscuro).

No hay backend, base de datos ni API propia todavía (ver ADR-0001 y ADR-0002). Despliegue en Vercel.

## Estructura de carpetas

```
app/
  layout.tsx          # Providers (Theme → Language → PageTransition), fuentes, metadata
  page.tsx            # Portafolio (/)
  shadow360/page.tsx  # Shadow360Solutions (/shadow360)
  globals.css         # Tokens de tema + utilidades (neón, glow)
  actions/contact.ts  # Server action del formulario (valida con Zod)
components/
  portfolio/          # Secciones del portafolio (hero, about, projects, experience, ...)
  shadow/             # Secciones de Shadow360 (hero, services, quote-chat, faq, ...)
  ui/                 # Primitivos shadcn sobre Base UI (button, dialog, card, ...)
  icons/              # Iconos SVG de marca (social, tiktok)
  page-transition.tsx # Overlay slide entre rutas (provider + hook)
  social-bar.tsx, cv-button.tsx, language-toggle.tsx, ...
lib/
  i18n/               # Diccionarios es/en + LanguageProvider (Context)
  quote/              # Puerto QuoteEngine (types.ts) + mock-engine.ts
  validation/         # Schemas de Zod (contact.ts)
  site-data.ts        # Redes, rutas de CV, certificaciones, src del calendario
  utils.ts            # cn() (clsx + tailwind-merge)
public/               # CV (es/en), logo, imágenes, badges (PDF de certificaciones)
```

Organización **por feature** (`portfolio/`, `shadow/`) en vez de por tipo, para cohesión al crecer (ADR-0001).

## Puertos y adaptadores (lo único con "dominio" hoy)

El **cotizador** sigue Inversión de Dependencias (ADR-0004):

- Puerto: `QuoteEngine` en [`lib/quote/types.ts`](lib/quote/types.ts) — define `send(history) → QuoteTurn`.
- Adaptador actual: `createMockQuoteEngine` en [`lib/quote/mock-engine.ts`](lib/quote/mock-engine.ts) (respuestas
  guiadas, estimado derivado de las tarifas de `site-data`).
- Futuro: un adaptador `ClaudeQuoteEngine` (route handler `app/api/quote/route.ts`) que implemente la misma interfaz,
  **sin tocar** la UI (`components/shadow/quote-chat.tsx`).

## Capas transversales

- **i18n** (ADR-0003): `LanguageProvider` (Context) + diccionarios tipados `lib/i18n/{es,en}.ts`. `es` por defecto,
  preferencia en `localStorage`. Cero texto hardcodeado en UI.
- **Theming** (ADR-0006): `next-themes` montado en el layout raíz; el portafolio es oscuro fijo, el toggle solo afecta
  a Shadow360. Tokens en `globals.css` (`--brand` púrpura, `--neon-*`).
- **Transición de página** (ADR-0005): `PageTransitionProvider` (overlay slide nativo con Framer Motion); cubre →
  navega → revela. El `transform` solo existe durante la animación para no romper el navbar `fixed`.
- **Validación**: Zod en la frontera (server action `submitContact` + schema reutilizable en `lib/validation`).

## Evolución prevista

Cuando entre backend (cotizador con LLM real, disponibilidad de Google Calendar, o persistencia con Supabase):
introducir `app/api/` + adaptadores que implementen puertos, manteniendo la UI desacoplada. Ver ADR-0001
(disparador de evolución) y `rules/08-architecture-change.md`.
