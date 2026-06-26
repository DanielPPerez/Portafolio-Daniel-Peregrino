---
description: Recorre el Definition of Done e informa qué casillas faltan
---

# /check-done — auto-revisión de los verificables

Eres un revisor senior. Tu trabajo es verificar el estado del proyecto contra el **Definition of
Done** y reportar, con evidencia, qué está cumplido y qué falta. **No marques una casilla sin
comprobarla en el código/repo.** No arregles nada en este paso: solo reporta.

## Pasos

1. Lee `_project-standard/checklists/definition-of-done.md` y el perfil activo en
   `_project-standard/profiles/` (según `context/AI_CONTEXT.md`). Aplica también los verificables
   extra del perfil.

2. Para cada casilla, **comprueba** en el repo. Pistas de verificación:
   - **Lint/format/tipos/tests/CI:** corre los scripts del proyecto (`npm run lint`, `test`, `typecheck`,
     `build`) o revisa la config de CI. Reporta el resultado real, no asumas.
   - **Secretos:** confirma `.env` en `.gitignore`, que exista `.env.example`, y busca claves
     hardcodeadas (`grep -rniE "api[_-]?key|secret|password|token\s*=" src/`).
   - **Estilo:** revisa funciones nuevas (1 línea de doc, tags `@sensitive`/`@param-critico`/`@sideffect`).
   - **Validación:** busca esquemas (Zod/Pydantic) en las fronteras; busca `catch` vacíos
     (`grep -rn "catch" src/` y revisa).
   - **i18n:** busca texto visible hardcodeado en la UI (literales en JSX/templates sin pasar por `t(...)`).
   - **Performance:** listados con paginación; (web) filtros en la URL; ausencia de N+1 evidente.
   - **Arquitectura:** la lógica de negocio depende de interfaces/puertos, no de clientes de BD; API versionada.
   - **Docs/continuidad:** README con setup; `AI_CONTEXT.md`, `PROGRESS.md`, `DECISIONS.md` al día.

3. Aplica una auto-auditoría de over-engineering (estilo `/ponytail-review`): ¿hay abstracciones o
   dependencias innecesarias? Anótalo.

## Salida (formato del reporte)

```
RESUMEN: X/Y casillas cumplidas · Z bloqueantes

✅ CUMPLE
- <casilla> — <evidencia: archivo/comando/resultado>

❌ FALTA (bloqueante en rigor estricto)
- <casilla> — <qué falta exactamente y dónde> → <acción sugerida>

⚠️ DUDOSO / N/A
- <casilla> — <por qué no se pudo verificar o por qué no aplica>

SIGUIENTE PASO RECOMENDADO: <la acción de mayor impacto>
```

Sé concreto: cada "FALTA" debe decir **dónde** y **qué hacer**. Si todo cumple, dilo claramente y
recuerda actualizar `PROGRESS.md`.

---

## Versión portable (IA sin slash commands)

En Claude.ai, ChatGPT u otra IA web, pega este archivo completo + el output de
`npx repomix --compress` y pide: *"Ejecuta este check-done sobre el proyecto y dame el reporte en el
formato indicado."* Funciona igual sin necesidad del comando nativo.
