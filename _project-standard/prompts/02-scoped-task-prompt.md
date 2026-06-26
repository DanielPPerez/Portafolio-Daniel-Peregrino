# Prompt de tarea acotada — fix puntual / unirse a un proyecto a medias

> Úsalo cuando NO arrancas un proyecto desde cero, sino que entras a uno existente a **corregir un
> bug**, **actualizar una función**, o hacer un **cambio puntual** del que quizá no conoces todo el
> contexto. Su objetivo: que la IA entienda y **confirme el alcance** antes de tocar nada, y que **no
> rompa ni modifique** lo que no le corresponde.
>
> Implementa [`../rules/11-scope-discipline.md`](../rules/11-scope-discipline.md) y
> [`../rules/13-junior-guardrails.md`](../rules/13-junior-guardrails.md).

---

## Cómo usarlo

Reemplaza `<...>` con lo que sepas (aunque sea poco) y pega el bloque a la IA. Si la IA no tiene
acceso al repo, adjunta antes el output de `npx repomix --compress` (ver [`../skills/repomix.md`](../skills/repomix.md)).

```
Me asignaron una tarea ACOTADA en un proyecto existente. NO empieces a cambiar código todavía.

Lo que me pidieron (puede estar incompleto): <describe el bug / la función a actualizar / el cambio>
Lo que me dijeron que es MI parte: <archivos, módulo, ticket, o "no estoy seguro">
Lo que NO debo tocar: <lo que sepas, o "confírmamelo tú">

Haz esto en orden, sin escribir código de producción aún:

1. CONTEXTO: lee `_project-standard/context/AI_CONTEXT.md`, las reglas en `_project-standard/rules/`
   (sobre todo 11-scope-discipline y 13-junior-guardrails), y si existe
   `_project-standard/context/EXTERNAL_STANDARD.md`, respétalo POR ENCIMA de mi estándar.

2. ENTENDER: explora el código relevante. Si es un bug, REPRODÚCELO o explícame cómo reproducirlo, e
   identifica la CAUSA RAÍZ (no el síntoma). Si es actualizar una función, dime quién la usa (quién
   depende de ella) para no romper a nadie.

3. INFERIR Y CONFIRMAR EL ALCANCE — antes de tocar nada, dame un resumen corto:
   - Qué voy a cambiar exactamente y por qué.
   - Qué ARCHIVOS/funciones tocaré (lista) y cuáles explícitamente NO.
   - Qué riesgos hay de romper algo y cómo lo evito.
   - Cómo verificaré que funciona y que no rompí lo demás (qué tests correr).
   Si algo es ambiguo, PREGÚNTAME. Espera mi OK antes de continuar (salvo que sea trivial e inequívoco).

4. EJECUTAR (solo tras mi confirmación):
   - Corre los tests existentes ANTES para saber el estado de partida.
   - Haz el DIFF MÍNIMO: solo lo acordado. No reformatees archivos, no refactorices de más, no
     cambies contratos públicos sin avisar, no toques deps/config/CI salvo que la tarea lo pida.
   - Si descubres que el arreglo correcto exige salir del alcance, PARA y propónmelo; no lo hagas solo.
   - Añade/ajusta tests para el cambio y para el caso límite que causó el bug (test de regresión).
   - Corre los tests DESPUÉS y confírmame que todo sigue verde.

5. CERRAR: resume qué cambiaste (y qué dejaste fuera a propósito), y actualiza
   `_project-standard/context/PROGRESS.md`. Anota como propuesta (no aplicada) cualquier mejora que
   viste fuera de mi alcance.

Reglas innegociables: diff mínimo, no romper lo ajeno, valla de Chesterton (no borres lo que no
entiendes), estándar externo por encima del mío. Empieza por el paso 1 y 2 y dame el resumen del paso 3.
```

---

## Variante ultra-corta

```
Tarea acotada en proyecto existente. Antes de tocar código: entiende el problema, reproduce la causa
raíz, y dame el alcance (qué tocas, qué NO, cómo verificas) para que lo confirme. Luego haz el diff
mínimo sin romper lo ajeno ni cambiar contratos públicos. Tests antes y después. Respeta el estándar
externo si existe. No expandas el alcance sin avisar.
```
