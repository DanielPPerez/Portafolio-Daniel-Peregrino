# Guía: cómo hacer un cambio grande sin romper

> Para migrar BD (NoSQL↔SQL), renombrar/eliminar campos, cambiar un contrato de API en uso, o
> reemplazar una capa. Implementa el principio de [`../rules/08-architecture-change.md`](../rules/08-architecture-change.md).
> **Regla madre:** nunca en un solo golpe. Siempre **expand → migrate → contract**.

---

## El patrón en 3 fases

### 1. Expand (añadir lo nuevo, sin quitar lo viejo)
- Crea la nueva estructura **conviviendo** con la actual: nueva columna/tabla/colección/endpoint, o
  campo nuevo **opcional**.
- Si es dato: **dual write** — escribe en lo viejo y lo nuevo a la vez.
- Nada se rompe porque lo viejo sigue intacto.

### 2. Migrate (mover datos y consumidores, gradual)
- Backfill: copia/transforma los datos existentes al nuevo formato (en lotes, idempotente, reanudable).
- Cambia los lectores para que usen lo nuevo, uno a uno.
- **Verifica paridad:** lo nuevo devuelve lo mismo que lo viejo (compara en sombra/`shadow read`).

### 3. Contract (eliminar lo viejo)
- Cuando **nadie** usa lo viejo (confírmalo con logs/métricas), elimínalo.
- Quita el dual write, borra la estructura antigua, limpia el código.

---

## Caso concreto: migrar de NoSQL (Mongo) a SQL (Postgres)

Posible **solo si** la lógica de negocio ya está detrás de un puerto `XRepository`
(ver [`../rules/08`](../rules/08-architecture-change.md)). Si no lo está, ese es el primer paso.

1. **Expand:** crea `SqlXRepository` implementando el mismo puerto que `MongoXRepository`. Levanta Postgres.
2. **Dual write:** un `CompositeXRepository` escribe en ambos; lee de Mongo (fuente de verdad por ahora).
3. **Backfill:** migra datos históricos de Mongo a Postgres en lotes idempotentes.
4. **Shadow read:** lee de ambos y compara; loguea diferencias hasta llegar a paridad.
5. **Switch:** cambia la fuente de verdad de lectura a Postgres. La lógica de negocio **no cambia ni una línea**.
6. **Contract:** apaga el dual write, retira `MongoXRepository`, desmonta Mongo.

Cada paso es desplegable y reversible por separado.

---

## Caso: cambiar un contrato de API que ya usan clientes
- Nunca edites `/v1` de forma incompatible. Crea `/v2` con el cambio.
- Mantén `/v1` funcionando; comunica deprecación con fecha.
- Cuando las métricas muestren 0 tráfico en `/v1`, retíralo.

---

## Reglas transversales del cambio grande
- [ ] Cada fase es **desplegable y reversible** por sí sola.
- [ ] Hay **backup** antes de tocar datos y un **plan de rollback** escrito.
- [ ] Se prueba en **staging** con datos realistas antes de producción.
- [ ] La migración de datos es **idempotente** y **reanudable**.
- [ ] Se mide **paridad** antes de hacer el switch.
- [ ] Todo el cambio se registra como **ADR** en `context/DECISIONS.md`.
- [ ] El feature va detrás de **flag** si conviene activarlo gradualmente.
