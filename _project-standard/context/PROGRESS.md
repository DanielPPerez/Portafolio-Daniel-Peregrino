# PROGRESS — diario de sesiones

> Una entrada **al cerrar cada sesión**. Es el handoff: la siguiente IA lee la última entrada y sabe dónde retomar.
> La entrada más reciente va **arriba**.

---

<!-- Plantilla de entrada (copiar arriba de las anteriores)
## AAAA-MM-DD — <IA / persona>
- **Hecho:** <...>
- **En curso:** <archivo/función + estado>
- **Próximo paso:** <acción concreta>
- **Decisiones:** <ADR-00X o "ninguna">
- **Bloqueos / dudas:** <...>
-->

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
