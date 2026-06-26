# Guía de decisión de arquitectura

> Cruza **tipo de proyecto** + **escala esperada** + **tamaño de equipo** y obtén una recomendación.
> El catálogo de cada patrón está en [`patterns.md`](patterns.md). La elección final se registra como
> **ADR-0001** en [`../context/DECISIONS.md`](../context/DECISIONS.md).

---

## Paso 1 — Matriz rápida

| Tipo de proyecto | Escala baja/MVP | Escala media | Escala alta / multi-equipo |
|---|---|---|---|
| **Web full-stack** | Monolito modular + hexagonal | Monolito modular + caché/cola | Modular → extraer servicios por dominio + event-driven |
| **API / backend** | Monolito modular + hexagonal | + cola para async | Servicios por bounded context + event-driven |
| **CLI / automatización** | Script estructurado por capas | Modular + puertos para I/O | Event-driven / workers si hay volumen |
| **Tráfico intermitente / webhooks** | Serverless | Serverless + cola | Serverless + event-driven |

> **Default si dudas:** **Monolito modular + Hexagonal**. Es el que minimiza el costo de equivocarse:
> simple ahora, fácil de partir después.

## Paso 2 — Ajustes por respuesta del cuestionario

- **¿La BD podría cambiar (NoSQL↔SQL)?** → Hexagonal **obligatorio**: repositorios detrás de puertos
  (ver [`../rules/08-architecture-change.md`](../rules/08-architecture-change.md)).
- **¿Side-effects pesados (emails, reportes, procesamiento)?** → añade una **cola/worker** (event-driven
  parcial) aunque el core siga monolítico.
- **¿Múltiples consumidores externos de la API?** → **contrato versionado** (`/v1`) y OpenAPI como fuente de verdad.
- **¿Tiempo real?** → capa de WebSocket/eventos separada del request-response.
- **¿Equipo de 1–3?** → evita microservicios sí o sí; el overhead te frena más de lo que ayuda.
- **¿Costo/infra mínima y tráfico variable?** → considera **serverless** para el backend.

## Paso 3 — Patrón de evolución (cuándo cambiar)

No elijas pensando en el final; elige el inicio y define el **disparador** de cambio:

| De | A | Disparador (síntoma real, no hipótesis) |
|---|---|---|
| Monolito modular | Extraer un servicio | Un módulo necesita escalar/desplegarse aparte, o un equipo dedicado lo bloquea |
| Síncrono | Cola/event-driven | Requests lentas por trabajo pesado, o picos que tiran el servicio |
| Monolito | + Caché distribuida | Lecturas repetidas caras o varias instancias |
| Serverless | Contenedor/servicio | Cold starts o límites de ejecución te estorban |

Cada cambio se hace con **expand→migrate→contract** y se registra como nuevo ADR.

## Paso 4 — Registrar la decisión (ADR-0001)

Escribe en `DECISIONS.md`:

```markdown
## ADR-0001 — Arquitectura inicial
- Fecha: AAAA-MM-DD
- Contexto: <tipo, escala esperada, equipo, BD, restricciones>
- Decisión: <p. ej. Monolito modular + Hexagonal, BD detrás de puertos>
- Opciones consideradas: <las descartadas y por qué>
- Consecuencias: <qué facilita, qué cuesta>
- Disparador de evolución: <qué síntoma nos haría cambiar y a qué>
```

---

## Anti-decisiones frecuentes (evítalas)

- "Microservicios porque es lo moderno" con un equipo de 2 → complejidad sin beneficio.
- "Ya optimizamos para 1M de usuarios" sin tener 100 → YAGNI.
- Acoplar la lógica a la BD elegida hoy → te ata cuando esa decisión cambie.
