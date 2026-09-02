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

## ADR-0011 — Catálogo de software del cotizador en código de dominio
- Fecha: 2026-09-01
- Estado: aceptado
- Contexto: el cotizador describe precios como texto libre en el system prompt y las 4 tarifas fijas de la landing viven como strings en `lib/i18n`. Eso viola `rules/02-business-rules.md` (los datos de negocio no deben vivir en diccionarios de presentación). Se necesita un catálogo reutilizable de módulos y condiciones comerciales para proyectos medianos/grandes, calibrado con un proyecto ERP de referencia interno, sin conectar aún el motor (`QuoteEngine`, ADR-0004) ni la UI.
- Decisión: versionar tipos y datos puros en `lib/quote/catalog.ts`. El precio base de un módulo medium es el total del proyecto de referencia interno (150,000 MXN) dividido entre 13 módulos, redondeado al peso más cercano: 11,538 MXN. Multiplicadores: simple 0.5 (CRUD acotado), medium 1.0 (ancla), complex 1.8 (flujos / inventario o estado financiero; tope bajo de 1.8–2x para no inflar un ancla que ya incluye todas las fases). Condiciones comerciales (40/30/30, garantía 90 días, vigencia 15 días, exclusiones estándar) son defaults ajustables por cotización, no cláusulas fijas. Los diccionarios i18n solo guardan claves de nombre, hitos y exclusiones. Las 4 tarjetas de `shadow.services.items` no se reemplazan en esta fase (catálogo aditivo).
- Opciones consideradas: tabla Supabase (descartado por YAGNI: no hay panel admin ni edición en vivo; se justifica más para un catálogo de refacciones de cambio frecuente). Un puerto de catálogo ahora (descartado: esta fase es solo datos; el patrón DIP de ADR-0004 aplica al motor, no a constantes).
- Consecuencias: actualizar precios exige deploy; Git queda como historial. Fase 2 puede clonar el mismo estilo de archivo (`tipos + datos`, sin I/O) para refacciones. Fase 3 conectará el catálogo al motor; Fase 5 a la UI. El system prompt de Gemini no cambia aquí.

## ADR-0012 — Catálogo de reparaciones en Supabase (con distinción de fuente)
- Fecha: 2026-09-02
- Estado: aceptado
- Contexto: el cotizador actual sólo conoce software (ADR-0011). La línea de negocio real (reparación de celulares, tablets, consolas) no tenía datos en ningún lado — cualquier estimado sería inventado. Se necesitaba una fuente de verdad editable, separada del código, que sobreviva a cambios de tarifa sin redeploy, y que exprese honestamente al cliente qué tan firme es cada número.
- Decisión: dos tablas Supabase (`repair_price_references`, `repair_service_addons`) con columna `data_confidence` para distinguir entre precio local validado (`local_validated`, encuesta Chiapas / TapaTech Tapachula) y referencia nacional (`market_reference`, talleres de Monterrey/CDMX/Cuernavaca + agregador nacional, aplicada a consolas por ausencia documentada de datos públicos de Chiapas). La metodología de punto medio es `(min + max) / 2` redondeado al entero, dejando el rango tal cual viene de la fuente. Los add-ons no tienen rango — son cargos fijos. Lectura pública, escritura solo autenticados (mismo patrón que `tech_stacks`). Repositorio TS en `lib/quote/repair-catalog.ts` con `import "server-only"`; las funciones devuelven `null` cuando no hay match (regla dura: nunca extrapolar). Tablets se difieren sin filas — no se inventan. Seed inicial: 10 consolas (`market_reference`) + 22 celulares (20 servicios + 2 variantes de pantalla, `local_validated`) + 2 add-ons (`home_pickup_delivery` $100, `advanced_diagnostics` $0 como gancho).
- Opciones consideradas:
  * Catálogo en código TS como Fase 1 (descartado: los precios de reparación cambian más seguido que los de software; queremos editar sin redeploy; tener UI en producción mostrando precios desactualizados es peor que la complejidad de un servicio).
  * Tabla única polimórfica con `entity_type` (descartado: complica RLS, índices y tipos; dos tablas con la misma forma es preferible cuando son dominios conceptualmente distintos).
  * Renombrar la columna `quality_tier` como enum PostgreSQL nativo (descartado: agregar el enum suma migración extra; `CHECK` en `TEXT` sigue la convención del proyecto y mantiene el seed portable).
