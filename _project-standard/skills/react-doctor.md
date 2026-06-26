# Skill: react-doctor — auditoría de salud para React / Next.js

> **Qué es:** una CLI open-source (del equipo de Million.js) que **escanea de forma determinista** un
> proyecto React y reporta problemas en state & effects, performance, arquitectura, bundle size,
> seguridad, correctness y accesibilidad, con un **health score** y lista de issues priorizada.
> Aplica >60 reglas. Funciona en **React, Next.js, Vite, TanStack, React Native, Expo**.
>
> **Condicional:** úsalo SOLO en proyectos React/Next. En otros perfiles, ignóralo.
> Repo oficial: https://github.com/millionco/react-doctor

---

## Cuándo usarlo

- Al **entrar a un proyecto React/Next existente**: corre una auditoría para entender el estado de
  salud antes de tocar nada (encaja con [`../rules/11-scope-discipline.md`](../rules/11-scope-discipline.md)).
- **Periódicamente** durante el desarrollo, como complemento a ponytail (que vigila over-engineering)
  y a las reglas de [`../rules/05-performance.md`](../rules/05-performance.md).
- En **CI**: revisa cada PR y reporta solo los issues que **introduce tu cambio**, no el backlog.

## Comandos esenciales

```bash
# auditar el proyecto (sin instalar nada, sin config)
npx react-doctor@latest

# instalar la skill para tu agente de código (Claude Code, Cursor, Codex, OpenCode, etc.)
# para que aprenda de los issues y los arregle
npx react-doctor@latest install

# sin telemetría
npx react-doctor@latest --no-telemetry
```

- Configuración opcional en `doctor.config.ts`.
- CI vía GitHub Actions (revisa PRs automáticamente).

## Cómo encaja en este estándar (junto a ponytail y repomix)

| Herramienta | Rol |
|---|---|
| **ponytail** | Disciplina de escritura: menos código, anti over-engineering. |
| **repomix** | Transporte de contexto entre IAs. |
| **react-doctor** | Diagnóstico de salud específico de React/Next (lo que las otras no ven). |

Las tres se invocan vía `npx`/CLI, sin acoplarse al código del proyecto. react-doctor además puede
**instalar su propia skill** en tu agente, así que tras `install` el agente sabe arreglar los issues
que detecta.

## Flujo recomendado en proyectos React/Next

1. `npx react-doctor@latest` → obtén el health score y la lista de issues.
2. `npx react-doctor@latest install` → dale la skill al agente.
3. Pide al agente que arregle los issues **respetando el alcance** (no refactors masivos no pedidos,
   ver [`../rules/11-scope-discipline.md`](../rules/11-scope-discipline.md)).
4. Integra react-doctor en CI para que cada PR quede vigilado.
5. Anota en el Definition of Done que la auditoría pasa sin issues críticos.

## Útil en TODOS estos tipos de proyecto React

`npx react-doctor@latest` **auto-detecta el framework**; el mismo comando sirve en todos:

| Tipo de proyecto | Aplica | Nota |
|---|---|---|
| **Next.js** | ✅ | App/Pages router, SSR/RSC. |
| **Vite + React** | ✅ | SPAs. |
| **React Router / TanStack (Start, Router, Query)** | ✅ | Detecta patrones de data/fetching. |
| **Remix** | ✅ | Loaders/actions. |
| **Gatsby** | ✅ | React por debajo. |
| **Astro con islas de React** | ✅ | Analiza los componentes `.tsx`/`.jsx`. |
| **React Native** | ✅ | Reglas de performance/efectos aplican; ignora reglas web-only. |
| **Expo** | ✅ | Igual que RN; el flujo gestionado. |
| **Electron / Tauri con React** | ✅ | En el frontend React. |
| Vue / Svelte / Angular / sin React | ❌ | Usa el [catálogo de auditores](auditors.md). |

> Para lo NO-React, ver [`auditors.md`](auditors.md). react-doctor es solo el especialista React.

## Activación

- En [`../START_HERE.md`](../START_HERE.md): si P2 incluye React/Next (web-fullstack o frontend),
  marca react-doctor como skill activa. En cualquier otro perfil, no aplica.
- Registrado también en [`../profiles/web-fullstack.md`](../profiles/web-fullstack.md) y en el
  [catálogo de auditores](auditors.md).
