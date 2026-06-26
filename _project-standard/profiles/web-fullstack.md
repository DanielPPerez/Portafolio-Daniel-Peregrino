# Perfil: Web full-stack

> Las reglas de [`../rules/`](../rules/) aplican **todas**. Este perfil solo dice **qué pesa más** y
> añade lo específico de web. Arquitectura sugerida: ver [`../architecture/decision-guide.md`](../architecture/decision-guide.md).

---

## Énfasis de reglas

| Regla | Por qué pesa aquí |
|---|---|
| [`05-performance`](../rules/05-performance.md) | Estado de filtros en la URL, paginación, lazy loading, Web Vitals. |
| [`07-i18n`](../rules/07-i18n.md) | UI con texto visible → cero hardcode, formato de fecha/moneda por locale. |
| [`03-errors-validation`](../rules/03-errors-validation.md) | Validar en cliente (UX) **y** en servidor (verdad). |
| [`04-security`](../rules/04-security.md) | XSS, CSRF, CORS, headers, auth de sesión/JWT. |

## Específico de frontend

- **Estados de cada vista que pide datos:** loading, error, vacío y éxito. Nunca una pantalla en blanco.
- **Accesibilidad (a11y):** HTML semántico, roles ARIA donde aplique, navegación por teclado, contraste,
  `alt` en imágenes, foco visible. Es parte del Definition of Done, no opcional.
- **Estado en la URL:** filtros, orden, paginación y búsqueda en query params (ver `05-performance`).
- **Formularios:** validación con el mismo esquema que el backend si es posible; mensajes traducibles.
- **Rendimiento percibido:** code splitting por ruta, optimización de imágenes, evitar re-renders.
- **SEO** (si es público): metadatos, SSR/SSG donde aplique, URLs limpias.

## Específico de backend (el lado server del full-stack)

- API versionada (`/v1`), contrato compartido con el frontend (OpenAPI/types generados).
- Reglas de negocio en el dominio, no en los componentes ni en los controladores
  (ver [`02-business-rules`](../rules/02-business-rules.md)).

## Tooling obligatorio (rigor estricto)

- TypeScript en `strict`. ESLint + Prettier. Tests (unit + algún e2e de flujos críticos).
- Git hooks (lint+format+test en pre-commit), CI en cada push.
- i18n configurado desde el primer componente.
- **Si es React/Next:** corre [`react-doctor`](../skills/react-doctor.md) (`npx react-doctor@latest`)
  para auditar state/effects, performance, bundle, seguridad y a11y; intégralo en CI. Complementa a
  ponytail y a [`rules/05-performance`](../rules/05-performance.md).

## Auditores recomendados → [`skills/auditors.md`](../skills/auditors.md)
- Baseline obligatorio: **Semgrep** + **gitleaks**.
- Stack JS/TS: **knip** (código/deps sin usar) + auditor del framework (react-doctor para React/Next;
  vue-mess-detector / svelte-check / angular-eslint según el caso).
- Accesibilidad: **axe / pa11y / Lighthouse** en CI.

## Verificables extra del perfil

- [ ] Cada vista con datos tiene estados loading/error/empty/success.
- [ ] a11y: semántica, teclado, contraste, foco, alt.
- [ ] Filtros/orden/paginación reflejados en la URL.
- [ ] Validación en cliente y servidor; reglas de negocio en el servidor.
- [ ] API versionada con contrato compartido.