- Consecuencias:
  * Actualizar precios es `UPDATE` SQL o un futuro panel admin — no redeploy.
  * El motor de Fase 3 puede consumir este catálogo sin cambios estructurales; la UI de Fase 5 debe mostrar disclaimers distintos según `data_confidence` (firm vs. referencial).
  * Cuando Daniel valide precios reales de consola en Chiapas, basta con `UPDATE repair_price_references SET data_confidence = 'local_validated', reference_price_mxn = …, … WHERE …` — el esquema no cambia.
  * Las 22 filas de celulares (20 servicios + 2 variantes de pantalla: `premium_original` y `economic_incell`) se cargaron en `seed 05_repair_price_references.sql` con `data_confidence = 'local_validated'`, calibradas con TapaTech Tapachula + tabla nacional de referencia. `diagnostics` queda explícitamente en $0 como gancho de venta (estratégico, alineado con la competencia local en Tapachula).
  * `tablet` queda sin filas. Consola se cargó con 10 filas `market_reference` en una fase previa (talleres de Monterrey/CDMX/Cuernavaca + agregador nacional, sin datos públicos locales de Chiapas para consolas). Cuando Daniel valide consolas en Chiapas, basta `UPDATE` para promoverlas a `local_validated` sin cambiar el esquema.

## ADR-0013 — Motor de precios determinístico: extracción ≠ cálculo
- Fecha: 2026-09-02
- Estado: aceptado
- Contexto: el cotizador (ADR-0004, ADR-0007) tiene un LLM que hoy devuelve un `Estimate` inventado a partir de heurísticas del system prompt. Eso viola la regla 02 (reglas de negocio no viven en prompts) y produce precios inexactos. Se necesitaba una pieza determinística que fuera la **única** fuente de números, dejando al LLM como clasificador de intención. Un error de cálculo en este código significa cotizar mal a un cliente real.
- Decisión: introducir un nuevo puerto `PricingEngine` (`lib/quote/pricing-engine.ts`) con un solo método `calculate(request: QuoteRequest): Promise<QuoteEstimate>`. La implementación `createPricingEngine` lee de `softwareServiceCatalog` (ADR-0011) y del repositorio de reparación (ADR-0012). El LLM de Fase 4 SOLO clasificará texto libre en `QuoteRequest`; la UI de Fase 5 lo consumirá. Separación estricta: **extracción ≠ cálculo** — ninguna ruta que pase por el LLM produce un número.
- Metodología rango software: `SOFTWARE_ESTIMATE_VARIANCE = 0.15` aplicado simétricamente a la suma de módulos. Justificación: catálogo calibrado con un solo proyecto de referencia (n=1); 15% es un ancho modesto que refleja la incertidumbre real entre proyectos sin diluir la señal del ancla ni inflar el rango. Alternativas consideradas y descartadas: 10% (sobreestima confianza dado n=1), 20% (infla el rango, complica la UI). Constante nombrada exportada para poder ajustarla sin tocar el algoritmo.
- Decisión sobre add-ons desconocidos: se ignoran silenciosamente, no escalan a `requiresManualReview`. Razón: los add-ons son opt-in; la cotización base sigue siendo válida. La UI puede mostrar "add-on no disponible" en una iteración futura. Diferente a los módulos de software desconocidos, donde sí escalamos a manual review porque su ausencia invalida el estimado.
- Decisión sobre `tablet` y `repairTypeId` inexistente: devuelven `confidence: "unavailable"`, `requiresManualReview: true`, `referenceMXN: 0`. Nunca extrapolamos de otra categoría (regla 02: regla de negocio ausente ⇒ no se inventa).
- Consecuencias:
  * La precisión numérica del cotizador queda bajo control de tests unitarios (regla 10): 22 tests cubren todas las ramas y el invariante `low <= ref <= high`.
  * Cualquier cambio de precio se hace en el catálogo, no en el prompt.
  * La Fase 4 puede usar un LLM más pequeño/barato porque ya no tiene que "razonar" sobre precios — solo clasificar intención.
  * El system prompt de Gemini se reduce y deja de inventar números.
  * El puerto es independiente del canal de origen: chat, formulario, API futura — todos producen `QuoteRequest` y consumen `QuoteEstimate`.
  * Una tercera línea de negocio se agrega como nuevo caso del `QuoteRequest` discriminated union y un nuevo `calculateXxx`; la función pública `calculate` solo necesita un `switch` adicional.

