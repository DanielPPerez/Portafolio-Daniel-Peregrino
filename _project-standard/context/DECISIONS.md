# DECISIONS — registro de decisiones (ADRs)

> Un ADR por decisión importante: arquitectura, elección de librería, o cualquier excepción al estándar.
> Documenta el **por qué**, no solo el qué. El más reciente va abajo.

---

## Formato de un ADR
```markdown
## ADR-00X — <título corto>
- Fecha: AAAA-MM-DD
- Estado: propuesto | aceptado | reemplazado por ADR-00Y
- Contexto: <qué problema/situación lo motiva>
- Decisión: <qué se decidió>
- Opciones consideradas: <alternativas y por qué se descartaron>
- Consecuencias: <qué facilita, qué cuesta, qué deuda genera>
```

---

## ADR-0001 — Arquitectura inicial: Next.js App Router por feature, sin backend
- Fecha: 2026-06-25
- Estado: aceptado
- Contexto: portafolio personal + landing de agencia; proyecto frontend-only, escala baja (sitio estático), equipo de 1.
- Decisión: Next.js 16 App Router con dos rutas (`/`, `/shadow360`) y componentes organizados por feature
  (`components/portfolio/`, `components/shadow/`, `components/ui/`). Lógica desacoplada en `lib/`.
- Opciones consideradas: SPA con Vite (descartado: peor SEO/SSG y dos "mundos" en una sola página);
  estructura por tipo en vez de por feature (descartado: menos cohesión al crecer).
- Consecuencias: simple y desplegable en Vercel free; backend (Supabase/Claude) se añade luego sin reescritura.
- Disparador de evolución: si entra backend real (auth/DB/cotizador con LLM), introducir capa
  `app/api/` + adaptadores e idealmente separación dominio/infra.

## ADR-0002 — Excepción de alcance: casillas backend del estándar como N/A
- Fecha: 2026-06-25
- Estado: aceptado
- Contexto: el Definition of Done asume full-stack; este proyecto no tiene BD, API ni servidor propio aún.
- Decisión: marcar **N/A** las casillas de ACID, API versionada/contrato, observabilidad/health y rate limiting
  mientras el proyecto sea frontend-only.
- Consecuencias: el DoD refleja el estado real; cuando entre backend, se reactivan esas casillas.

## ADR-0003 — i18n con diccionarios locales propios (sin librería)
- Fecha: 2026-06-25
- Estado: aceptado
- Contexto: solo 2 locales (es/en) y textos relativamente acotados.
- Decisión: diccionarios tipados en `lib/i18n/{es,en}.ts` + `LanguageProvider` propio (Context API), `es` por defecto,
  preferencia persistida en `localStorage`.
- Opciones consideradas: `next-intl`/`i18next` (descartado por ahora: peso y complejidad innecesarios para 2 locales — KISS/YAGNI).
- Consecuencias: cero hardcode y simple; si crecen locales/pluralización compleja, migrar a `next-intl`.

## ADR-0004 — Cotizador detrás del puerto `QuoteEngine` (DIP)
- Fecha: 2026-06-25
- Estado: aceptado
- Contexto: el cotizador debe ser solo-UI hoy, pero conectarse a un LLM (Claude) después sin reescribir la UI.
- Decisión: definir la interfaz `QuoteEngine` (`lib/quote/types.ts`); la UI depende de ella; hoy se inyecta un
  `createMockQuoteEngine` (`lib/quote/mock-engine.ts`). Mañana, un adaptador real (route handler → Claude) implementa
  la misma interfaz.
- Consecuencias: cambiar a LLM real = nuevo adaptador, sin tocar `quote-chat.tsx`.

## ADR-0005 — Transición entre páginas: overlay nativo (no jQuery/animsition)
- Fecha: 2026-06-25
- Estado: aceptado
- Contexto: se pidió un efecto "overlay slide" estilo animsition entre `/` y `/shadow360`.
- Decisión: implementarlo nativo con Framer Motion (`components/page-transition.tsx`), provider en el layout que coordina
  cubrir → navegar → revelar.
- Opciones consideradas: animsition/Turn.js (descartado: jQuery, sin mantenimiento, no encaja en React 19/Next 16);
  react-pageflip (descartado: para "libros" de hojas fijas, no para 2 rutas scrolleables).
- Consecuencias: sin dependencias extra; el `transform` solo existe durante la transición para no romper el navbar fijo.

## ADR-0006 — next-themes montado en el layout raíz
- Fecha: 2026-06-25
- Estado: aceptado
- Contexto: montar el `ThemeProvider` dentro de la página de Shadow360 provocaba el warning de React de `<script>`
  inyectado por next-themes al navegar del lado del cliente.
- Decisión: montar `ThemeProvider` en `app/layout.tsx` (persiste entre navegaciones); el portafolio queda oscuro
  hardcodeado y el toggle de tema solo afecta a Shadow360.
- Consecuencias: sin warning de hidratación/script; tema global gestionado en un solo lugar.

<!-- Próximos ADRs van debajo -->
