# SYNC — proyectar las reglas a cada herramienta

> **Una sola fuente de verdad:** las reglas viven en [`../rules/`](../rules/). Nunca edites las copias
> generadas; edita `rules/` y vuelve a sincronizar. Así no mantienes 4 versiones que divergen.

---

## Uso (automático, con Node)

Desde la raíz del proyecto:

```bash
node _project-standard/sync/sync-rules.mjs
```

Genera/actualiza en la raíz del proyecto:

| Destino | Herramienta |
|---|---|
| `CLAUDE.md` | Claude Code |
| `.claude/commands/check-done.md` | Comando `/check-done` de Claude Code |
| `.cursor/rules/*.mdc` | Cursor (una regla por archivo, `alwaysApply: true`) |
| `.windsurf/rules/project-standard.md` | Windsurf |
| `AGENTS.md` | OpenCode / Cline / Claude.ai / ChatGPT y cualquier IA web o local |

El script no tiene dependencias (solo Node nativo). Re-córrelo cada vez que cambies una regla.

> Sugerencia: añade un script en tu `package.json`:
> `"sync:rules": "node _project-standard/sync/sync-rules.mjs"` → `npm run sync:rules`.

---

## Fallback manual (proyectos sin Node)

Si el proyecto no usa Node (p. ej. Python/CLI puro) y no quieres instalarlo, sincroniza a mano:

1. **Claude Code / IA web:** copia el contenido de todos los archivos de [`../rules/`](../rules/) a un
   `CLAUDE.md` (o `AGENTS.md`) en la raíz, en orden (`00` → `09`). O simplemente apunta a la carpeta:
   crea un `CLAUDE.md` con una línea: *"Lee y respeta todas las reglas en `_project-standard/rules/`,
   el perfil en `_project-standard/profiles/` y `_project-standard/context/`."*
2. **Cursor:** crea `.cursor/rules/standard.mdc` con front-matter `alwaysApply: true` y pega las reglas.
3. **Windsurf:** crea `.windsurf/rules/standard.md` con el mismo contenido.
4. **IA web (sin acceso a archivos):** usa `npx repomix` para empaquetar el repo (incluye las reglas)
   y pégalo en el chat junto con el [`prompt de arranque`](../prompts/00-bootstrap-prompt.md).

> El fallback más simple y robusto: un `CLAUDE.md`/`AGENTS.md` de **una línea** que diga a la IA que
> lea `_project-standard/`. Funciona en cualquier herramienta con acceso al repo, sin generar copias.

---

## Regla de oro del sync

- ✅ Editar reglas → solo en `_project-standard/rules/`.
- ✅ Tras editar → `node _project-standard/sync/sync-rules.mjs`.
- ❌ Nunca editar `CLAUDE.md`, `.cursor/rules/*`, `.windsurf/rules/*` ni `AGENTS.md` a mano (se sobrescriben).
