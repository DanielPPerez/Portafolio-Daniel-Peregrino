# Definition of Done (verificables)

> **Cópialo a la raíz del proyecto** y márcalo. En rigor **estricto**, las casillas de "Calidad" no
> son negociables. Marca `N/A` lo que no aplique a tu perfil. `/check-done` recorre esta lista
> automáticamente (ver [`../commands/check-done.md`](../commands/check-done.md)).
>
> Cada bloque enlaza la regla que lo respalda.

---

## Calidad de código (obligatorio — estricto)
- [ ] Linter pasa sin errores ni warnings.
- [ ] Formatter aplicado (repo formateado).
- [ ] Tipado estricto activo y sin errores (TS strict / mypy / etc.).
- [ ] Tests de la lógica de negocio pasan; flujos críticos cubiertos.
- [ ] Git hooks (pre-commit con lint+format+test) configurados.
- [ ] CI verde (lint + test + build + audit) en el último push.

## Estilo → [`rules/01`](../rules/01-code-style.md)
- [ ] Código en inglés; comentarios en el idioma de `COMMENTS_LANG`.
- [ ] Cada función con una línea de descripción; sin comentarios obvios.
- [ ] Valores sensibles / params críticos / side-effects etiquetados con tags.

## Reglas de negocio → [`rules/02`](../rules/02-business-rules.md)
- [ ] Reglas en la capa de dominio, sin I/O; sin números mágicos.
- [ ] Validación de negocio con errores tipados.
- [ ] Cada regla con tests de sus bordes.

## Errores y validación → [`rules/03`](../rules/03-errors-validation.md)
- [ ] Todo input externo validado con esquema en la frontera.
- [ ] Env vars validadas al arranque.
- [ ] Formato de error único con `code` estable; sin `catch` vacíos; sin stacks filtrados.

## Seguridad → [`rules/04`](../rules/04-security.md)
- [ ] Sin secretos en el repo; `.env.example` presente; `.env` ignorado.
- [ ] Queries parametrizadas; salida escapada (sin XSS).
- [ ] Autorización verificada en servidor; mínimo privilegio.
- [ ] Rate limiting / idempotencia donde aplica; CORS y headers correctos; HTTPS en prod.
- [ ] PII marcada `@sensitive` y no logueada; `audit` de dependencias limpio.

## Auditores (obligatorio — estricto) → [`skills/auditors`](../skills/auditors.md)
- [ ] **Semgrep** (`semgrep scan --config auto`) sin findings críticos.
- [ ] **gitleaks** (`gitleaks detect`) sin secretos detectados.
- [ ] El **auditor del stack** corre limpio (react-doctor / vue-mess-detector / Ruff+Bandit / golangci-lint / etc.).
- [ ] Sin código muerto ni dependencias sin usar (knip / vulture).

## Performance → [`rules/05`](../rules/05-performance.md)
- [ ] Índices correctos; sin N+1; sin `SELECT *` innecesario.
- [ ] Listados paginados por defecto.
- [ ] Caché documentada donde aplica.
- [ ] (Web) filtros/orden/paginación en la URL.
- [ ] Trabajo pesado en background.

## Observabilidad → [`rules/06`](../rules/06-observability.md)
- [ ] Logs estructurados con id de correlación y niveles correctos.
- [ ] No se loguean secretos/PII.
- [ ] Health check disponible (servicios).

## i18n → [`rules/07`](../rules/07-i18n.md)
- [ ] Cero texto visible hardcodeado; todo por claves.
- [ ] Locales con fallback definido; fechas/números/moneda por `Intl`.

## Arquitectura → [`rules/08`](../rules/08-architecture-change.md)
- [ ] Lógica de negocio detrás de puertos; detalles como adaptadores.
- [ ] API versionada (`/v1`); dependencias inyectadas.
- [ ] Cambios grandes con expand→migrate→contract.

## Git y documentación → [`rules/09`](../rules/09-git-docs.md)
- [ ] Commits Conventional; trabajo en ramas; `main` desplegable.
- [ ] README permite levantar en < 5 min; ARCHITECTURE.md y DECISIONS.md al día.
- [ ] CHANGELOG actualizado; doc cambiada en el mismo PR.

## Pruebas y casos límite → [`rules/10`](../rules/10-testing-edge-cases.md)
- [ ] Casos de uso y límite enumerados (vacío/null/máximos/concurrencia/error).
- [ ] Tests cubren los bordes y los caminos de error, no solo el feliz.
- [ ] Cada bug corregido tiene test de regresión; tests deterministas.

## Disciplina de alcance → [`rules/11`](../rules/11-scope-discipline.md)
- [ ] El diff toca solo lo necesario; sin reformateos ni refactors no pedidos.
- [ ] Tests pasaban antes y siguen pasando; no se rompieron contratos públicos.
- [ ] No se borró código no entendido; mejoras fuera de alcance quedaron propuestas.
- [ ] (Si es tarea acotada, ver [`scoped-change.md`](scoped-change.md).)

## Estándar externo → [`rules/12`](../rules/12-standards-interop.md)
- [ ] Si hay estándar de empresa, está en `context/EXTERNAL_STANDARD.md` y se respetó por encima de este.
- [ ] Se usaron sus herramientas (lint/format/CI); conflictos documentados.

## Guardarraíles → [`rules/13`](../rules/13-junior-guardrails.md)
- [ ] Bug atacado en su causa raíz; se reusó lo existente antes de crear.
- [ ] Commit sin secretos/logs de debug/código comentado; sin tocar `main`/historia compartida.

## Simplicidad (ponytail) → [`skills/ponytail`](../skills/ponytail.md)
- [ ] Sin abstracciones/dependencias innecesarias; `/ponytail-review` pasado.
- [ ] Deuda diferida registrada (`/ponytail-debt`).

## Continuidad entre IAs
- [ ] `context/AI_CONTEXT.md` y `context/PROGRESS.md` actualizados.
- [ ] Decisiones nuevas registradas como ADR en `context/DECISIONS.md`.
