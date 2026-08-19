# Backend — guía de configuración

El backend se construye por fases sobre **Next.js Route Handlers + Supabase** (ver el plan y
`_project-standard/context/DECISIONS.md`). Cada feature degrada con elegancia: si su variable de entorno no está,
el sitio sigue funcionando con los datos/mocks actuales.

## Variables de entorno

Copia `.env.example` → `.env.local` y completa lo que vayas activando. En Vercel, agrégalas en
**Project Settings → Environment Variables**.

## ✅ Fase activa: Cotizador IA (Shadow360)

El asistente de cotización en `/RedFox_Solutions` (sección **Cotizar**) ya está conectado a **Gemini** (Google).

1. Crea una API key en https://aistudio.google.com/app/apikey → **API Key**.
2. Ponla en `.env.local`:
   ```
   GOOGLE_API_KEY=AIza...
   # opcional: GEMINI_MODEL=gemini-1.5-pro-latest
   ```
3. `pnpm dev` y prueba el chat: describe un proyecto y debe responder con preguntas + un estimado en USD/MXN.

- Sin la key, el chat usa el **motor mock** (respuestas guiadas) automáticamente — no se rompe.
- La key es **solo de servidor** (la usa `app/api/quote/route.ts` vía `lib/quote/claude.ts`); nunca se expone al cliente.
- Modelo de precios y reglas: en el system prompt de `lib/quote/claude.ts` (ajustable).
- Costo: la API de Gemini es de pago (modelo pro es económico para chats cortos).

## 🟡 Arreglo rápido: Calendario

La sección de calendario muestra "Iniciar sesión" porque el `src` es un placeholder. Para verlo:

1. En Google Calendar: **Configuración → [tu calendario] → Integrar calendario → Hacer público** y copia la URL de
   inserción (Embed).
2. Ponla en `.env.local`:
   ```
   NEXT_PUBLIC_CALENDAR_SRC="https://calendar.google.com/calendar/embed?src=...&ctz=America/Mexico_City"
   ```

## ⏳ Próximas fases (requieren proyecto Supabase)

Estas aún no están implementadas; necesitan un proyecto Supabase para construirlas y probarlas:

1. **Proyectos dinámicos** — pegar repo/deploy en `/admin` → screenshot automático → se muestra en la home.
2. **Certificaciones** — subir PDF de badge → extrae issuer/nombre + link de Credly.
3. **CV → Tech Stack** — subir CV → se extraen tecnologías mediante LLM (Gemini); "Descargar CV" sirve el archivo subido.
4. **Formulario de contacto** — persistir leads en Supabase.
5. **Panel `/admin`** — login (Supabase Auth) + formularios.

Cuando tengas el proyecto Supabase creado (URL + anon key + service role key), avísame y cableo estas fases contra él.
