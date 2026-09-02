git add README.md \
          _project-standard/context/AI_CONTEXT.md \
          _project-standard/context/PROGRESS.md \
          _project-standard/context/DECISIONS.md \
          BACKEND_SETUP.md \
          .env.example
# PROGRESS — diario de sesiones

> Una entrada **al cerrar cada sesión**. Es el handoff: la siguiente IA lee la última entrada y sabe dónde retomar.
> La entrada más reciente va **arriba**.

---

## 2026-09-02 — Kilo (cotizador: 502 + guion repair, round 2)
- **Hecho:**
  - **Root cause del 502 descubierto vía logging**: la 500 no vino del LLM, vino de Supabase mal configurado (`NEXT_PUBLIC_SUPABASE_URL` = `glxdlsjoqpcalgvkzwoz`, falta el `https://`). El `defaultRepairCatalogLoader` y `calculateRepair` llamaban a `getSupabaseServerClient()` que lanzaba `Invalid supabaseUrl`, y el `PricingEngine.calculate` no tenía try/catch → 500.
  - **Resiliencia del pricing engine**: `pricingEngine.calculate()` está en try/catch en `quote-engine.ts`; si Supabase falla, degrada a cotización manual (`unavailable`) con reply "Esto requiere una cotización manual" — en vez de 500. Loguea como `op: "quote.pricing"`.
  - **Resiliencia del loader**: `defaultRepairCatalogLoader` ya try/catch — loguea `quote.repairCatalogLoad` y devuelve catálogos vacíos.
  - **Requirement labels localizados**: `buildRequirements` toma `locale` y usa `quote.requirementLabels` (es/en). Antes mostraba "Software:"/"Repair:"/"Add-ons:" en inglés dentro de UI en español.
  - **Hint inteligente cuando catálogo vacío**: si `businessLineHint="repair"` pero `repairTypeIds=[]` (Supabase caído), se omite el hint al extractor para no forzar un `businessLine=repair` con IDs inexistentes.
  - **Limpieza**: borrado import muerto `IntentExtractionError` en route.ts.
- **En curso:** —
- **Próximo paso:** corregir `NEXT_PUBLIC_SUPABASE_URL` en `.env.local` (falta el `https://`) para que el motor real de repair sirva precios reales en vez de degradarse a manual review.
- **Decisiones:** bugfix + resiliencia/UX, no arquitectural; sigue vigente ADR-0014.
- **Tests:** 40/40 verdes (22 pricing + 8 extractor + 10 mock-engine). `pnpm typecheck` y `pnpm lint` limpios.
- **Manual probe (GOOGLE_API_KEY real):** 6 escenarios 200 OK — repair ES ("Reparación: phone → screen_replacement"), repair EN ("Repair: phone → screen_replacement"), software tienda con estimate calculado (referenceMXN 43844.4), software EN. 3 repair que alcanzan el pricing step → 200 graceful manual review (Supabase caído degrada correctamente, no 500). 1 falso negativo transitorio: Gemini 503 "model is currently experiencing high demand" en burst de requests (rate limit del proveedor, no bug del código — funciona en reintento individual).
- **Conversational loop fix**: system prompt del extractor ganó sección "GESTIÓN DE CONVERSACIÓN" (no repetir preguntas, inferir typos, avanzando hacia readyForEstimate). Re-verificado: el escenario "consola no enciende" que antes loopeaba "¿es la Xbox One Series X?" ahora avanza turno a turno (confirma device, luego pregunta solo calidad). 1 caso de typo "se me vayo" no inferido (texto genérico sin device info — comportamiento correcto).

## 2026-08-18 — Claude (Claude Code)
- **Hecho:** actualizado documentación viva (README.md, AI_CONTEXT.md, PROGRESS.md, DECISIONS.md, BACKEND_SETUP.md, .env.example) para reflejar estado real del código: cotizador conectado a Gemini (LLM real), formulario de contacto usa Gmail API con etiqueta automática “REDFOX”, esquema de Supabase listo (migrations y seeds) para integración futura, variables de entorno actualizadas.
- **En curso:** documentación viva actualizada.
- **Próximo paso:** continuar con desarrollo de características pendientes (tests, auditores, integración Supabase) si se requiere.
- **Decisiones:** ADR-0007 (uso de Gemini para cotizador).
- **Bloqueos / dudas:** ninguno.

## 2026-06-25 — Claude (Claude Code)
- **Hecho:** se aplicó `_project-standard` al repo (alcance "Base recomendada"): copia del estándar dentro del repo,
  proyección a `CLAUDE.md`/`AGENTS.md`/`.cursor`/`.windsurf` (sync), `context/` relleno (AI_CONTEXT, DECISIONS ADR-0001..0006,
  este PROGRESS), docs vivas (`ARCHITECTURE.md`, `CHANGELOG.md`, `DEFINITION_OF_DONE.md`), tooling
  (ESLint+Prettier+EditorConfig, Husky+lint-staged, CI, `.env.example`) y una pasada de estilo (tags grepeables,
  docstrings, auditoría i18n).
- **En curso:** —
- **Próximo paso:** commit/push (Conventional Commits, en rama). Luego, fases diferidas.
- **Decisiones:** ADR-0001 a ADR-0006 en `DECISIONS.md`.
- **Bloqueos / dudas:** ninguno.

## Diferido (no hecho aún)
- Suite de tests (Vitest) para `lib/validation/contact.ts`.
- Auditores: Semgrep, gitleaks, knip, react-doctor (cablear a CI).
- Backend del cotizador (Claude) e integración real de Google Calendar.