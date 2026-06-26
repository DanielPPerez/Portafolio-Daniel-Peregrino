# `_project-standard/` — Estándar de proyectos con IA

Carpeta-plantilla que se copia al inicio de **cada** proyecto. Su trabajo:

1. **Imponer un estándar de calidad senior** (reglas siempre activas + verificables).
2. **Generar verificables auto-revisables** (Definition of Done + `/check-done`).
3. **Garantizar continuidad entre IAs** — cualquier IA (de pago o gratis) puede arrancar o
   retomar el proyecto sin perder contexto.

> Una sola fuente de verdad (`rules/`) que se **proyecta** a Claude Code, Cursor, Windsurf y
> cualquier IA web/local. No se duplican reglas; un script las regenera.

---

## Cómo usarlo en 3 pasos

### Paso 1 — Arrancar el proyecto
Abre [`START_HERE.md`](START_HERE.md) y responde el cuestionario (puedes pedírselo a la IA).
Al terminar tendrás: perfil activado, skills a leer, **arquitectura recomendada**, un
`Definition of Done` pre-rellenado y un `context/AI_CONTEXT.md` inicial.

### Paso 2 — Proyectar las reglas a tus herramientas
```bash
node _project-standard/sync/sync-rules.mjs
```
Genera `.claude/`, `.cursor/rules/`, `.windsurf/rules/` y `AGENTS.md` desde `rules/`.
Sin Node, usa el fallback manual de [`sync/SYNC.md`](sync/SYNC.md).

### Paso 3 — Trabajar y verificar
- Pega [`prompts/00-bootstrap-prompt.md`](prompts/00-bootstrap-prompt.md) a cualquier IA el día 1.
- Antes de cerrar cada sesión, actualiza [`context/PROGRESS.md`](context/PROGRESS.md).
- Antes de dar algo por terminado, corre `/check-done` (o pega
  [`commands/check-done.md`](commands/check-done.md) en una IA sin slash commands).

---

## Mapa de la carpeta

| Carpeta | Para qué |
|---|---|
| [`START_HERE.md`](START_HERE.md) | Cuestionario de arranque. **El corazón.** |
| [`prompts/`](prompts/) | Texto listo para pegar a una IA (día 1 y al retomar). |
| [`rules/`](rules/) | **Fuente de verdad** de las reglas 00–13 (portable, pegable en cualquier chat). |
| [`architecture/`](architecture/) | Qué arquitectura usar y por qué (catálogo + matriz de decisión). |
| [`profiles/`](profiles/) | Énfasis de reglas por tipo de proyecto (web / api / cli). |
| [`skills/`](skills/) | repomix, ponytail, comment-style, markitdown (ingesta), react-doctor (React/Next) y el catálogo de auditores por stack. |
| [`knowledge/`](knowledge/) | Base de conocimiento: docs/PDF/YouTube convertidos a `.md` legibles por la IA. |
| [`checklists/`](checklists/) | Definition of Done, pre-deploy, cambios grandes y cambio acotado. |
| [`context/`](context/) | Continuidad entre IAs: estado, diario, decisiones (ADRs) y estándar externo. |
| [`commands/`](commands/) | `/check-done` (auto-revisión de los verificables). |
| [`sync/`](sync/) | Proyección de `rules/` a cada herramienta. |

---

## Principios del estándar (resumen)

- **Código 100% en inglés**; comentarios/docstrings en **español** por defecto (toggle a inglés).
- **Funciones con una sola línea** de descripción; cero comentarios obvios; tags grepeables.
- **Rigor estricto**: lint + formatter + tipado estricto + tests + git hooks + CI obligatorios.
- **i18n obligatorio**: nunca texto hardcodeado en UI.
- **Programar para el cambio**: desacoplamiento que permite migrar BD o capas sin romper.
- **Casos límite**: intuir, documentar y testear los bordes, no solo el camino feliz.
- **Disciplina de alcance**: diff mínimo; no tocar ni romper lo que no te corresponde.
- **Acoplable a otros estándares**: el de la empresa gana; este complementa.
- **Continuidad**: el proyecto se documenta a sí mismo para cualquier IA.

Detalle de cada principio en [`rules/`](rules/).
