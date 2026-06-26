# knowledge/ — base de conocimiento del proyecto

Aquí vive el conocimiento del proyecto en **Markdown legible por cualquier IA**: documentación del
cliente, requisitos, transcripciones de videos, notas de reuniones, etc. Convertido con
[`../skills/markitdown.md`](../skills/markitdown.md).

---

## Cómo funciona

```
knowledge/
├─ inbox/          ← deja aquí los archivos crudos (PDF, DOCX, XLSX, PPTX, imágenes, audio)
└─ *.md            ← aquí van los documentos convertidos a Markdown (legibles por la IA)
```

### Ingestar un archivo
1. Copia el archivo a [`inbox/`](inbox/).
2. Conviértelo a `.md` con markitdown:
   ```bash
   uvx markitdown knowledge/inbox/manual-cliente.pdf -o knowledge/manual-cliente.pdf.md
   ```
3. (Opcional) Borra el crudo del `inbox/` si ya no lo necesitas versionar.

### Ingestar un enlace de YouTube u otra URL
Pega la URL en el chat y pide a la IA:
> "Convierte esta URL con markitdown y guárdala en `knowledge/`."

(Requiere el servidor MCP de markitdown — ver [`../skills/markitdown.md`](../skills/markitdown.md).)

---

## Reglas

- **Nombra** el `.md` con su origen: `requisitos.pdf.md`, `charla-arquitectura.youtube.md`.
- **Revisa** OCR y transcripciones antes de tratarlos como verdad (pueden traer errores).
- **Enlaza** las fuentes importantes desde [`../context/AI_CONTEXT.md`](../context/AI_CONTEXT.md).
- **No metas** datos sensibles que no quieras versionar (ver [`../rules/04-security.md`](../rules/04-security.md)).
- Lo que pongas aquí viaja dentro del paquete de [`repomix`](../skills/repomix.md) al pasar el repo a una IA web.
