# AI_CONTEXT — lee esto primero

> Es lo **primero** que lee cualquier IA, nueva o que retoma. Mantenlo corto y actualizado.

---

## Qué es el proyecto
- **Nombre:** Portafolio Daniel Peregrino
- **Una frase:** sitio web personal de Daniel Peregrino (Ingeniero Full Stack) con dos experiencias en un
  mismo proyecto: un portafolio personal (`/`) y la landing de su agencia freelance RedFox_Solutions (`/RedFox_Solutions`).
- **Tipo / perfil:** `web-fullstack` (hoy frontend puro) → perfil en `_project-standard/profiles/web-fullstack.md`
- **Modo del proyecto:** unido-a-medias (generado inicialmente en V0 y luego iterado) → trabajar en alcance acotado
- **Estándar externo:** no (ver `context/EXTERNAL_STANDARD.md`)

## Stack y protocolos
- **Lenguaje / framework / runtime:** TypeScript · Next.js 16 (App Router) · React 19 · Node 18+ · pnpm
- **UI:** Tailwind CSS v4 · shadcn/ui sobre **Base UI** (`@base-ui/react`) · Framer Motion · lucide-react · next-themes
- **Validación:** Zod
- **Protocolos:** Gmail API (OAuth2) para envío de correos del formulario de contacto; resto sitio estático/SSG. Sin REST/GraphQL todavía.
- **Base de datos:** esquema de Supabase listo (migrations y seeds) - integración pendiente; puede usarse si se requiere.
- **Auth:** ninguna.
- **Despliegue:** Vercel (plan free). `images.unoptimized: true`.

## Convenciones (overrides del estándar)
- **COMMENTS_LANG:** `es`
- **PONYTAIL_LEVEL:** `full`
- **i18n locales:** `es` (default), `en` — diccionarios locales en `lib/i18n/` + contexto propio (sin librería externa).
- **Excepciones al estándar:** ver ADRs en `DECISIONS.md` (frontend-only ⇒ varias casillas backend son N/A).

## Arquitectura
- **Patrón:** Next.js App Router con componentes organizados por feature (`components/portfolio/`, `components/shadow/`,
  `components/ui/`, `components/icons/`). Sin backend aún. Detalle en `ARCHITECTURE.md` y ADR-0001.
- **Puertos clave:** `QuoteEngine` (`lib/quote/types.ts`) — el cotizador depende de la interfaz; implementado por `lib/quote/claude.ts` (Gemini) con fallback a mock (`lib/quote/mock-engine.ts`) cuando falta `GOOGLE_API_KEY`.

## Librerías principales (con doc oficial)
| Librería | Para qué | Doc oficial |
|---|---|---|
| Next.js | Framework / App Router | https://nextjs.org/docs |
| Tailwind CSS v4 | Estilos | https://tailwindcss.com/docs |
| Base UI | Primitivos accesibles (shadcn) | https://base-ui.com |
| Framer Motion | Animaciones / transición de página | https://www.framer.com/motion/ |
| next-themes | Modo claro/oscuro (solo Shadow360) | https://github.com/pacocoursey/next-themes |
| Zod | Validación de formularios | https://zod.dev |

## Cómo correr el proyecto
```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck    # tsc --noEmit
pnpm lint
pnpm build
```
Se requieren variables de entorno para funcionalidades completas: `GOOGLE_API_KEY` (Gemini), variables de Gmail (`GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`, `GMAIL_USER`) para el formulario, y opcionalmente variables de Supabase para futuras fases. Ver `.env.example`.

## Estado actual (resumen)
> Detalle por sesión en `PROGRESS.md`.

- Frontend funcional: portafolio (`/`) con hero/Matrix, stats, about, proyectos, tech stack, experiencia + cards de
  certificaciones (Credly/PDF), calendario (iframe placeholder) y contacto (solo redes, correo copia al portapapeles).
- RedFox_Solutions (`/RedFox_Solutions`): hero, servicios, proceso, cotizador (conectado a **Gemini** vía route handler), testimonios, FAQ,
  formulario de contacto (Zod, envío vía Gmail API con etiqueta automática “REDFOX”), calendario; modo claro/oscuro; navbars responsive; transición overlay entre páginas.
- **Estado:** cotizador IA activo (Gemini), formulario de contacto funcionando con Gmail API, esquema de Supabase listo (migrations y seeds) para integración futura; faltan API de Google Calendar, tests y auditores.

## Reglas innegociables (recordatorio)
Código en inglés · comentarios en `es` · función = 1 línea de doc + tags · validación en frontera · errores tipados ·
secretos en `.env` · i18n sin hardcode · lógica detrás de puertos · testear casos límite · diff mínimo y no romper lo
ajeno. Fuente completa: `_project-standard/rules/`.
