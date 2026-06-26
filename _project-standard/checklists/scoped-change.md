# Checklist de cambio acotado (scoped change)

> Recórrela en **fixes puntuales** o cuando trabajas en un proyecto ajeno/a medias. Complementa el
> [`Definition of Done`](definition-of-done.md) con el foco en **no romper ni invadir** lo que no te
> toca. Respalda: [`../rules/11-scope-discipline.md`](../rules/11-scope-discipline.md).

---

## Antes de tocar código
- [ ] Entendí qué se pide y qué **no** entra en el alcance.
- [ ] Si es bug: lo reproduje e identifiqué la **causa raíz** (no el síntoma).
- [ ] Sé **quién depende** del código que voy a cambiar (contratos públicos, llamadores).
- [ ] Resumí el alcance (qué toco / qué NO / cómo verifico) y lo **confirmé**.
- [ ] Corrí los tests existentes para conocer el estado de partida.

## Durante el cambio
- [ ] El diff toca **solo** lo acordado.
- [ ] No reformateé archivos enteros ni metí cambios de estilo no pedidos.
- [ ] No hice refactors fuera de alcance (los dejé como propuesta).
- [ ] No cambié contratos públicos (firmas, API, formatos) sin versionar y avisar.
- [ ] No toqué deps, config, migraciones ni CI salvo que la tarea lo pidiera.
- [ ] No borré código que no entiendo (valla de Chesterton: investigué o pregunté).
- [ ] Respeté el estándar externo si existe (gana sobre el mío).

## Después del cambio
- [ ] Añadí test de regresión del bug / casos límite afectados.
- [ ] Los tests pasaban antes y **siguen pasando** después.
- [ ] El commit no lleva secretos, logs de debug ni código comentado.
- [ ] El cambio es pequeño y revisable.
- [ ] Resumí qué cambié y qué dejé fuera a propósito; actualicé `PROGRESS.md`.
- [ ] Las mejoras fuera de alcance quedaron **propuestas, no aplicadas**.
