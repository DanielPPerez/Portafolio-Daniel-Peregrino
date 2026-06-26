# Skill: ponytail — "lazy senior" anti over-engineering

> **Qué es:** un ruleset que hace que los agentes de IA escriban **el mínimo código necesario**,
> con la filosofía de un *senior desarrollador perezoso*: el mejor código es el que no escribiste.
> Reduce el código generado un 80–94% **sin recortar** validación, manejo de errores, seguridad ni
> accesibilidad.
>
> Repo oficial: https://github.com/DietrichGebert/ponytail

---

## La filosofía (escalera de decisión antes de escribir código)

1. ¿Esto **necesita existir**?
2. ¿Lo resuelve la **librería estándar**?
3. ¿Hay una **feature nativa** de la plataforma?
4. ¿Lo cubre una **dependencia ya instalada**?
5. ¿Se puede en **una línea**?
6. Solo entonces: escribe el **mínimo** código que funcione.

Encaja directo con KISS, DRY y YAGNI ([`../rules/00-core-principles.md`](../rules/00-core-principles.md)).

## Lo que NUNCA recorta

Validación, manejo de errores, seguridad y accesibilidad. Ponytail evita complejidad **innecesaria**,
no la calidad. Si dudas entre simplicidad y seguridad, gana seguridad
(ver [`../rules/04-security.md`](../rules/04-security.md)).

## Niveles de intensidad

| Nivel | Uso |
|---|---|
| `lite` | Empujón suave hacia la simplicidad. |
| `full` | Equilibrio recomendado para la mayoría de proyectos. |
| `ultra` | Máxima austeridad; útil en prototipos y código muy acotado. |
| `off` | Desactivado. |

Fija el nivel en `AI_CONTEXT.md` (default sugerido: `full`).

## Comandos

- **`/ponytail-review`** — audita un diff buscando over-engineering (abstracciones de más, dependencias
  innecesarias, código que la stdlib ya hace). Úsalo antes de dar por terminado un cambio.
- **`/ponytail-debt`** — rastrea los atajos diferidos (deuda técnica) para que no se pierdan. Lo que
  decidas posponer queda registrado en vez de olvidado.

## Instalación / uso

Ponytail se integra como ruleset/instrucciones en múltiples herramientas: Claude Code, Codex,
GitHub Copilot CLI, OpenCode, Gemini/Antigravity CLI, y editores vía `.cursor/rules/` o
`.windsurf/rules/`. Sigue el README del repo para tu herramienta. En este estándar, su filosofía ya
está embebida en el [`prompt de arranque`](../prompts/00-bootstrap-prompt.md) para que aplique
incluso en IAs donde no instales el plugin.

## Cómo lo usa este estándar

- El bootstrap-prompt instruye a la IA a aplicar la escalera de decisión en cada cambio.
- Antes de marcar el Definition of Done, corre `/ponytail-review` (o pide a la IA una auto-auditoría
  de over-engineering) y registra deuda con `/ponytail-debt`.
