# Prompt de arranque (día 1) — pegar a CUALQUIER IA

> Copia el bloque de abajo y pégalo a la IA con la que empieces (Claude Code, Claude.ai, ChatGPT,
> Cursor, OpenCode, etc.). Funciona con o sin acceso a archivos: si la IA no puede leer la carpeta,
> primero pásale el output de `repomix` (ver [`../skills/repomix.md`](../skills/repomix.md)).

---

```
Vas a trabajar en este proyecto siguiendo mi estándar de calidad senior. Antes de escribir una
sola línea, haz esto EN ORDEN:

1. Lee `_project-standard/START_HERE.md` y, si ya existe, `_project-standard/context/AI_CONTEXT.md`.
   Si AI_CONTEXT no existe todavía, hazme el cuestionario de START_HERE y créalo.

2. Lee TODAS las reglas en `_project-standard/rules/`. Son la fuente de verdad y NO son negociables:
   - Código 100% en inglés. Comentarios/docstrings en español (toggle definido en code-style).
   - Una sola línea de descripción por función. Cero comentarios obvios. Tags @sensitive,
     @param-critico, @sideffect, @todo dentro del cuerpo.
   - Validación en frontera, errores tipados con formato único, nunca tragar excepciones.
   - Seguridad: secretos en .env (nunca en código), sanitización, rate limiting, mínimo privilegio.
   - i18n obligatorio: NUNCA texto hardcodeado en UI.
   - Programar para el cambio: lógica de negocio detrás de interfaces, datos detrás de adaptadores,
     API versionada. Debe poderse migrar BD o capas sin romper el resto.
   - Testea los casos límite, no solo el camino feliz: intuye y documenta casos de uso y bordes
     (vacío, null, máximos, concurrencia, errores) y escribe tests para ellos.
   - Disciplina de alcance: haz el diff mínimo, no toques ni rompas código que no te toca, no
     reformatees de más, no borres lo que no entiendes. Si el alcance crece, avísame antes.

3. PRECEDENCIA: si existe `_project-standard/context/EXTERNAL_STANDARD.md` activo, el estándar de la
   empresa GANA sobre el mío; el mío solo complementa donde el externo no diga nada.

4. Lee el perfil de mi tipo de proyecto en `_project-standard/profiles/` y la arquitectura elegida
   en `_project-standard/context/DECISIONS.md` (ADR-0001). Respeta esa arquitectura.

5. Lee las skills en `_project-standard/skills/` (comment-style y ponytail siempre; repomix para
   handoff; markitdown para ingestar docs/PDF/YouTube a `knowledge/`; react-doctor solo si es
   React/Next). Si existe `_project-standard/knowledge/`, lee sus `.md` como fuentes del proyecto.

Reglas de trabajo:
- Aplica la filosofía ponytail: antes de escribir código pregunta si hace falta, si lo resuelve la
  stdlib o una dependencia ya instalada, si cabe en una línea. NUNCA recortes en validación,
  manejo de errores, seguridad ni accesibilidad.
- Antes de dar algo por terminado, recorre `_project-standard/checklists/definition-of-done.md`
  y dime qué casillas faltan.
- Al cerrar la sesión, actualiza `_project-standard/context/PROGRESS.md` (qué hiciste, qué falta,
  qué decidimos) y registra decisiones de arquitectura como ADR en DECISIONS.md.

Si algo del estándar choca con una restricción real del proyecto, NO lo ignores en silencio:
proponme una excepción y regístrala en DECISIONS.md.

Confirma que leíste todo y resume en 5 líneas el estado actual antes de empezar.
```

---

## Variante corta (IA web con poco contexto)

Si la ventana de contexto es chica, pega solo esto + el output de `repomix --compress`:

```
Sigue el estándar de _project-standard. Reglas innegociables: código en inglés, comentarios en
español, función = 1 línea de doc, validación en frontera, errores tipados, secretos en .env,
i18n sin hardcode, lógica de negocio desacoplada de la BD (poder migrar sin romper). Aplica
ponytail (mínimo código necesario, sin recortar seguridad/validación/errores). Antes de terminar,
revisa el Definition of Done. Resume el estado en 5 líneas y dime qué falta.
```
