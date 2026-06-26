# Perfil: API / Backend

> Las reglas de [`../rules/`](../rules/) aplican **todas**. Este perfil marca el énfasis y lo
> específico de una API. Arquitectura: monolito modular + hexagonal por defecto
> (ver [`../architecture/decision-guide.md`](../architecture/decision-guide.md)).

---

## Énfasis de reglas

| Regla | Por qué pesa aquí |
|---|---|
| [`03-errors-validation`](../rules/03-errors-validation.md) | Validación en frontera + formato de error único. Es la cara pública. |
| [`04-security`](../rules/04-security.md) | Auth, rate limiting, idempotencia, mínimo privilegio, CORS. |
| [`05-performance`](../rules/05-performance.md) | Paginación, índices, N+1, caché, trabajo async en cola. |
| [`08-architecture-change`](../rules/08-architecture-change.md) | Puertos/adaptadores para BD; contrato versionado. |
| [`06-observability`](../rules/06-observability.md) | Logs estructurados con request id; health check; métricas RED. |

## Específico de API

- **Contrato primero:** define el contrato (OpenAPI / schema) como fuente de verdad; documenta endpoints,
  códigos de estado, formas de request/response y errores.
- **Versionado** (`/v1`) desde el día 1; cambios incompatibles → nueva versión, no romper clientes.
- **Códigos HTTP correctos:** 2xx éxito, 4xx error del cliente (con `code`), 5xx error del servidor.
- **Idempotencia** en POST/PUT que se puedan reintentar (clave de idempotencia).
- **Paginación por defecto** en todo listado (cursor preferido).
- **Rate limiting** en endpoints públicos/sensibles.
- **Reglas de negocio en el dominio**, detrás de casos de uso; los controladores solo orquestan.

## Datos

- Repositorios detrás de puertos → poder migrar NoSQL↔SQL sin tocar negocio.
- Transacciones para escrituras multi-paso (ACID, ver [`00-core-principles`](../rules/00-core-principles.md)).
- Migraciones de esquema versionadas y reversibles.

## Tooling obligatorio (rigor estricto)

- Tipado estricto (TS strict / mypy). Linter + formatter. Tests (unit de dominio + integración de endpoints).
- Git hooks + CI (lint, test, build, audit de dependencias).
- Validación de env vars al arranque.

## Auditores recomendados → [`skills/auditors.md`](../skills/auditors.md)
- Baseline obligatorio: **Semgrep** (SAST) + **gitleaks** (secretos).
- Según el lenguaje: JS/TS → ESLint/Biome + knip + `npm audit`; Python → Ruff + mypy + **Bandit** +
  pip-audit; Go → golangci-lint + **gosec**.

## Verificables extra del perfil

- [ ] Contrato (OpenAPI/schema) definido y versionado (`/v1`).
- [ ] Códigos HTTP correctos + formato de error único con `code`.
- [ ] Paginación por defecto; rate limiting e idempotencia donde aplica.
- [ ] Repositorios detrás de puertos; escrituras multi-paso en transacción.
- [ ] Logs con request id; health check disponible.
