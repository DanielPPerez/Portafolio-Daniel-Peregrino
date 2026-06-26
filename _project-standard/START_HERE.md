# START_HERE — Cuestionario de arranque

> **Objetivo:** responde estas preguntas al iniciar el proyecto. Puedes responderlas tú o pedirle
> a la IA que las haga contigo. Al final, la sección **SALIDA** te dice exactamente qué activar.
>
> Copia las respuestas a [`context/AI_CONTEXT.md`](context/AI_CONTEXT.md) para que toda IA futura
> las lea.

---

## 1. Cuestionario

### A. Identidad
1. **Nombre del proyecto** y una frase de qué hace.
1b. **Modo del proyecto**: ¿es **nuevo (greenfield)** o **te unes a uno existente / a medias**?
    Si te unes a medias o es un fix puntual, salta al **modo acotado**:
    [`prompts/02-scoped-task-prompt.md`](prompts/02-scoped-task-prompt.md) (infiere y confirma el
    alcance antes de tocar nada) y revisa [`checklists/scoped-change.md`](checklists/scoped-change.md).
2. **Tipo de proyecto** (elige uno o varios): `web-fullstack` · `api-backend` · `cli-automation`.
3. **Stack** previsto (lenguaje, framework, runtime). Si no lo sabes, deja que la IA lo proponga
   y registra el porqué en `DECISIONS.md`.
4. **Protocolos** de comunicación: REST · GraphQL · gRPC · WebSocket · colas/eventos · CLI/stdout.
5. **Base de datos**: ninguna · SQL (¿cuál?) · NoSQL (¿cuál?) · ambas. ¿Esperas que cambie?

### B. Requisitos transversales
6. **Auth**: ninguna · API key · sesión · JWT · OAuth/OIDC · otra.
7. **Consumidores** de la API/app: tú · frontend propio · terceros · público.
8. **Tiempo real**: no · sí (¿qué eventos?).
9. **Escala esperada** (12 meses): baja (1 instancia) · media · alta (multi-instancia/global).
10. **Despliegue**: dónde corre (VPS · contenedor · serverless · edge) y cómo se publica.

### C. Convenciones del estándar
11. **Idioma de comentarios**: español (default) · inglés. (El código SIEMPRE en inglés.)
12. **i18n**: ¿qué idiomas/locales soporta la UI? (mínimo uno; obligatorio aunque sea uno solo).
13. **Rigor**: estricto (default de este estándar) · equilibrado · ligero.
14. **¿Estándar externo?**: ¿la empresa/proyecto tiene su propio estándar? Si **sí**, rellena
    [`context/EXTERNAL_STANDARD.md`](context/EXTERNAL_STANDARD.md) — ese estándar **gana** sobre este
    (ver [`rules/12-standards-interop.md`](rules/12-standards-interop.md)).

---

## 2. SALIDA — qué activar según tus respuestas

Rellena esta tabla con base en el cuestionario. Es lo que la IA debe respetar.

### (a) Perfil y reglas
- **Perfil activo** → según P2, abre el archivo correspondiente en [`profiles/`](profiles/):
  - `web-fullstack` → [`profiles/web-fullstack.md`](profiles/web-fullstack.md)
  - `api-backend` → [`profiles/api-backend.md`](profiles/api-backend.md)
  - `cli-automation` → [`profiles/cli-automation.md`](profiles/cli-automation.md)
- **Reglas siempre activas** → todas las de [`rules/`](rules/). El perfil solo cambia el *énfasis*.

### (b) Skills a leer
- Siempre: [`skills/comment-style.md`](skills/comment-style.md) + [`skills/ponytail.md`](skills/ponytail.md).
- Al pasar el repo a una IA web o medir tokens: [`skills/repomix.md`](skills/repomix.md).
- Al ingestar documentos (PDF/DOCX/XLSX), imágenes o **enlaces de YouTube** → `.md` en `knowledge/`:
  [`skills/markitdown.md`](skills/markitdown.md).
- **Solo si el proyecto es React/Next** (P2 = web-fullstack/frontend con React):
  [`skills/react-doctor.md`](skills/react-doctor.md) para auditar salud del código.
- **Auditores según tu stack** (Vue, Svelte, Angular, Python, Go, etc.) + el **baseline obligatorio
  Semgrep + gitleaks**: [`skills/auditors.md`](skills/auditors.md).

### (c) Definition of Done pre-rellenado
- Copia [`checklists/definition-of-done.md`](checklists/definition-of-done.md) a la raíz del
  proyecto y marca como N/A lo que no aplique a tu perfil (P2). En rigor **estricto**, las casillas
  de calidad (lint, format, tipos, tests, hooks, CI) NO son opcionales.

### (d) AI_CONTEXT inicial
- Crea [`context/AI_CONTEXT.md`](context/AI_CONTEXT.md) con las respuestas de la sección 1.
  Es lo primero que leerá cualquier IA nueva.

### (e) Arquitectura recomendada
- Cruza P2 (tipo) + P9 (escala) + tamaño de equipo en
  [`architecture/decision-guide.md`](architecture/decision-guide.md).
- Registra la elección final como **ADR-0001** en [`context/DECISIONS.md`](context/DECISIONS.md),
  con la justificación y el patrón de evolución (cuándo cambiarías de arquitectura).

### (f) Estándar externo y modo de trabajo
- Si P14 = sí → rellena [`context/EXTERNAL_STANDARD.md`](context/EXTERNAL_STANDARD.md); ese estándar
  **gana** sobre este ([`rules/12`](rules/12-standards-interop.md)).
- Si P1b = "te unes a medias / fix puntual" → trabaja en **modo acotado**
  ([`prompts/02-scoped-task-prompt.md`](prompts/02-scoped-task-prompt.md)) y verifica con
  [`checklists/scoped-change.md`](checklists/scoped-change.md): infiere el alcance, confírmalo y no
  toques lo que no te corresponde.

---

## 3. Ejemplo resuelto (API backend)

> Caso: API de reservas para una pyme, equipo de 2, crecimiento incierto.

| Pregunta | Respuesta |
|---|---|
| P2 Tipo | `api-backend` |
| P3 Stack | Node + TypeScript + Fastify |
| P4 Protocolo | REST (`/v1`) |
| P5 BD | "Empezamos NoSQL (Mongo) pero podría migrar a SQL" → **abstracción de datos obligatoria** |
| P6 Auth | JWT |
| P9 Escala | media |
| P11 Idioma | comentarios en español |
| P12 i18n | `es`, `en` (mensajes de error y emails) |

**Salida:**
- Perfil: `profiles/api-backend.md`. Reglas: todas, con énfasis en `03-errors-validation`,
  `04-security`, `05-performance`.
- Skills: comment-style + ponytail (repomix cuando toque handoff).
- Arquitectura recomendada (decision-guide): **monolito modular + hexagonal** — la lógica de
  reservas detrás de un puerto `ReservationRepository`, con adaptador `MongoReservationRepository`
  hoy y posibilidad de `SqlReservationRepository` mañana **sin tocar la lógica de negocio**
  (ver [`rules/08-architecture-change.md`](rules/08-architecture-change.md)). → ADR-0001.
- DoD: todas las casillas de calidad obligatorias; i18n con 2 locales; paginación por defecto en
  listados; rate limiting en endpoints de escritura.
