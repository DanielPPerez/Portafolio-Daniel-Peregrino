# 10 · Pruebas y casos límite

> **Siempre activa.** El código no está terminado cuando "funciona con datos buenos", sino cuando
> resiste los datos malos. La IA debe **intuir, documentar y testear** los casos de uso y los bordes,
> no solo el camino feliz.

---

## Antes de codear: enumerar casos de uso

Para cada función/feature, antes de implementar, lista:
- **Caso feliz:** el uso normal esperado.
- **Casos alternativos:** variantes válidas (distintos roles, estados, configuraciones).
- **Casos límite (edge cases):** los bordes donde el código suele romperse.
- **Casos de error:** entradas inválidas y fallos externos.

Escríbelos como tabla **entrada → resultado esperado**. Es la especificación ejecutable de la feature.

```
| Caso                    | Entrada                  | Esperado                        |
|-------------------------|--------------------------|---------------------------------|
| Feliz                   | partySize=4              | reserva creada                  |
| Límite inferior         | partySize=1              | reserva creada                  |
| Límite superior         | partySize=20             | reserva creada                  |
| Fuera de rango          | partySize=0 / 21         | ValidationError                 |
| Vacío / null            | partySize=null           | ValidationError                 |
| Concurrencia            | 2 reservas mismo slot    | una falla con ConflictError     |
```

## Checklist de bordes a considerar (intuición sistemática)

- **Vacío / nulo:** `null`, `undefined`, string `""`, lista `[]`, objeto `{}`.
- **Numéricos:** `0`, negativos, máximos, decimales, overflow, división por cero.
- **Colecciones:** 0 elementos, 1, muchísimos (paginación), duplicados, orden inesperado.
- **Texto:** unicode, emojis, espacios, muy largo, inyección (ver [`04-security`](04-security.md)).
- **Tiempo:** zonas horarias, fechas pasadas/futuras, cambios de horario, expiraciones.
- **Concurrencia:** dos operaciones a la vez sobre el mismo recurso (condiciones de carrera).
- **Fallos externos:** red caída, timeout, respuesta malformada, servicio que devuelve error.
- **Permisos:** usuario sin permiso, sesión expirada, recurso de otro usuario.
- **Idempotencia:** ejecutar dos veces (ver [`04-security`](04-security.md) y perfiles).

## Estrategia de tests (rigor estricto)

- **Unitarios** para la lógica de negocio y cada caso límite enumerado. Son obligatorios.
- **Integración** para las fronteras (endpoints, repositorios, adaptadores).
- **E2E** para los flujos críticos del usuario (login, pago, el "camino del dinero").
- Patrón **Arrange-Act-Assert**; un test = un comportamiento; nombre que describe el caso.
- Tests **deterministas**: sin depender de reloj/red/orden reales → inyecta fakes
  (ver [`08-architecture-change`](08-architecture-change.md)).
- Un test que reproduce un **bug** se escribe **antes** de arreglarlo (test de regresión).

```ts
describe('canCancelFree', () => {
  it('permite cancelar con exactamente 24h (límite)', () => {
    expect(canCancelFree(reservationAt('+24h'), now)).toBe(true)
  })
  it('rechaza con 23h59m (justo debajo del límite)', () => {
    expect(canCancelFree(reservationAt('+23h59m'), now)).toBe(false)
  })
})
```

## Errores como ciudadanos de primera clase

- No testees solo que "funciona": testea que **falla bien** (lanza el error correcto, con el mensaje
  correcto, sin corromper estado). Ver [`03-errors-validation`](03-errors-validation.md).

---

## Verificables

- [ ] Cada feature tiene su tabla de casos (uso + límite + error) documentada o en los tests.
- [ ] Los casos límite del checklist relevantes están cubiertos por tests.
- [ ] Hay tests de los caminos de error, no solo del feliz.
- [ ] Los tests son deterministas (sin reloj/red/orden reales).
- [ ] Cada bug corregido tiene un test de regresión escrito antes del fix.
- [ ] Los flujos críticos tienen cobertura E2E.
