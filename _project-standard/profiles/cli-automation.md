# Perfil: CLI / Automatización

> Las reglas de [`../rules/`](../rules/) aplican **todas**, ajustadas a herramientas de línea de
> comandos, scripts y automatizaciones (bots, jobs, pipelines de datos).

---

## Énfasis de reglas

| Regla | Por qué pesa aquí |
|---|---|
| [`03-errors-validation`](../rules/03-errors-validation.md) | Validar args/env/inputs; fallar con mensaje claro y **exit code** correcto. |
| [`06-observability`](../rules/06-observability.md) | Logs claros; modo `--verbose`; saber qué pasó en una corrida desatendida. |
| [`04-security`](../rules/04-security.md) | Secretos por env, nunca en flags ni en logs; mínimo privilegio. |
| [`01-code-style`](../rules/01-code-style.md) | Funciones cortas con tags; los scripts también se mantienen. |

## Específico de CLI / scripts

- **Exit codes:** `0` éxito, distinto de `0` en error (y consistente). Quien orquesta depende de esto.
- **Args y ayuda:** parser de argumentos real (no leer `argv` a mano), `--help` útil, validación de inputs.
- **Idempotencia:** correr el script dos veces no debe duplicar efectos ni corromper estado.
- **Salida:** mensajes a `stderr` para logs/errores, resultado a `stdout` (permite pipes). `--json` si lo consumen máquinas.
- **Dry-run:** para operaciones destructivas, ofrece `--dry-run` que muestra qué haría sin hacerlo.
- **Manejo de fallos:** reintentos con backoff hacia servicios externos; timeouts; limpieza al abortar (señales).
- **Configuración:** por flags > env > archivo de config, con precedencia clara y valores por defecto sensatos.
- **Progreso:** en tareas largas, muestra avance; loguea inicio/fin con duración.

## Puertos también aquí

- Aísla el I/O (red, FS, BD, APIs) detrás de funciones/interfaces para poder testear la lógica sin tocar el mundo real.
- La lógica de transformación de datos debe ser pura y testeable.

## Tooling obligatorio (rigor estricto)

- Tipado/lint/format según lenguaje (TS strict, Ruff/mypy, etc.).
- Tests de la lógica (no del I/O). Git hooks + CI.
- Si se distribuye, versionado SemVer y CHANGELOG.

## Auditores recomendados → [`skills/auditors.md`](../skills/auditors.md)
- Baseline obligatorio: **Semgrep** + **gitleaks**.
- Según el lenguaje: Python → Ruff + Bandit + vulture + pip-audit; JS/TS → ESLint/Biome + knip;
  Go → golangci-lint + gosec.

## Verificables extra del perfil

- [ ] Exit codes correctos y consistentes.
- [ ] Args validados con parser real; `--help` útil.
- [ ] Idempotente; `--dry-run` en operaciones destructivas.
- [ ] stdout para resultado, stderr para logs; `--json` si aplica.
- [ ] I/O aislado detrás de interfaces; lógica pura testeada.
- [ ] Secretos por env, nunca en flags ni logs.
