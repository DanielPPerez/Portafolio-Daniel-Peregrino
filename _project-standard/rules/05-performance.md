# 05 · Performance y escalabilidad

> **Siempre activa.** Lo que "no se ve desde afuera" pero hace el proyecto fiable y escalable.
> No optimices a ciegas: **mide primero**, optimiza el cuello de botella real.

---

## Base de datos

- **Índices** en columnas usadas en `WHERE`, `JOIN`, `ORDER BY` y claves foráneas. Un índice de más
  ralentiza escrituras; uno de menos mata lecturas. Revisa el plan de ejecución (`EXPLAIN`).
- **Evita el problema N+1:** cargar una lista y luego una query por cada elemento. Usa `JOIN`,
  `IN (...)`, o carga ansiosa (`include`/`populate`/`select_related`).
- **Selecciona solo las columnas que usas** (evita `SELECT *`).
- Mueve el filtrado/ordenamiento/agregación a la BD, no lo hagas en memoria con datasets grandes.

## Paginación

- **Todo listado pagina por defecto.** Nunca devuelvas "todos los registros".
- Prefiere **paginación por cursor** (keyset) sobre `OFFSET` grande (que escanea y descarta).
- Incluye en la respuesta el cursor/total para que el cliente navegue.

## Caché

- Por capas, del más barato al más caro de invalidar:
  - **HTTP:** `Cache-Control`, `ETag` para respuestas cacheables.
  - **Aplicación/memoria:** memoiza cómputos caros e idempotentes.
  - **Distribuida:** Redis para datos compartidos entre instancias.
- **Lo difícil de la caché es invalidar:** define una estrategia (TTL, invalidación por evento) y
  documenta qué se cachea y por cuánto. No cachees datos sensibles ni por-usuario en una caché compartida.

## Estado en la URL (frontend)

- Filtros, paginación, orden y búsqueda **viven en los query params de la URL**, no solo en estado local.
- Beneficio: links compartibles, recarga sin perder contexto, back/forward del navegador funciona,
  y es deep-linkable. Sincroniza URL ↔ estado en ambos sentidos.

```
/products?category=shoes&sort=price_asc&page=2&q=running
```

## Trabajo pesado y concurrencia

- Operaciones largas (emails, reportes, procesamiento) van a una **cola/worker en background**, no
  bloquean la request.
- Usa streaming/paginado para procesar datasets grandes sin cargarlos enteros en memoria.
- Cuida los timeouts y los reintentos con backoff hacia servicios externos.

## Frontend (carga percibida)

- Code splitting / lazy loading de rutas y componentes pesados.
- Optimiza imágenes (formato, tamaño, `lazy`). Evita re-renders innecesarios.
- Mide con Lighthouse/Web Vitals; pon presupuesto de tamaño de bundle.

## Medir antes de optimizar

- No optimices por intuición. Usa profiling, métricas y logs de duración.
- Documenta en `DECISIONS.md` cualquier optimización no obvia (por qué, qué medías).

---

## Verificables

- [ ] Las columnas filtradas/ordenadas tienen índice; no hay `SELECT *` innecesario.
- [ ] No hay N+1 en los listados.
- [ ] Todos los listados paginan por defecto (cursor preferido).
- [ ] Hay estrategia de caché documentada donde aplica; no se cachea lo sensible.
- [ ] Filtros/orden/paginación se reflejan en la URL (web).
- [ ] El trabajo pesado corre en background, no en la request.
- [ ] Hay al menos una medición que justifica las optimizaciones aplicadas.
