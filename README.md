# Portafolio Daniel Peregrino

Sitio web personal de **Daniel Peregrino Perez** — Ingeniero Full Stack especializado en arquitectura de software e
integración de IA. El proyecto incluye dos experiencias en un mismo sitio:

1. **Portafolio personal** (`/`) — landing oscura con estética neón/Matrix (morado, azul, rojo) que presenta perfil,
   proyectos, stack, experiencia y contacto.
2. **RedFox_Solutions** (`/RedFox_Solutions`) — landing de la agencia freelance, con estética clara y profesional (modo
   claro/oscuro), Servicios y tarifas, Proceso, Testimonios, FAQ, Calendario y Formulario de contacto.

La navegación entre ambas páginas usa una transición de deslizamiento, e incluye internacionalización (ES/EN).

---

## ✨ Características

### Portafolio (`/`)

- **Hero** con animación de fondo _Matrix rain_ en canvas (performante, se pausa en pestaña oculta).
- **Estadísticas** con contadores animados al entrar en viewport.
- **Acerca de**, **Proyectos** (con previsualización en vivo vía iframe + fallback), **Tech Stack**, **Experiencia**
  (timeline + certificaciones) y **Calendario** (embed de Google Calendar).
- **Navbar fija** con scroll suave entre secciones, indicador de sección activa, toggle de idioma (ES/EN) y botón a
  RedFox_Solutions.
- Botones **Ver CV** (modal) y **Descargar CV** por idioma.

### RedFox_Solutions (`/RedFox_Solutions`)

- **Modo claro/oscuro** (next-themes) con acentos púrpura/rojo sobre base clara.
- **Servicios y tarifas**, **Proceso**, **Testimonios**, **FAQ**, **Calendario** y **Formulario de contacto** con
  validación (Zod), errores por campo y envío automático vía Gmail API (con aplicación de etiqueta “REDFOX”).
- **Cotizador** (UI de chat) construido sobre una interfaz `QuoteEngine` (Strategy/DIP) conectado a **Gemini** (Google) vía route handler; usa motor simulado solo si falta `GOOGLE_API_KEY`.
- Logo con animación de giro 360° al hover.

### Transversales

- **i18n ES/EN** mediante diccionarios locales y un contexto de idioma (persistido en `localStorage`).
- Diseño **responsive**, accesible y con animaciones (Framer Motion).

---

## 🧱 Stack

| Área       | Tecnologías                                            |
| ---------- | ------------------------------------------------------ |
| Framework  | Next.js 16 (App Router), React 19, TypeScript          |
| Estilos    | Tailwind CSS v4, shadcn/ui (Base UI), `tw-animate-css` |
| Animación  | Framer Motion                                          |
| Tema       | next-themes (solo afecta a RedFox_Solutions)           |
| Validación | Zod                                                    |
| Iconos     | lucide-react + SVGs propios de marca                   |

El esquema de Supabase está listo (migrations y seeds) para futuras fases; por ahora los datos son hardcodeados.

---

## 📁 Estructura

```
portfolio-website-build/
├─ app/
│  ├─ layout.tsx           # Providers (idioma + tema), metadata, fuentes
│  ├─ template.tsx         # Transición de deslizamiento entre rutas
│  ├─ page.tsx             # Portafolio (/)
│  ├─ shadow360/page.tsx   # RedFox_Solutions (/shadow360)
│  └─ actions/contact.ts   # Server action del formulario (valida con Zod)
├─ components/
│  ├─ portfolio/           # Secciones del portafolio (hero, about, projects, ...)
│  ├─ shadow/              # Secciones de RedFox_Solutions
│  ├─ ui/                  # Primitivos shadcn/Base UI
│  └─ icons/               # Iconos SVG de marca (social, tiktok)
├─ lib/
│  ├─ i18n/                # Diccionarios es/en + LanguageProvider
│  ├─ quote/               # Contrato QuoteEngine + motor simulado del cotizador
│  ├─ validation/          # Schemas de Zod
│  └─ site-data.ts         # Redes, rutas de CV, src del calendario
└─ public/                 # CV (es/en), logo, imágenes
```

---

## 🚀 Puesta en marcha

Requisitos: **Node.js 18+** y **pnpm** (el repo incluye `pnpm-lock.yaml`).

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

### Variables de entorno

El sitio necesita las siguientes variables de entorno (crea `.env.local` basado en `.env.example`):

- `GOOGLE_API_KEY` – clave de la API de Gemini para el cotizador IA.
- `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`, `GMAIL_USER` – para el envío de correos del formulario de contacto mediante Gmail OAuth2.
- `NEXT_PUBLIC_CALENDAR_SRC` – URL pública del iframe de Google Calendar.
- Variables de Supabase (para futuras fases): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SCREENSHOT_API_KEY`.

Si alguna falta, el sitio degrada con elegancia: el cotizador usa el motor mock y el formulario solo muestra errores de red.

### Scripts

| Script       | Descripción                        |
| ------------ | ---------------------------------- |
| `pnpm dev`   | Servidor de desarrollo             |
| `pnpm build` | Build de producción (valida tipos) |
| `pnpm start` | Sirve el build de producción       |
| `pnpm lint`  | Linter                             |

---

## 🛠️ Personalización

- **CV**: reemplaza los PDFs en `public/cv/` y las rutas en `lib/site-data.ts` (`CV_PATHS`).
- **Redes sociales / correo**: `socialLinks` en `lib/site-data.ts`.
- **Calendario**: cambia `CALENDAR_SRC` en `lib/site-data.ts` por tu iframe público de Google Calendar.
- **Logo**: `public/logo.png` (transparente) usado en el navbar de RedFox_Solutions.
- **Textos / traducciones**: `lib/i18n/es.ts` y `lib/i18n/en.ts`.

---

## ☁️ Despliegue

Optimizado para **Vercel** (plan gratuito). Importa el repositorio en Vercel y despliega con la configuración por
defecto de Next.js. El esquema de Supabase está preparado (migrations y seeds) para integrarse cuando se necesite base de datos.

---

## 🗺️ Roadmap

- **Cotizador** conectado a **Gemini** (Google) mediante un Route Handler `app/api/quote/route.ts` que implementa la interfaz `QuoteEngine` (sin cambios en la UI).
- Integración real con la API de Google Calendar para mostrar disponibilidad.

---

## 👤 Autor

**Daniel Peregrino Perez** — Ingeniero Full Stack
GitHub: [@DanielPPerez](https://github.com/DanielPPerez)