## ADR-0014 — Extractor de intención: el LLM solo clasifica, nunca calcula
- Fecha: 2026-09-02
- Estado: aceptado
- Contexto: con el motor determinístico de Fase 3 en su lugar (ADR-0013), el LLM ya no tiene que razonar sobre precios. Pero el motor actual (`lib/quote/claude.ts`, ADR-0007) sigue pidiendo al modelo que invente cifras. Eso mantiene el problema de raíz: cualquier cambio del system prompt o de la temperatura del modelo puede mover un estimado $1,000 MXN sin que nadie lo note. Se necesitaba una separación real: el LLM clasifica intención en IDs de catálogo, y un orquestador une esa clasificación con la Fase 3.
- Decisión: dos archivos nuevos, `lib/quote/intent-extractor.ts` (la única pieza que llama a Gemini) y `lib/quote/quote-engine.ts` (implementa el puerto `QuoteEngine` ya existente, ADR-0004). El extractor devuelve `IntentExtractionResult` con `replyText` (sin cifras) y los IDs clasificados. El `quote-engine` traduce el resultado a `QuoteRequest`, llama a `PricingEngine.calculate` (Fase 3), y arma el `QuoteTurn` con `estimate: { min, max, currency: "MXN" }` solo cuando la Fase 3 lo autoriza. `claude.ts` se conserva marcado como `@deprecated` para rollback con un cambio de import; `@todo` eliminar tras validar el nuevo motor en producción.
- Modelo: `gemini-2.5-flash-lite` ($0.10 / $0.40 por 1M tokens). Configurable vía `GEMINI_MODEL`. Reducción esperada ~5x vs `gemini-1.5-pro-latest` (modelo actual) y ~2.5x vs `gemini-3.1-flash-lite`. Soporta structured outputs (requisito duro). Si en el futuro el modelo se degrada o depreca, basta cambiar `.env`.
- Schema como enum cerrado: el `responseSchema` que se le pasa a Gemini se construye dinámicamente leyendo `softwareServiceCatalog.modules[].id` y los `repairTypeId` / `addon_id` que conoce el catálogo de Fase 2. El campo `softwareModuleIds` es un array de strings con `enum: [...ids válidos]`. Si el catálogo agrega un módulo, el schema lo incluye automáticamente — sin tocar el extractor. El JSON schema no tiene campo de precio, así que el modelo **no puede** emitir una cifra en su `replyText` sin violar el schema.
- System prompt: ~25 líneas con dos reglas duras ("nunca menciones cifras", "tu salida es solo JSON estructurado"). El catálogo se inyecta como referencia informativa; la fuente de verdad es el enum del schema.
- Salida de precios: el `replyText` que devuelve el extractor JAMÁS contiene cifras. Los números solo se adjuntan al `QuoteTurn` después de que la Fase 3 los calculó desde el catálogo. Verificable en tests.
- Manejo de errores: `IntentExtractionError` se traduce a un fallback genérico ("tuve un problema procesando tu mensaje") sin filtrar el error al cliente (regla 03).
- `requiresManualReview: true` se traduce a un mensaje de "cotización manual" — el `estimate` queda `undefined`; nunca se muestra un número a medias.
- Opciones consideradas:
  * Reemplazar `claude.ts` directamente (descartado: sin rollback con un cambio de import; un bug en producción requiere git revert).
  * Usar `gemini-3.1-flash-lite` (descartado por ahora: 2.5x más caro y la adherencia a JSON schema de 2.5-flash-lite es suficiente para el dominio acotado de IDs de catálogo; se puede subir sin cambiar código, solo `.env`).
  * Mantener el modelo actual y solo cambiar el prompt (descartado: no resuelve el problema de raíz, que es pedirle al LLM que calcule).
