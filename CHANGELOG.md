# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y versionado [SemVer](https://semver.org/lang/es/).

## [Unreleased]

### Added

- Adopción del estándar `_project-standard/` (alcance "Base recomendada"): docs de continuidad
  (`AI_CONTEXT`, `DECISIONS`, `PROGRESS`), `ARCHITECTURE.md`, `DEFINITION_OF_DONE.md`, `CHANGELOG.md` y proyección a
  `CLAUDE.md`/`AGENTS.md`/`.cursor`/`.windsurf`.
- Tooling de calidad: ESLint + Prettier + EditorConfig, Husky + lint-staged (pre-commit), CI (lint/typecheck/build) y
  `.env.example`.

### Changed

- Pasada de estilo según `rules/01`: tags grepeables (`@sideffect`/`@sensitive`), docstrings de una línea y
  auditoría de textos i18n.

## [0.1.0] — 2026-06-25

### Added

- Frontend completo del portafolio (`/`) y de RedFox_Solutions (`/RedFox_Solutions`): hero, secciones, i18n es/en,
  modo claro/oscuro en RedFox_Solutions, cotizador (UI sobre el puerto `QuoteEngine`), formulario con validación Zod,
  cards de certificaciones con enlace a credenciales, transición overlay entre páginas y navbars responsive.
