# 08 · Arquitectura tolerante al cambio

> **Siempre activa. Pilar central.** "Programar para el cambio con la mínima superficie de error."
> Objetivo: poder migrar la BD (NoSQL↔SQL), cambiar de framework, o reescribir el frontend **sin
> romper la lógica de negocio**.

---

## La idea en una frase

La **lógica de negocio no conoce los detalles** (qué BD, qué framework HTTP, qué proveedor de pagos).
Habla con **interfaces** (puertos); los detalles son **adaptadores** intercambiables.

```
[ Interfaces/UI ] → [ Application (casos de uso) ] → [ Domain (reglas) ]
                                  │
                                  ▼ (puertos = interfaces)
                        [ Infrastructure: adaptadores ]
                        Mongo · Postgres · Stripe · S3 · Email
```

## Puertos y adaptadores (hexagonal)

- Un **puerto** es una interfaz que define *qué* necesita el dominio, no *cómo*.
- Un **adaptador** la implementa con una tecnología concreta.
- La lógica de negocio depende del puerto (Dependency Inversion, ver [`00-core-principles.md`](00-core-principles.md)).

```ts
// Puerto (en el dominio/aplicación) — no sabe de Mongo ni de SQL
interface ReservationRepository {
  save(r: Reservation): Promise<void>
  findById(id: ReservationId): Promise<Reservation | null>
  findUpcoming(guestId: GuestId, limit: number): Promise<Reservation[]>
}

// Adaptador hoy
class MongoReservationRepository implements ReservationRepository { ... }
// Adaptador mañana — migrar NO toca el dominio ni los casos de uso
class SqlReservationRepository implements ReservationRepository { ... }
```

## Abstracción de datos (el caso NoSQL → SQL)

- El dominio nunca recibe documentos de Mongo ni filas de SQL: recibe **entidades de dominio**.
- El adaptador traduce entre el modelo de la BD y la entidad. Así, cambiar de BD = escribir un
  adaptador nuevo + migrar datos; **el resto del código no se entera**.
- No filtres tipos específicos de la BD (ObjectId, Row) hacia arriba.

## Contratos de API versionados

- La API pública vive bajo una **versión** (`/v1`). Cambios incompatibles → `/v2`, manteniendo `/v1`
  hasta deprecarla. Así el frontend (o terceros) no se rompen cuando cambias el backend.
- Define el contrato (OpenAPI/schema) como fuente de verdad; frontend y backend lo comparten.
- Cambios aditivos (campos nuevos opcionales) no rompen; cambios que quitan/renombran sí → nueva versión.

## Inversión de dependencias en la práctica

- Inyecta dependencias (constructor o factory), no las instancies dentro de la lógica.
- Esto hace el código **testeable** (inyectas un fake en tests) y **flexible** (cambias la impl sin tocar al consumidor).

## Cómo hacer un cambio grande sin romper — patrón *expand → migrate → contract*

Para migrar BD, renombrar campos, o cambiar una API en uso, **nunca en un solo golpe**:

1. **Expand:** añade lo nuevo **conviviendo** con lo viejo (nueva columna/tabla/endpoint/campo opcional).
   Escribe en ambos ("dual write") si hace falta.
2. **Migrate:** mueve datos y consumidores al nuevo camino, gradualmente. Verifica paridad.
3. **Contract:** cuando nadie usa lo viejo, elimínalo.

Cada migración: reversible, con backup, probada en staging, y registrada como ADR.
Detalle operativo en [`../checklists/big-change-migration.md`](../checklists/big-change-migration.md).

---

## Verificables

- [ ] La lógica de negocio depende de puertos (interfaces), no de clientes concretos de BD/HTTP/SDK.
- [ ] Los detalles (BD, proveedores) son adaptadores intercambiables.
- [ ] El dominio trabaja con entidades propias, no con tipos de la BD.
- [ ] La API pública está versionada (`/v1`).
- [ ] Las dependencias se inyectan (no se instancian dentro de la lógica).
- [ ] Los cambios grandes siguen expand→migrate→contract y se registran como ADR.
