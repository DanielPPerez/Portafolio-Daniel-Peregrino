# Skill: catálogo de auditores por ecosistema

> **Qué es:** la guía para elegir el **auditor de código** correcto según el stack del proyecto.
> react-doctor cubre React; este catálogo cubre el resto. Todos se invocan vía CLI/npx, sin acoplarse
> al código, igual que ponytail y repomix.
>
> Regla: **un baseline de seguridad transversal SIEMPRE** (Semgrep + gitleaks) **+ el auditor del
> stack**. Lo que detecten alimenta el [`Definition of Done`](../checklists/definition-of-done.md).

---

## 1. Tabla maestra — qué correr según el stack

| Stack / tipo | Auditor del stack | Extra recomendado |
|---|---|---|
| **React / Next / Vite / RN / Expo** | [`react-doctor`](react-doctor.md) (`npx react-doctor@latest`) | knip, a11y (axe) |
| **Vue / Nuxt** | vue-mess-detector (`npx vue-mess-detector analyze`) | knip, a11y |
| **Svelte / SvelteKit** | svelte-check + eslint-plugin-svelte | knip, a11y |
| **Angular** | angular-eslint (`ng lint`) | knip, a11y |
| **JS/TS genérico (API, libs)** | ESLint o Biome | knip, `npm audit` |
| **Python (API, CLI, data)** | Ruff + mypy + Bandit | vulture, pip-audit |
| **Go** | golangci-lint | gosec |
| **CUALQUIERA** | **Semgrep + gitleaks** (baseline obligatorio) | — |

> No reinventes: si la empresa ya impone un auditor (ver [`../rules/12-standards-interop.md`](../rules/12-standards-interop.md)),
> usa el suyo. Al aplicar fixes de un auditor, respeta el alcance ([`../rules/11-scope-discipline.md`](../rules/11-scope-discipline.md)):
> no refactorices medio repo por un warning.

---

## 2. Baseline transversal OBLIGATORIO (cualquier lenguaje)

### Semgrep — SAST multi-lenguaje (30+ lenguajes)
Encuentra patrones inseguros y bugs. Respalda [`../rules/04-security.md`](../rules/04-security.md).

```bash
# instalar (elige uno): Python pipx / Homebrew / Docker
pipx install semgrep        # o: brew install semgrep
# escanear con el ruleset automático
semgrep scan --config auto
# en CI
semgrep ci
```
- Docker (sin instalar): `docker run --rm -v "${PWD}:/src" semgrep/semgrep semgrep scan --config auto`

### gitleaks — escaneo de secretos
Detecta claves/tokens/passwords filtrados en el código o el historial git.

```bash
# instalar: winget / brew / docker
winget install gitleaks      # o: brew install gitleaks
# escanear el working tree y el historial
gitleaks detect --source . --redact
```
- Docker: `docker run --rm -v "${PWD}:/path" zricethezav/gitleaks:latest detect --source=/path`
- Complementa el secretlint de [`repomix`](repomix.md) (uno protege el repo, el otro el handoff a IA).

> Ambos van en **pre-commit y CI**. Sin findings críticos = casilla del Definition of Done.

---

## 3. Por ecosistema

### JavaScript / TypeScript (cualquier framework)
- **ESLint** (estándar) o **Biome** (rápido, lint+format en uno). Tipado: `tsc --noEmit` en `strict`.
- **knip** — código, exports y dependencias sin usar. Reduce bundle y deuda.
  ```bash
  npx knip            # reporta; añade --fix para limpiar deps no usadas
  ```
- **npm audit** / `pnpm audit` — dependencias vulnerables.
- **size-limit** — presupuesto de tamaño de bundle (web). Respalda [`../rules/05-performance.md`](../rules/05-performance.md).

### React / Next / Vite / React Native / Expo
- **react-doctor** — ver [`react-doctor.md`](react-doctor.md) (state/effects, performance, bundle,
  seguridad, a11y; auto-detecta el framework).

### Vue / Nuxt
- **vue-mess-detector** — code smells y violaciones de buenas prácticas en Vue/Nuxt.
  ```bash
  npx vue-mess-detector analyze ./src
  ```
- Complementa con eslint-plugin-vue.

### Svelte / SvelteKit
- **svelte-check** — errores de tipos y accesibilidad en componentes `.svelte`.
  ```bash
  npx svelte-check --tsconfig ./tsconfig.json
  ```
- Complementa con eslint-plugin-svelte.

### Angular
- **angular-eslint** — `ng lint` con reglas específicas de Angular.

### Python
- **Ruff** — lint + format ultrarrápido (reemplaza flake8/isort/black).
  ```bash
  ruff check . && ruff format --check .
  ```
- **mypy** — tipado estático: `mypy .`
- **Bandit** — seguridad (patrones inseguros): `bandit -r .` → [`../rules/04-security.md`](../rules/04-security.md).
- **vulture** — código muerto: `vulture .`
- **pip-audit** — dependencias vulnerables: `pip-audit`

### Go
- **golangci-lint** — meta-linter (incluye staticcheck, govet, errcheck…): `golangci-lint run`
- **gosec** — seguridad: `gosec ./...`

---

## 4. Cross-cutting

### Accesibilidad (web)
Respalda el perfil [`../profiles/web-fullstack.md`](../profiles/web-fullstack.md).
- **axe** (`@axe-core/cli`), **pa11y**, o **Lighthouse CI** en el pipeline.

### Dead code / dependencias sin usar
- JS/TS: **knip** · Python: **vulture** · genérico: revisar reporte del auditor del stack.

### Plataformas integrales (opcional, para equipos/CI maduros)
- **SonarQube / SonarCloud** o **Qlty** (ex Code Climate): dashboard de calidad, cobertura, duplicación
  y deuda técnica con histórico. Útiles en proyectos grandes; opcionales para proyectos personales.

---

## 5. Cómo encaja con el estándar

| Auditor detecta | Regla del estándar | Verificable |
|---|---|---|
| Vulnerabilidad / secreto (Semgrep, gitleaks, Bandit, gosec) | [`rules/04-security`](../rules/04-security.md) | DoD · Seguridad |
| Problema de performance / bundle (react-doctor, size-limit) | [`rules/05-performance`](../rules/05-performance.md) | DoD · Performance |
| Código muerto / deps sin usar (knip, vulture) | KISS/DRY ([`rules/00`](../rules/00-core-principles.md)) | DoD · Simplicidad |
| Falta de a11y (axe, svelte-check) | [`profiles/web-fullstack`](../profiles/web-fullstack.md) | DoD · perfil web |
| Smell / mala práctica (vue-mess-detector, eslint) | [`rules/01-code-style`](../rules/01-code-style.md) | DoD · Calidad |

**Integración:** corre el auditor del stack + el baseline en **CI** (cada PR) y en **pre-commit** lo
más barato (ver [`../rules/09-git-docs.md`](../rules/09-git-docs.md)). Al arreglar findings, **diff
mínimo** ([`../rules/11-scope-discipline.md`](../rules/11-scope-discipline.md)).
