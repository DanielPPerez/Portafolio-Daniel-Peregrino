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
- Suite de tests (Vitest) para `lib/quote/mock-engine.ts` y `lib/validation/contact.ts`.
- Auditores: Semgrep, gitleaks, knip, react-doctor (cablear a CI).
- Backend del cotizador (Claude) e integración real de Google Calendar.