- Consecuencias:
  * La precisión numérica es 100% responsabilidad de Fase 3 (ya testeada con 22 tests).
  * El LLM se reduce a un clasificador barato: el system prompt baja de ~70 líneas (con heurísticas de precio) a ~25 líneas (solo clasificación).
  * El route handler cambia un import; la UI sigue trabajando con `Estimate` actual (mapeamos `QuoteEstimate` → `Estimate` con `currency: "MXN"`; Fase 5 reemplazará el shape).
  * Si se agrega una tercera línea de negocio, el discriminador `IntentExtractionResult.businessLine` se extiende y `buildQuoteRequest` agrega un nuevo `if`. El extractor y el motor de Fase 3 no se tocan.
  * `loadRepairCatalog` se llama por request (no se cachea). Aceptable porque la query es barata y la fuente de verdad puede cambiar. Cachear introduce stale-data — no vale la pena hoy.

## ADR-0015 — UI del cotizador: selector de línea, desglose y revisión manual
- Fecha: 2026-09-02
- Estado: aceptado
- Contexto: la UI actual (`components/shadow/quote-chat.tsx`) solo muestra un estimado plano `{ min, max, currency }`, sin desglose, sin confianza, sin manejo del caso `requiresManualReview`. El motor de Fase 3 produce un `QuoteEstimate` rico (con `breakdown`, `confidence`, `disclaimerKey`) pero el route de Fase 4 lo aplastaba para preservar la forma vieja del `Estimate`. Además, la clasificación de la línea de negocio (software vs. repair) la cargaba 100% al LLM, que muchas veces adivinaba mal.
- Decisión: cambiar el tipo de `QuoteTurn.estimate` a `QuoteEstimate | undefined` (decisión confirmada con el usuario). Ajustar `mock-engine.ts` para que devuelva el mismo shape (con `breakdown: [{ labelKey: "quoteCatalog.mock.serviceEstimate", amountMXN }]`, `confidence: "calibrated"`). El route deja de aplastar. La UI introduce un selector de línea de negocio explícito al inicio (`components/shadow/quote-line-selector.tsx`) que envía `businessLineHint` al backend en cada request; el extractor lo usa como pista en el system prompt (no como override — el modelo conserva su juicio si la conversación lo contradice). El panel de estimado renderiza el `breakdown` genéricamente, muestra un badge de confianza con color por `confidence` (`local_validated` verde, `market_reference` azul, `calibrated` brand, `unavailable` ámbar), y en el caso `requiresManualReview: true` muestra un mensaje de "cotización manual" + CTA sin ningún número.
- `fillContactForm` se refactoriza: `buildSummary(messages, businessLine, lastBreakdown)` arma el resumen según la línea activa — software usa los nombres de módulos traducidos; repair usa el tipo de reparación + add-ons.
- Traducciones i18n completadas: 12 claves nuevas en `shadow.quote` (selector, confidence, manual review), 4 en `shadow.contactForm` (summary), 6 en `quotePricing.disclaimer`, 32 entradas en `quoteCatalog.repairs.{phone,console}`, 2 en `quoteCatalog.addons`, 1 en `quoteCatalog.mock`. Total ~114 strings nuevos (57 por idioma), todos con valor humano (no placeholders).
- Opciones consideradas:
  * Dejar `Estimate` viejo como `type Estimate = QuoteEstimate` (alias) — implementado: `Estimate` ya no se exporta como tipo propio pero `claude.ts` (deprecated) sigue importándolo. Como ya nadie lo usa desde fuera, no es breaking.
  * Selector de línea como radio buttons inline en el chat (descartado: el usuario a veces no sabe qué seleccionar antes de describir su problema; el componente standalone con CTA explícito es más claro).
  * `businessLineHint` como override duro (descartado: si el usuario seleccionó "repair" pero empieza a hablar de un proyecto de software, el LLM debe poder corregirse; el hint es una pista, no un muro).
- Consecuencias:
  * La UI muestra el desglose real del cálculo (cada módulo de software, cada add-on) y el nivel de confianza del precio.
  * El usuario nunca ve un número falso: `requiresManualReview: true` (tablet, módulo desconocido) → solo CTA.
  * El extractor tiene menos carga cognitiva en el primer turno (el hint le da la respuesta de la línea gratis).
  * El cambio de tipo `Estimate → QuoteEstimate` obliga a que el mock-engine devuelva el mismo shape; el `quote-engine.ts` ya no aplana. La UI consume siempre el shape rico.
  * Las traducciones nuevas son trabajo mecánico, sin decisiones de diseño. ~57 strings × 2 idiomas es manejable y quedaron validadas con un smoke test manual.