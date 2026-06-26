# Skill: markitdown — ingestar documentos y enlaces a Markdown

> **Qué es:** una utilidad de Microsoft que convierte casi cualquier archivo o enlace a **Markdown**
> limpio (preservando headings, listas, tablas, links) para que una IA lo pueda leer. Es la pieza de
> **ingesta de conocimiento** del estándar: metes un PDF/Word/Excel/imagen/audio o una **URL de
> YouTube** y obtienes un `.md` que vive en [`../knowledge/`](../knowledge/).
>
> Repo oficial: https://github.com/microsoft/markitdown · Requiere **Python**.

---

## Para qué lo usa este estándar

- Convertir documentación del cliente (PDF, DOCX, XLSX, PPTX) a `.md` para que la IA la lea y la use
  como fuente de requisitos / reglas de negocio (ver [`../rules/02-business-rules.md`](../rules/02-business-rules.md)).
- Transcribir un **video de YouTube** (tutorial, charla) a texto pegando su URL.
- Extraer texto de imágenes (OCR) o audio (transcripción).
- Dejar todo ese conocimiento versionado en el repo, legible por cualquier IA (de pago o gratis).

## Formatos soportados

PDF · Word (DOCX) · PowerPoint (PPTX) · Excel (XLSX/XLS) · imágenes (EXIF + OCR) · audio
(transcripción) · HTML · **URLs de YouTube** · CSV · JSON · XML · ZIP · EPub.

---

## Opción A — CLI (lo más simple)

Sin instalar nada permanente (recomendado con `uv`):

```bash
# convertir un archivo a markdown
uvx markitdown ruta/al/archivo.pdf -o knowledge/archivo.pdf.md

# o instalándolo
pipx install markitdown        # o: pip install markitdown
markitdown ruta/al/archivo.docx -o knowledge/archivo.docx.md

# desde stdin
cat archivo.pdf | markitdown > knowledge/archivo.md

# con plugins extra
markitdown --use-plugins archivo.pdf
```

> **YouTube:** algunas versiones aceptan la URL directa por CLI; si no, usa la **Opción B (MCP)** que
> sí acepta URLs `http/https` de forma uniforme.

## Opción B — Servidor MCP (para que la IA convierta sola)

Expone una herramienta `convert_to_markdown(uri)` que acepta cualquier URI `http:`, `https:`,
`file:` o `data:` — incluido un enlace de YouTube pegado en el chat.

```bash
pip install markitdown-mcp     # instala el server
markitdown-mcp                 # modo stdio (lo lanza el cliente MCP)
```

Configuración en el cliente MCP (Claude Code / Desktop), opción Docker para aislarlo:

```json
{
  "mcpServers": {
    "markitdown": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "-v", "./knowledge:/workdir", "markitdown-mcp:latest"]
    }
  }
}
```

> Nota de seguridad (del propio proyecto): markitdown-mcp es para **uso local con agentes de
> confianza**. No lo expongas en una interfaz pública.

---

## Flujo de trabajo recomendado

1. **Archivos:** deja el PDF/DOCX/etc. en [`../knowledge/inbox/`](../knowledge/inbox/).
2. Convierte a `.md` en [`../knowledge/`](../knowledge/) con la Opción A o B.
3. **YouTube u otra URL:** pégala en el chat y pide a la IA: *"convierte esta URL con markitdown y
   guárdala en knowledge/"* (Opción B), o córrelo por CLI.
4. Enlaza el `.md` resultante desde `context/AI_CONTEXT.md` si es una fuente importante del proyecto.
5. Si vas a pasar el repo a una IA web, el `.md` ya viaja dentro del paquete de
   [`repomix`](repomix.md) — sin depender de adjuntar el archivo original.

## Buenas prácticas

- Nombra el `.md` con su origen: `manual-cliente.pdf.md`, `charla-arquitectura.youtube.md`.
- Revisa el resultado: OCR y transcripciones pueden traer errores; corrígelos antes de tratarlos como verdad.
- No metas en `knowledge/` documentos con datos sensibles que no quieras versionar (ver [`../rules/04-security.md`](../rules/04-security.md)).
