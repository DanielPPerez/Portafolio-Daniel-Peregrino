# EXTERNAL_STANDARD — estándar externo / de la empresa

> **Template.** Rellénalo **solo si** te unes a un proyecto/empresa con su propio estándar. Si está
> vacío, no hay estándar externo y aplica solo `_project-standard/`.
>
> **Precedencia:** el estándar externo **gana** sobre el mío; el mío complementa donde el externo no
> diga nada. Detalle en [`../rules/12-standards-interop.md`](../rules/12-standards-interop.md).

---

## ¿Hay estándar externo?
- **Activo:** `no`  *(cámbialo a `sí` cuando apliques uno)*

## Fuentes del estándar externo
Dónde vive el estándar de la empresa/proyecto (enlaza o resume):

| Fuente | Ubicación / enlace |
|---|---|
| Guía de contribución | <CONTRIBUTING.md / wiki / url> |
| Guía de estilo | <STYLEGUIDE / configs de lint-format> |
| Convención de ramas/commits | <...> |
| Plantilla de PR / proceso de review | <...> |
| Arquitectura / decisiones | <...> |
| Otros | <...> |

## Herramientas a adoptar (las suyas, no las mías)
- Linter / formatter: <p. ej. su ESLint+Prettier config>
- Tests / cobertura: <...>
- CI / checks obligatorios: <...>
- Gestión de ramas / merge: <...>

## Tabla de precedencia / conflictos
Cuando una regla de la empresa difiere de una de mi estándar, anótala aquí. **Gana la externa.**

| Tema | Mi estándar dice | La empresa dice | Aplica | Nota / ADR |
|---|---|---|---|---|
| Idioma de comentarios | español | <p. ej. inglés> | empresa | ADR-00X |
| Naming / estilo | <...> | <...> | empresa | |
| Ramas / commits | Conventional Commits | <...> | <...> | |
| <tema> | <...> | <...> | <...> | |

## Reglas mías que SÍ se mantienen
(las que el externo no contradice — valores universales)
- Validar entrada en frontera · no filtrar secretos · manejar errores · no romper código ajeno ·
  testear casos límite · diff mínimo. <ajusta si el externo dice otra cosa>

## Notas
- Conflictos relevantes → registrarlos también como ADR en [`DECISIONS.md`](DECISIONS.md).
- Ante la duda, pregunta al equipo antes de asumir.
