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
- Decisión: Next.js 16 App Router con dos rutas (`/`, `/RedFox_Solutions`) y componentes organizados por feature
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
- Decisión: definir la interfaz `QuoteEngine` (`lib/quote/types.ts`) ; la UI depende de ella; hoy se inyecta un
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

## ADR-0007 — Cotizador usa Gemini (Google) en lugar de Claude
- Fecha: 2026-08-18
- Estado: aceptado
- Contexto: el ADR-0004 previa la posibilidad de conectar un LLM real (Claude) mediante un adapter que implemente QuoteEngine. Durante la implementación se decidió usar la API de Gemini de Google por facilidad de acceso y costo, manteniendo el mismo puerto QuoteEngine. La implementación real está en `lib/quote/claude.ts` (aunque el nombre hace referencia a Claude, en realidad llama a Gemini) y la route handler `app/api/quote/route.ts` llama a dicha función.
- Decisión: usar Gemini (modelo `gemini-1.5-pro-latest` configurable vía `GEMINI_MODEL`) como motor de cotizador IA, con fallback al motor mock cuando falta `GOOGLE_API_KEY`. Mantener la interfaz QuoteEngine permite cambiar a otro LLM en el futuro sin modificar la UI.
- Opciones consideradas: mantener la adaptación a Claude (requeriría `ANTHROPIC_API_KEY`), usar otro proveedor (OpenAI, etc.). Se descartó Claude porque ya se tenía acceso a Gemini y se quería evitar múltiples claves de API.
- Consecuencias: el cotizador ahora usa un LLM real (Gemini) proporcionando respuestas dinámicas; el nombre del archivo `claude.ts` es engañoso pero se mantiene por compatibilidad; se puede renombrar en el futuro. La UI no cambia porque depende del puerto QuoteEngine.

## ADR-0008 — Contact form split into two‑step wizard
- Fecha: 2026-08-19
- Estado: aceptado
- Contexto: El formulario de contacto original era una sola página larga con muchos campos (datos del proyecto y de contacto), lo que generaba una experiencia pesada y posible abandono. Además, era necesario asegurar que se proporcione al menos un canal de contacto (teléfono o red social) sin depender únicamente de la validación del frontend.
- Decisión: Refactorizar el formulario en un asistente de dos pasos. Paso 1: brief del proyecto (nombre, email, tipo de proyecto, mensaje, nombre del proyecto, descripción, alcance, presupuesto, timeline, entregables, notas adicionales). Paso 2: datos de contacto (teléfono y enlaces a redes sociales, máximo 3). Se implementa validación del Paso 1 antes de permitir avanzar al Paso 2, usando un esquema Zod parcial (sin teléfono y socialLinks). El envío ocurre únicamente al final del Paso 2, enviando todos los datos al action de servidor. Se mantiene la regla de negocio de al menos un canal de contacto mediante un refinement en el esquema Zod global (.refine que verifica teléfono o socialLinks no vacíos).
- Opciones consideradas: 
  * Mantener el formulario largo (descartado: mala usabilidad y mayor tasa de abandono).
  * Usar un asistente de tres o más pasos (descartado: complejidad innecesaria para únicamente dos grupos lógicos de campos).
  * Validar y enviar partialmente en cada paso (descartado: requeriría lógica extra para combinar leads incompletos y no garantiza recibir todos los datos necesarios).
- Consecuencias: 
  * Mejora la experiencia al dividir el formulario en secciones lógicas, reduciendo la percepción de complejidad y aumentando la probabilidad de completado.
  * Añade un pequeño overhead de estado en el frontend (paso y datos del paso 1) pero mantiene la lógica de validación y envío única en el backend, sin cambios en la API ni en el esquema de base de datos.
  * El esquema Zod ya incluye los nuevos campos (phone, socialLinks) y la regla de refinamiento, por lo que la validación del backend sigue siendo única y segura.
  * El cambio es compatible hacia atrás porque los nuevos columnas en la tabla de Supabase son nullable y el esquema permite valores opcionales.

