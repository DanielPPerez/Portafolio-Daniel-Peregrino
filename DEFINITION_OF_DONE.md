# Definition of Done — Portafolio Daniel Peregrino

> Adaptado del estándar (`_project-standard/checklists/definition-of-done.md`) a este proyecto **frontend-only**.
> `[N/A]` = no aplica (sin backend/DB/API). `[ ]` pendiente · `[x]` cumplido. Fuente de reglas: `_project-standard/rules/`.

## Calidad de código

- [x] Linter (ESLint) pasa sin errores.
- [x] Formatter (Prettier) aplicado.
- [x] Tipado estricto (TS `strict`) sin errores.
- [ ] Tests de lógica pasan — **pendiente** (Vitest para `lib/quote` y `lib/validation`).
- [x] Git hooks (pre-commit con lint+format vía Husky/lint-staged).
- [x] CI (lint + typecheck + build) en cada push/PR.

## Estilo → rules/01

- [x] Código en inglés; comentarios en `es`.
- [x] Funciones clave con una línea de descripción; sin comentarios obvios.
- [x] Side-effects / valores sensibles etiquetados con tags (`@sideffect`, `@sensitive`).

## Reglas de negocio → rules/02

- [N/A] Capa de dominio sin I/O — no hay dominio de negocio aún (la única "lógica" es el `QuoteEngine` mock, ya tras puerto).

## Errores y validación → rules/03

- [x] Input del formulario validado con esquema (Zod) en `lib/validation/contact.ts`.
- [N/A] Validación de env al arranque — no hay env requeridas todavía.
- [x] Sin `catch` vacíos; clipboard falla en silencio de forma controlada.

## Seguridad → rules/04

- [x] Sin secretos en el repo; `.env.example` presente; `.env*` ignorado.
- [x] Sin XSS: no se usa `dangerouslySetInnerHTML`; enlaces externos con `rel="noopener noreferrer"`.
- [N/A] AuthZ / queries parametrizadas / rate limiting — no hay backend.
- [x] Correo marcado `@sensitive`; nada de PII logueada.

## Auditores → skills/auditors

- [ ] Semgrep / gitleaks / knip / react-doctor — **pendiente (diferido)**.

## Performance → rules/05

- [x] Imágenes vía `next/image`; Matrix rain pausado en pestaña oculta; animaciones con `will-change`.
- [N/A] Índices / N+1 / paginación — no hay BD ni listados remotos.

## Observabilidad → rules/06

- [N/A] Logs estructurados / health check — no hay servidor.

## i18n → rules/07

- [x] Texto visible por claves (`lib/i18n/{es,en}.ts`); `es` default con fallback.
- [x] Fechas/números/moneda con `Intl` (cotizador).

## Arquitectura → rules/08

- [x] Cotizador detrás del puerto `QuoteEngine` (DIP) — ADR-0004.
- [N/A] API versionada — no hay API aún.

## Git y documentación → rules/09

- [x] Conventional Commits; trabajo en ramas; `main` desplegable.
- [x] README < 5 min; `ARCHITECTURE.md` y `DECISIONS.md` al día.
- [x] `CHANGELOG.md` presente.

## Pruebas y casos límite → rules/10

- [ ] Tests de bordes — **pendiente** (diferido junto con la suite).

## Disciplina de alcance → rules/11

- [x] Diff acotado; sin refactors no pedidos; no se rompió lo existente.

## Estándar externo → rules/12

- [x] No hay estándar externo (`EXTERNAL_STANDARD.md` → Activo: no).

## Guardarraíles → rules/13

- [x] Sin secretos / logs de debug / código comentado en commits; no se toca `main` directo.

## Simplicidad (ponytail)

- [x] Sin abstracciones ni dependencias innecesarias.

## Continuidad entre IAs

- [x] `AI_CONTEXT.md` y `PROGRESS.md` actualizados; decisiones en `DECISIONS.md` (ADR-0001..0006).
