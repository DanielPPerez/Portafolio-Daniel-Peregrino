# 06 · Observabilidad (logging, qué NO loguear)

> **Siempre activa.** Un proyecto serio se puede diagnosticar en producción sin adivinar.

---

## Logging estructurado

- Loguea en **JSON estructurado**, no strings sueltos. Facilita filtrar y buscar.
- Cada log lleva contexto: `timestamp`, `level`, `op`/evento, y un **id de correlación** (request id)
  que atraviesa toda la operación.
- Usa una librería de logging (pino, winston, structlog, zerolog), no `print`/`console.log` sueltos.

```ts
logger.info({ reqId, op: 'reservation.create', guestId, partySize }, 'reservation created')
```

## Niveles

| Nivel | Para qué |
|---|---|
| `error` | Algo falló y requiere atención (errores inesperados, fallos de infra). |
| `warn`  | Algo anómalo pero manejado (reintento, degradación, input raro). |
| `info`  | Hitos de negocio (usuario creado, pago confirmado). |
| `debug` | Detalle para desarrollo; apagado en producción. |

- Nivel configurable por entorno (env var). En producción normalmente `info`+.

## Qué NO loguear

- **Nunca** passwords, tokens, API keys, números de tarjeta, ni PII sin necesidad.
- Marca esos puntos con `@sensitive` (ver [`01-code-style.md`](01-code-style.md)).
- Si necesitas referir a un dato sensible, loguea un identificador o un valor enmascarado
  (`****1234`), no el dato.

## Errores

- Los errores inesperados se loguean con **stack y contexto** en el handler central
  (ver [`03-errors-validation.md`](03-errors-validation.md)). No los loguees y además los relances
  en cada capa (ruido duplicado): loguea una vez, en el borde.

## Métricas y trazas (según escala)

- **Health check** (`/health`) que verifique dependencias críticas.
- Métricas básicas: latencia, throughput, tasa de error (RED), uso de recursos.
- En sistemas distribuidos, **tracing** con id de correlación propagado entre servicios.
- Configura **alertas** sobre las métricas que importan, no sobre todo.

---

## Verificables

- [ ] Logs en formato estructurado con id de correlación.
- [ ] Niveles usados correctamente y configurables por entorno.
- [ ] No se loguean secretos ni PII; los puntos sensibles están marcados.
- [ ] Los errores inesperados se loguean una vez, con stack y contexto.
- [ ] Existe health check; hay métricas básicas de latencia/errores donde aplica.
