# Skill: repomix — empaquetar el repo para una IA

> **Qué es:** una herramienta que empaqueta TODO el repositorio en **un solo archivo AI-friendly**
> (XML/Markdown/JSON). Es el mecanismo central de **continuidad entre IAs**: corres repomix y pegas
> el resultado en Claude.ai, ChatGPT, o cualquier IA web/local que no tenga acceso a tus archivos.
>
> Repo oficial: https://github.com/yamadashy/repomix · No requiere instalar (corre con `npx`).

---

## Cuándo usarlo

- Se acaba la suscripción de Claude Code y vas a seguir en una IA web → empaqueta y pega.
- Recuperas la suscripción y quieres que el agente vea el estado actual del código → empaqueta.
- Quieres una segunda opinión de otra IA sobre todo el proyecto.
- Antes de un handoff (ver [`../prompts/01-resume-prompt.md`](../prompts/01-resume-prompt.md)).

## Comandos esenciales

```bash
# Empaquetar el directorio actual (genera repomix-output.* en la raíz)
npx repomix

# Comprimido (~70% menos tokens con tree-sitter: manda la estructura, no todo el detalle)
npx repomix --compress

# En Markdown (legible para pegar en un chat)
npx repomix --style markdown

# Un repo remoto sin clonarlo
npx repomix --remote usuario/repo

# Re-empaqueta automáticamente al cambiar archivos
npx repomix --watch
```

Combinación típica para handoff: `npx repomix --compress --style markdown`.

## Por qué encaja en este estándar

- **Token counting:** te dice cuántos tokens ocupa, para saber si cabe en la ventana de la IA gratis.
- **Compresión:** con `--compress` mandas la estructura del código, no cada línea → cabe más proyecto.
- **Secretlint integrado:** detecta secretos antes de empaquetar → **no filtras API keys/passwords**
  al pegar el repo en una web. Refuerza [`../rules/04-security.md`](../rules/04-security.md).
- **Respeta `.gitignore`:** no incluye `node_modules`, `.env`, build, etc.

## Configuración (opcional)

Crea `repomix.config.json` en la raíz para fijar estilo, exclusiones y compresión por defecto:

```json
{
  "output": { "style": "markdown", "compress": true },
  "ignore": { "customPatterns": ["docs/**", "*.lock"] }
}
```

Usa `.repomixignore` (como `.gitignore`) para excluir archivos extra del paquete.

## Flujo recomendado de handoff

1. `npx repomix --compress --style markdown`
2. Verifica que el reporte de secretlint salió limpio (si marca algo, revísalo antes de compartir).
3. Pega el archivo generado + [`../prompts/01-resume-prompt.md`](../prompts/01-resume-prompt.md) en la IA.
4. La IA lee el estado y continúa respetando el estándar.