## ADR-0009 — Public appointment scheduling with qualification gate
- Fecha: 2026-08-19
- Estado: aceptado
- Contexto: Se necesitaba reemplazar el embed puro del calendario de Google Calendar (que requiere login) por un flujo público donde el usuario primero completa un formulario de calificación (nombre, email, teléfono/redes, empresa, rol, rango de presupuesto) y, solo tras aprobación, se muestra el iframe del calendario público de reservas. Además, se quería desacoplar la UI de la provisión específica del calendario (Google Calendar) para poder cambiar en el futuro a Calendly, Cal.com u otro servicio sin modificar la UI.
- Decisión: Implementar el patrón de Inversión de Dependencias mediante un puerto `SchedulingGate` (análogo a `QuoteEngine`). El portal UI (`MeetingRequestForm`) muestra siempre primero el formulario de calificación. Al submit, se invoca a un server action (`app/actions/meeting-request.ts`) que valida con Zod, verifica el campo honeypot anti‑spam, persiste el lead en una nueva tabla Supabase `meeting_requests`, envía notificación por correo (reutilizando el cliente Gmail ya existente) y, si todo es exitoso, devuelve `{ approved: true, bookingUrl: process.env.NEXT_PUBLIC_CALENDAR_BOOKING_SRC }`. Los componentes de calendario (`components/shadow/calendar.tsx` y `components/portfolio/calendar.tsx`) renderizan el formulario mientras `approved` es falso; tras la aprobación, muestran el iframe del calendario usando la URL de reserva obtenida del entorno (o un string vacío si no está configurado, en cuyo caso no se muestra nada). El estado de aprobación se persiste en `sessionStorage` para evitar volver a mostrar el formulario en la misma sesión del navegador.
- Opciones consideradas: 
  * Mantener el embed público del calendario y depender únicamente de la configuración de Google Calendar paraRestringir acceso (público o privado). Descartado porque el embed requería login para usuarios no autorizados, lo que generaba mala experiencia y no permitía calificar al visitante antes de ver disponibilidad.
  * Crear un endpoint propio que valide horarios y muestre disponibilidad custom. Descartado porque requeriría reinventar la lógica de zonas horarias, recurrencias y manejo de conflictos, que ya está resuelto por los proveedores de calendarios.
  * Usar un tercer servicio como Calendly directamente sin paso de calificación. Descartado porque se quería capturar información de calificación antes de exponer el calendario.
- Consecuencias: 
  * La UI ahora muestra un formulario de calificación antes del calendario, mejorando la calidad de los leads y espameando menos a bots gracias al honeypot.
  * La lógica de negocio (validación, persistencia, notificación) está aislada en el server action y el puerto `SchedulingGate` permite cambiar la implementación de reservas (por ejemplo, a Calendly) sin tocar `MeetingRequestForm`.
  * Se añadió una nueva tabla Supabase `meeting_requests` con columnas para todos los campos del formulario incluyendo `social_links` como JSONB, siguiendo el patrón de expansión (creación de tabla nueva en lugar de extender `contact_form_submissions` para mantener semántica clara).
  * El flujo es totalmente del lado del servidor para la aprobación; el cliente nunca ve el iframe del calendario hasta que el server action devuelve approved=true, evitando que el recurso sea indexado o accesible directamente (basic anti‑scraping).
  * El nombre del enlace de reserva se obtiene de la variable de entorno `NEXT_PUBLIC_CALENDAR_BOOKING_SRC`, la cual debe apuntar a un horario público de Google Calendar (u otro servicio) que permita reservas sin autenticación.
  * El cambio es compatible hacia atrás porque no modifica tablas existentes ni elimina funcionalidades previas; el formulario de contacto original permanece intacto.

## ADR-0010 — Clear/dark mode for portfolio with next‑themes and CSS variables
- Fecha: 2026-08-20
- Estado: aceptado
- Contexto: El portafolio (`/`) tenía un tema oscuro hardcodeado sin toggle (ADR-0006). Se solicitó agregar soporte de modo claro/oscuro reutilizando el patrón de next‑themes ya existente en RedFox_Solutions, evitando flash de tema incorrecto y manteniendo la consistencia de acentos neón y legibilidad en ambos modos.
- Decisión: Implementar clear/dark mode en el portafolio usando next‑themes y variables CSS definidas en `app/globals.css`. Extraer el componente `ThemeToggle` a `components/theme-toggle.tsx` para reutilizarlo en ambas barras de navegación. Reemplazar todos los valores de color hardcodeados en componentes del portafolio por las variables CSS apropiadas (`bg-background`, `text-foreground`, `border-border`, `text-foreground/XX`, etc.), manteniendo los acentos neón mediante las variables `--neon-purple`, `--neon-blue`, `--neon-red`. Asegurar que el toggle persista la preferencia y no cause mismatches de hidratación.
- Opciones consideradas:
  * Mantener el portafolio oscuro hardcodeado sin toggle (rechazado: no cumple requerimiento de modo claro).
  * Implementar un sistema de temas propio sin next‑themes (rechazado: duplicación de esfuerzo, next‑themes ya probado y integrado en RedFox_Solutions).
  * Usar únicamente media queries `prefers-color-scheme` sin persistencia (rechazado: no permite al usuario elegir explícitamente y persiste su elección).
- Consecuencias:
  * El portafolio ahora respeta la preferencia del usuario (o del sistema) y permite toggle explícito, con persistencia en `localStorage` mediante next‑themes.
  * Zero flash de tema incorrecto gracias al `mount‑guard` en `ThemeToggle` y la proveedora de temas en la raíz (`app/layout.tsx`).
  * Los acentos neón, glows y highlights permanecen consistentes en ambos modos porque se derivan de las mismas variables CSS.
  * La legibilidad mejora en modo claro gracias a fondos claros y texto oscuro con suficiente contraste (se validará con herramientas de contraste).
  * No se requieren cambios en la lógica de negocio ni en los puertos; el cambio es exclusivamente de presentación.
  * El ADR-0006 queda supersedido por este documento.