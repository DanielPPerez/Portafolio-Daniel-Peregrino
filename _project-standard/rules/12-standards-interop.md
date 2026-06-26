# 12 · Interoperabilidad de estándares

> **Siempre activa.** Este estándar es tuyo, pero no vive solo. Cuando entras a una empresa o proyecto
> con su **propio** estándar, ese gana. Este se vuelve **complementario**: rellena lo que el otro no
> diga, nunca lo contradice.

---

## Orden de precedencia (de mayor a menor)

Cuando dos fuentes digan cosas distintas, gana la de **más arriba**:

1. **Instrucción directa** del lead/equipo para la tarea actual.
2. **Estándar externo / de la empresa** — registrado en
   [`../context/EXTERNAL_STANDARD.md`](../context/EXTERNAL_STANDARD.md).
3. **Este estándar** (`_project-standard/rules/`).
4. **Defaults** de la herramienta/lenguaje.

> Regla de oro: **este estándar nunca se impone sobre el de la empresa.** Si chocan, la empresa manda
> y se documenta la diferencia.

## Cómo complementa (no contradice)

- Donde el estándar externo **define** algo (estilo, naming, ramas, commits, arquitectura) → se sigue
  el externo, aunque difiera de este.
- Donde el estándar externo **no dice nada** → aplican estas reglas para llenar el hueco.
- Los **valores universales** de este estándar (validar entrada, no filtrar secretos, manejar errores,
  no romper lo ajeno) se mantienen salvo que el externo los contradiga explícitamente — y eso sería raro.

## Al unirte a un proyecto con estándar externo

1. **Localiza** su estándar: `CONTRIBUTING.md`, `STYLEGUIDE`, `.editorconfig`, configs de lint/format,
   plantillas de PR, wiki interna, o pregunta al equipo.
2. **Regístralo** en [`../context/EXTERNAL_STANDARD.md`](../context/EXTERNAL_STANDARD.md): resumen,
   enlaces, y la tabla de precedencia/conflictos.
3. **Adopta** sus herramientas tal cual (su ESLint/Prettier/CI), no impongas las tuyas.
4. **Replica sus patrones** existentes en el código (ver [`11-scope-discipline`](11-scope-discipline.md)).

## Conflictos → ADR

Cuando una regla de la empresa contradiga una de aquí, **no la ignores en silencio**: anótala en la
tabla de `EXTERNAL_STANDARD.md` y, si es relevante, como ADR en
[`../context/DECISIONS.md`](../context/DECISIONS.md), indicando que se sigue la externa. Así queda claro
para cualquier IA futura por qué este proyecto se desvía del estándar base.

---

## Verificables

- [ ] Si existe estándar externo, está registrado en `EXTERNAL_STANDARD.md` con enlaces.
- [ ] Se usan las herramientas (lint/format/CI) del proyecto externo, no las propias impuestas.
- [ ] El código nuevo replica los patrones existentes del repo.
- [ ] Los conflictos entre estándares están documentados; gana el externo.
- [ ] No se impuso ninguna regla de este estándar por encima de una de la empresa.
