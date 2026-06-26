# Prompt de handoff (retomar el proyecto) — pegar a CUALQUIER IA

> Úsalo cuando una IA distinta (o la misma tras una pausa / cambio de suscripción) tiene que
> **continuar** el proyecto sin perder el hilo. Es el mecanismo central de continuidad entre IAs.

---

## Antes de pegar el prompt

Si la IA no tiene acceso directo a los archivos, genera el paquete del repo y adjúntalo:

```bash
npx repomix --compress --style markdown
```

Esto crea un único archivo con todo el código (comprimido ~70%, con conteo de tokens y secretlint
para no filtrar claves). Ver [`../skills/repomix.md`](../skills/repomix.md).

---

## Prompt

```
Vas a RETOMAR un proyecto en curso. No empieces a programar hasta entender dónde quedó. Haz esto:

1. Lee, en este orden:
   - `_project-standard/context/AI_CONTEXT.md`  → qué es el proyecto y sus decisiones base.
   - `_project-standard/context/PROGRESS.md`    → qué se hizo, qué falta, en qué se quedó.
   - `_project-standard/context/DECISIONS.md`   → decisiones de arquitectura (ADRs) que DEBES respetar.
   - `_project-standard/rules/` y el perfil en `_project-standard/profiles/`.

2. Si adjunté el output de repomix, úsalo como mapa del código actual.

3. Resume en 5–8 líneas: estado actual, última cosa terminada, próximo paso pendiente, y cualquier
   decisión abierta que necesite mi confirmación.

4. NO rehagas lo ya hecho ni cambies decisiones registradas en DECISIONS.md sin proponérmelo antes.

Reglas innegociables (las mismas de siempre): código en inglés, comentarios en español, función =
1 línea de doc, validación en frontera, errores tipados, secretos en .env, i18n sin hardcode,
lógica de negocio desacoplada de la BD. Aplica ponytail. Antes de terminar, revisa el Definition
of Done y actualiza PROGRESS.md.

Cuando termines de leer, dame el resumen y espera mi confirmación del próximo paso.
```

---

## Al cerrar la sesión (recordatorio)

Pide a la IA que actualice [`../context/PROGRESS.md`](../context/PROGRESS.md) con una entrada nueva
y que registre cualquier decisión nueva como ADR en [`../context/DECISIONS.md`](../context/DECISIONS.md).
Así el siguiente handoff —a la IA que sea— arranca limpio.
