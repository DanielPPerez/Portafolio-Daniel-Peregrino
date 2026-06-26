<!-- GENERADO por _project-standard/sync/sync-rules.mjs para agentes genéricos / IA web. NO EDITAR A MANO. -->
<!-- Fuente de verdad: _project-standard/rules/  ·  Regenerar: node _project-standard/sync/sync-rules.mjs -->
# Reglas del proyecto (estándar senior)

Estas son las reglas innegociables del proyecto. Fuente completa: `_project-standard/`.

**Orden de precedencia:** instrucción directa del lead > estándar externo
(`context/EXTERNAL_STANDARD.md`) > este estándar > defaults de la herramienta.

**Antes de programar:** lee `_project-standard/context/AI_CONTEXT.md`, el perfil en
`_project-standard/profiles/` y la arquitectura en `_project-standard/context/DECISIONS.md`.
Si la tarea es un fix puntual o entras a un proyecto a medias, sigue el modo de alcance acotado
(`prompts/02-scoped-task-prompt.md`): infiere y confirma el alcance antes de tocar código.

**Innegociables:** código en inglés · comentarios en `COMMENTS_LANG` · función = 1 línea de doc
+ tags (@sensitive/@param-critico/@sideffect/@todo) · validación en frontera · errores tipados
· secretos en `.env` · i18n sin hardcode · lógica de negocio detrás de puertos · API versionada
· testear casos límite (no solo el camino feliz) · diff mínimo y no romper código ajeno
· corre el auditor del stack + baseline de seguridad (Semgrep/gitleaks) — ver skills/auditors.md
· respetar el estándar externo si existe · aplica ponytail sin recortar seguridad/validación/errores/accesibilidad.

---
# 00 · Principios core (SOLID, ACID, KISS, DRY, YAGNI)

> **Siempre activa.** Estos principios aplican a todo componente, página, módulo y función.
> Cada principio incluye *por qué importa* y *cómo aplicarlo*; al final, casillas verificables.

---

## SOLID (diseño de módulos y clases)

- **S — Single Responsibility:** un módulo/clase tiene **una sola razón para cambiar**.
  *Aplicar:* si describir qué hace una clase necesita un "y", divídela.
- **O — Open/Closed:** abierto a extensión, cerrado a modificación.
  *Aplicar:* nuevas variantes vía nuevas implementaciones de una interfaz, no editando un `switch` gigante.
- **L — Liskov:** una implementación debe poder sustituir a su interfaz sin romper al que la usa.
  *Aplicar:* no lances excepciones nuevas ni cambies precondiciones en una subclase.
- **I — Interface Segregation:** interfaces pequeñas y específicas, no una "interfaz Dios".
  *Aplicar:* mejor `Reader` y `Writer` que un `Repository` con 30 métodos.
- **D — Dependency Inversion:** depende de **abstracciones**, no de implementaciones concretas.
  *Aplicar:* la lógica de negocio recibe un `PaymentGateway` (interfaz), no `StripeClient` directo.
  → Esto es lo que permite migrar BD/proveedores sin romper. Ver [`08-architecture-change.md`](08-architecture-change.md).

## ACID (transacciones de datos)

- **Atomicity:** o pasa todo, o nada. *Aplicar:* envuelve escrituras múltiples en una transacción.
- **Consistency:** la BD nunca queda en estado inválido. *Aplicar:* constraints + validación de negocio.
- **Isolation:** transacciones concurrentes no se pisan. *Aplicar:* nivel de aislamiento correcto;
  cuidado con condiciones de carrera en lecturas-modificación-escritura.
- **Durability:** lo confirmado sobrevive a un crash. *Aplicar:* no confirmes al cliente antes de persistir.

> En NoSQL sin transacciones multi-documento, modela para que una operación atómica = un documento,
> o usa el patrón saga/outbox. Documenta la decisión en `DECISIONS.md`.

## KISS — Keep It Simple

La solución más simple que cumple el requisito. *Aplicar:* si dudas entre dos diseños, elige el que
puedas explicar en una frase. La complejidad se añade cuando un requisito real la exige, no "por si acaso".

## DRY — Don't Repeat Yourself

Una pieza de conocimiento vive en **un solo lugar**. *Aplicar:* extrae lógica repetida a una función
con nombre. **Pero ojo:** no abstraigas dos cosas que solo *se parecen* hoy (acoplamiento prematuro).
Regla práctica: a la **tercera** repetición, abstrae.

## YAGNI — You Aren't Gonna Need It

No construyas para un futuro hipotético. *Aplicar:* nada de "framework interno" para una sola necesidad.
Va de la mano con ponytail. Ver [`../skills/ponytail.md`](../skills/ponytail.md).

---

## Tensión entre principios (cómo decidir)

Cuando chocan (p. ej. DRY vs KISS), gana **el cambio futuro más barato**: prefiere el diseño que sea
más fácil de modificar cuando el requisito cambie. Si no estás seguro, KISS + YAGNI ganan por defecto.

---

## Verificables

- [ ] Ninguna clase/módulo tiene más de una razón para cambiar.
- [ ] La lógica de negocio depende de interfaces, no de clientes concretos (DB/HTTP/SDK).
- [ ] Toda escritura multi-paso está en una transacción (o tiene saga/outbox documentada).
- [ ] No hay lógica duplicada por tercera vez sin extraer.
- [ ] No hay abstracciones/configuración para necesidades que aún no existen.

---

# 01 · Estilo de código (idioma, comentarios, tags)

> **Siempre activa.** Define cómo se ve el código en todos mis proyectos.
> Skill relacionada: [`../skills/comment-style.md`](../skills/comment-style.md).

---

## Idioma

- **Código: 100% en inglés** — nombres de variables, funciones, clases, archivos, ramas y mensajes
  de commit. Sin excepciones.
- **Comentarios y docstrings: español por defecto.** Equipos LATAM.
- **Toggle a inglés:** si el proyecto lo requiere, fija `COMMENTS_LANG=en` en `AI_CONTEXT.md` y todos
  los comentarios pasan a inglés. El código no cambia (ya estaba en inglés).

```ts
// ✅ correcto (código en inglés, comentario en español)
function calculateInvoiceTotal(items: LineItem[]): Money { ... }

// ❌ incorrecto (código en español)
function calcularTotalFactura(articulos: Articulo[]): Dinero { ... }
```

## Comentarios: una línea por función

- **Cada función lleva UNA línea** de descripción (docstring/JSDoc de una línea). No bloques.
- **Cero comentarios obvios.** El código legible no necesita narración.
- **Comenta el *por qué*, no el *qué*.** El "qué" lo dice el código; el "por qué" se pierde.

```ts
/** Calcula el total con impuestos del país del cliente. */
function calculateInvoiceTotal(items: LineItem[], country: CountryCode): Money {
  // @sideffect lee la tabla de tasas vigente; puede variar por fecha de emisión
  const rate = taxRates.current(country)
  return items.reduce((acc, it) => acc.add(it.price.times(1 + rate)), Money.zero())
}
```

```ts
// ❌ comentario obvio prohibido
// suma a más b
return a + b
```

## Tags grepeables dentro del cuerpo

Marca dentro de la función lo que importa. Son **buscables** (`grep "@sensitive"`) y una IA los detecta.

| Tag | Significado |
|---|---|
| `@sensitive` | Toca un valor sensible (token, password, PII, clave). Revisar antes de loguear/serializar. |
| `@param-critico` | Parámetro cuyo valor cambia el comportamiento de forma importante (límites, flags, modos). |
| `@sideffect` | La línea hace I/O, escribe estado, o depende de algo externo (red, reloj, BD, env). |
| `@todo` | Pendiente. Acompáñalo de contexto o un ticket. |

```py
def authenticate(user_id: str, password: str) -> Session:
    """Verifica credenciales y abre sesión."""
    # @sensitive nunca loguear `password` ni el hash
    hashed = hash_password(password)
    # @param-critico `MAX_ATTEMPTS` define el bloqueo por fuerza bruta
    if attempts(user_id) >= MAX_ATTEMPTS:
        raise TooManyAttemptsError(user_id)
    ...
```

## Naming

- `camelCase` para variables/funciones (JS/TS), `snake_case` (Python), según el idioma.
- Booleanos con prefijo: `is`, `has`, `should`, `can`.
- Sin abreviaturas crípticas. `userCount`, no `usrCnt`.
- Constantes de configuración en `SCREAMING_SNAKE_CASE`.

## Formato

- Lo decide el **formatter** del proyecto (Prettier, Black, gofmt…), no el criterio humano.
- Corre en pre-commit (ver [`09-git-docs.md`](09-git-docs.md)). El formato no se discute en code review.

---

## Verificables

- [ ] Todo el código (nombres) está en inglés.
- [ ] Cada función tiene exactamente una línea de descripción.
- [ ] No hay comentarios que narren el "qué" obvio.
- [ ] Los valores sensibles y parámetros críticos están etiquetados con tags.
- [ ] El formatter corre automáticamente y el repo está formateado.

---

# 02 · Reglas de negocio

> **Siempre activa.** Las reglas de negocio son la **fuente de verdad** del proyecto. No deben estar
> dispersas y repetidas por el código; viven en un lugar, se documentan, se validan y se prueban.

---

## Dónde viven

- En una **capa de dominio** propia (`domain/` o `core/`), independiente de framework, HTTP y BD.
- Como **funciones puras** o entidades con métodos, sin dependencias de I/O.
- Nunca dentro de controladores, componentes de UI, ni queries SQL sueltas.

```
src/
  domain/                 ← reglas de negocio (puras, testeables, sin I/O)
    pricing.ts
    reservation.ts
  application/            ← orquesta casos de uso (llama dominio + puertos)
  infrastructure/         ← adaptadores: BD, HTTP, colas (detalles)
  interfaces/             ← controladores, CLI, componentes UI
```

Esta separación es la misma que permite cambiar de BD o de framework sin tocar las reglas.
Ver [`08-architecture-change.md`](08-architecture-change.md).

## Cómo se documentan

- Cada regla tiene un **nombre** y vive cerca del código que la implementa, con una línea que explica
  el *porqué de negocio* (no el cómo técnico).
- Las reglas importantes o discutidas se registran como **ADR** en
  [`../context/DECISIONS.md`](../context/DECISIONS.md) (p. ej. "los reembolsos se permiten hasta 48h").
- Si hay un documento de requisitos del cliente, enlázalo desde `AI_CONTEXT.md`.

```ts
/** Una reserva solo se cancela sin penalización con 24h de antelación. */
function canCancelFree(reservation: Reservation, now: Date): boolean {
  // @param-critico `FREE_CANCEL_WINDOW_HOURS` es regla de negocio, no constante técnica
  return hoursBetween(now, reservation.startsAt) >= FREE_CANCEL_WINDOW_HOURS
}
```

## Cómo se validan

- La validación de **forma** del dato (tipos, formato, rangos) ocurre en la frontera con un esquema.
  Ver [`03-errors-validation.md`](03-errors-validation.md).
- La validación de **negocio** (reglas) ocurre en el dominio y lanza errores de negocio tipados,
  no genéricos: `ReservationTooLateError`, no `Error("invalid")`.
- Una regla de negocio **nunca** se valida solo en el frontend; el frontend es UX, el backend es la verdad.

## Cómo se prueban

- Toda regla de negocio tiene **tests unitarios** (entrada → salida esperada), incluyendo los bordes.
- Los tests son la documentación ejecutable de la regla: si lees el test, entiendes la regla.
- Las constantes de negocio (`FREE_CANCEL_WINDOW_HOURS`) se testean explícitamente en sus límites.

---

## Antipatrones a evitar

- Misma regla copiada en frontend y backend con valores distintos → diverge en silencio.
- Reglas embebidas en queries SQL o en `if` de controladores → invisibles e intesteables.
- "Números mágicos" sin nombre (`if (hours >= 24)`) → nadie sabe que es una política de negocio.

---

## Verificables

- [ ] Las reglas de negocio viven en una capa de dominio sin dependencias de I/O.
- [ ] Cada regla importante está documentada (línea de porqué + ADR si es relevante).
- [ ] La validación de negocio lanza errores tipados, no genéricos.
- [ ] Ninguna regla vive solo en el frontend.
- [ ] Cada regla tiene tests unitarios cubriendo sus bordes.
- [ ] No hay números mágicos: las constantes de negocio tienen nombre.

---

# 03 · Errores y validación

> **Siempre activa.** Validar todo lo que entra; manejar errores de forma tipada y consistente.

---

## Validación en frontera

- **Todo input externo se valida con un esquema** antes de tocar la lógica: body, query, params,
  headers, variables de entorno, respuestas de APIs de terceros, archivos.
- Usa un validador con tipos: **Zod** (TS), **Pydantic** (Python), **valibot**, etc.
- Nunca confíes en datos que cruzan una frontera (red, archivo, env, usuario). "Parse, don't validate":
  convierte el dato crudo en un tipo válido en el borde; de ahí para adentro ya es confiable.

```ts
const CreateReservationInput = z.object({
  guestId: z.string().uuid(),
  startsAt: z.coerce.date().min(new Date()),
  partySize: z.number().int().min(1).max(20),
})
type CreateReservationInput = z.infer<typeof CreateReservationInput>

// en el controlador, en la frontera:
const input = CreateReservationInput.parse(req.body) // lanza si es inválido
```

## Errores esperados vs inesperados

| Tipo | Ejemplo | Manejo |
|---|---|---|
| **Esperado** (de negocio/validación) | input inválido, regla violada, no autorizado | error tipado → respuesta 4xx clara |
| **Inesperado** (bug/infra) | null inesperado, BD caída | log con stack → respuesta 5xx genérica |

- Modela los esperados como **clases/tipos de error de dominio**: `ValidationError`, `NotFoundError`,
  `UnauthorizedError`, `BusinessRuleError`.
- Los inesperados se **dejan propagar** hasta un handler central que loguea y responde 500.

## Formato de error único

Toda la API responde errores con la **misma forma**. Define una vez, úsala en todos lados.

```json
{
  "error": {
    "code": "RESERVATION_TOO_LATE",
    "message": "La reserva no puede cancelarse con menos de 24h.",
    "details": { "minHours": 24 }
  }
}
```

- `code` es estable y grepeable (para i18n y para clientes). `message` es legible y traducible.
- Nunca filtres stack traces, queries ni datos internos en la respuesta al cliente.

## Reglas duras

- **Nunca tragar excepciones en silencio.** Un `catch {}` vacío está prohibido. Si capturas, o
  manejas, o re-lanzas con contexto, o logueas y decides.
- **Nunca uses errores para control de flujo normal.**
- **Falla rápido y claro:** valida precondiciones al inicio de la función (`guard clauses`).
- En async, maneja siempre el rechazo de promesas (no `unhandledRejection`).

```ts
// ❌ prohibido
try { await save(x) } catch {}

// ✅ correcto
try {
  await save(x)
} catch (err) {
  // @sideffect log estructurado; re-lanzamos como error de infraestructura
  logger.error({ err, op: 'save', id: x.id }, 'persist failed')
  throw new InfrastructureError('save_failed', { cause: err })
}
```

---

## Verificables

- [ ] Todo input externo se valida con esquema en la frontera.
- [ ] Las variables de entorno se validan al arrancar (falla rápido si faltan).
- [ ] Errores esperados están tipados; inesperados van a un handler central.
- [ ] La API usa un formato de error único con `code` estable.
- [ ] No hay `catch` vacíos ni stack traces filtrados al cliente.
- [ ] Las promesas rechazadas siempre se manejan.

---

# 04 · Seguridad

> **Siempre activa.** Seguridad por defecto, no como parche al final. La filosofía ponytail nunca
> recorta aquí.

---

## Secretos

- **Nunca** en el código ni en el repo. Viven en variables de entorno (`.env`) **fuera** de git.
- Commitea un **`.env.example`** con las claves y valores ficticios para documentar qué hace falta.
- `.env` siempre en `.gitignore`. Verifica con `repomix` + secretlint antes de pegar el repo a una IA
  web (ver [`../skills/repomix.md`](../skills/repomix.md)) — evita filtrar claves a un chat.
- En producción usa un gestor de secretos (Vault, AWS/GCP Secret Manager, variables del runtime).
- Valida la presencia de secretos al arrancar (ver [`03-errors-validation.md`](03-errors-validation.md)).

## Validación y sanitización de entrada

- Toda entrada se valida (ver regla 03). Además, contra inyección:
  - **SQL:** consultas parametrizadas / ORM, **nunca** concatenar strings.
  - **NoSQL:** cuidado con operadores inyectados (`$where`, objetos en vez de strings).
  - **XSS:** escapar/serializar la salida en UI; no `innerHTML` con datos de usuario.
  - **Command/Path:** nunca pasar input a un shell ni construir rutas sin normalizar.

## AuthN / AuthZ

- **Autenticación** (quién eres) ≠ **autorización** (qué puedes). Implementa las dos.
- Verifica permisos en **cada** endpoint/acción del lado servidor, no solo ocultando botones en UI.
- **Mínimo privilegio:** la BD, los tokens y los servicios usan el permiso más bajo que funcione.
- Tokens con expiración corta + refresh; revoca al cerrar sesión. Hashea passwords con bcrypt/argon2.

## Protección de la superficie

- **Rate limiting** en endpoints públicos y de escritura (login, registro, pagos).
- **Idempotencia** en operaciones que se pueden reintentar (clave de idempotencia en pagos/POST).
- **CORS** restrictivo (orígenes explícitos, no `*` en producción con credenciales).
- **Headers de seguridad:** CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options` (usa helmet o equivalente).
- **HTTPS** siempre en producción.

## Datos sensibles (PII)

- Marca el manejo de PII/credenciales con `@sensitive` (ver [`01-code-style.md`](01-code-style.md)).
- No loguear datos sensibles (ver [`06-observability.md`](06-observability.md)).
- Cifra datos sensibles en reposo si la regulación lo exige; minimiza lo que guardas.

## Dependencias

- Audita dependencias (`npm audit`, `pip-audit`) en CI. No introduzcas paquetes sin revisar.
- Fija versiones (lockfile commiteado). Actualiza con criterio, no a ciegas.

---

## Verificables

- [ ] No hay secretos en el repo; existe `.env.example` y `.env` está en `.gitignore`.
- [ ] Las queries son parametrizadas; no hay concatenación de input.
- [ ] La salida en UI está escapada (sin XSS).
- [ ] Cada endpoint verifica autorización del lado servidor.
- [ ] BD/servicios corren con mínimo privilegio.
- [ ] Rate limiting en login/registro/escrituras; idempotencia donde aplica.
- [ ] CORS restrictivo + headers de seguridad + HTTPS en producción.
- [ ] PII marcada con `@sensitive` y nunca logueada.
- [ ] `audit` de dependencias pasa en CI; lockfile commiteado.

---

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

---

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

---

# 07 · Internacionalización (i18n)

> **Siempre activa y obligatoria** en todos los proyectos, aunque arranques con un solo idioma.
> Añadir i18n al final es caro; arrancar con él cuesta casi nada.

---

## Reglas duras

- **Cero texto hardcodeado** en la UI (ni en mensajes de error visibles, emails, validaciones).
  Todo texto visible al usuario pasa por una **clave de traducción**.
- Mínimo un locale definido desde el día 1. Estructura preparada para añadir más sin refactor.

```tsx
// ❌ prohibido
<button>Guardar reserva</button>

// ✅ correcto
<button>{t('reservation.save')}</button>
```

## Estructura de locales

- Archivos por idioma, claves namespaced por feature:

```
locales/
  es/
    common.json        { "save": "Guardar", "cancel": "Cancelar" }
    reservation.json   { "save": "Guardar reserva", "tooLate": "Quedan menos de 24h" }
  en/
    common.json
    reservation.json
```

- Claves **estables y semánticas** (`reservation.tooLate`), no el texto como clave.
- El **locale por defecto** y la **estrategia de fallback** (si falta una clave → cae al default)
  están definidos y documentados.

## Buenas prácticas

- **Pluralización e interpolación** vía la librería (ICU MessageFormat / i18next), no concatenando.
  `t('cart.items', { count })` → "1 artículo" / "3 artículos".
- **Fechas, números y moneda** se formatean con `Intl` según el locale, nunca a mano.
- **Mensajes de error de la API**: el `code` es estable (ver [`03-errors-validation.md`](03-errors-validation.md))
  y el texto traducible se resuelve en el cliente o por `Accept-Language`.
- Detección de locale: por preferencia del usuario > header `Accept-Language` > default.

## Librerías típicas

- Web/JS: `i18next` / `react-i18next`, `next-intl`, `vue-i18n`.
- Backend: resolver textos por `code` + locale; emails con plantillas por idioma.
- Documenta cuál usas en `AI_CONTEXT.md` y enlaza su doc oficial (ver [`../docs`] si existe).

---

## Verificables

- [ ] No hay texto visible hardcodeado; todo pasa por claves.
- [ ] Existe estructura de locales con al menos un idioma y fallback definido.
- [ ] Pluralización/interpolación vía la librería, no concatenando.
- [ ] Fechas/números/moneda formateados con `Intl` según locale.
- [ ] Mensajes de error traducibles a partir de un `code` estable.

---

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

---

# 09 · Git, commits y documentación viva

> **Siempre activa.** El historial y la documentación cuentan la historia del proyecto a cualquier
> humano o IA que llegue después.

---

## Git y ramas

- Rama por trabajo: `feat/...`, `fix/...`, `chore/...`, `refactor/...`. Nunca commitear directo a `main`.
- `main` siempre desplegable. PRs pequeños y revisables.
- `.gitignore` correcto desde el inicio (`.env`, `node_modules`, `dist`, archivos de IDE).

## Conventional Commits

Mensajes en inglés, formato `type(scope): subject`:

```
feat(reservation): add free-cancel window rule
fix(auth): reject expired refresh tokens
refactor(db): extract ReservationRepository port
chore(deps): bump fastify to 4.x
docs(readme): document env setup
```

Tipos: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`, `build`, `ci`.
Esto habilita **CHANGELOG** y **SemVer** automáticos.

## SemVer (versionado semántico)

`MAJOR.MINOR.PATCH`:
- **MAJOR**: cambios incompatibles (rompe API/contrato).
- **MINOR**: funcionalidad nueva compatible.
- **PATCH**: arreglos compatibles.

Un `feat` → MINOR, un `fix` → PATCH, un `feat!`/`BREAKING CHANGE` → MAJOR.

## Documentación viva (mínimos del proyecto)

| Archivo | Contenido |
|---|---|
| `README.md` | Qué es + **setup en menos de 5 minutos** (instalar, env, correr, test). |
| `ARCHITECTURE.md` | Diagrama de capas, puertos/adaptadores, decisiones estructurales. |
| `context/DECISIONS.md` | **ADRs**: cada decisión importante, con contexto, opciones y porqué. |
| `CHANGELOG.md` | Cambios por versión (generable desde Conventional Commits). |
| `context/AI_CONTEXT.md` | Estado y convenciones para que cualquier IA arranque. |
| `context/PROGRESS.md` | Diario de sesiones (handoff entre IAs). |

## ADRs — el detalle que grita "senior"

Un ADR documenta **por qué** se eligió algo, no solo qué. Formato corto en
[`../context/DECISIONS.md`](../context/DECISIONS.md). Toda decisión de arquitectura, elección de
librería, o excepción al estándar va ahí. Una IA futura los respeta en vez de rehacerlos.

## La doc se actualiza con el código

- Un cambio que afecta setup, arquitectura o contrato **incluye** la actualización de su doc en el mismo PR.
- Doc desactualizada es peor que no tenerla. Si una regla del estándar se rompe a propósito, ADR.

---

## Verificables

- [ ] Trabajo en ramas con nombre por tipo; `main` desplegable.
- [ ] Commits siguen Conventional Commits, en inglés.
- [ ] Versionado con SemVer; existe CHANGELOG.
- [ ] README permite levantar el proyecto en < 5 min.
- [ ] Existen ARCHITECTURE.md y DECISIONS.md (ADRs) y están al día.
- [ ] Los cambios actualizan su documentación en el mismo PR.

---

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

---

# 11 · Disciplina de alcance (scope)

> **Siempre activa. Crítica al unirse a un proyecto a medias o en un fix puntual.** El error de junior
> más caro es tocar lo que no te tocaba. Regla madre: **el diff más pequeño que resuelve la tarea.**

---

## Inferir y confirmar el alcance (antes de tocar código)

1. **Lee** el ticket/petición y el código alrededor. Entiende qué se pide y qué NO.
2. **Infiere el alcance** y resúmelo en 3-5 líneas: *qué voy a cambiar, en qué archivos, qué NO voy a
   tocar, y cómo lo verificaré.*
3. **Confírmalo conmigo** antes de escribir. Procede solo si lo apruebo o si es trivial e inequívoco.
4. Si durante el trabajo el alcance crece, **para y avísame** — no lo expandas en silencio.

> Modo de trabajo: *inferir y confirmar*. Para tareas acotadas usa
> [`../prompts/02-scoped-task-prompt.md`](../prompts/02-scoped-task-prompt.md).

## Diff mínimo

- Cambia **solo** lo necesario para la tarea. Nada de "ya que estaba aquí, arreglé esto otro".
- **No reformatees** archivos enteros: el ruido de formato esconde el cambio real y rompe el historial.
  Respeta el estilo existente del archivo aunque difiera de tu preferencia.
- **No hagas refactors no pedidos.** Si ves algo mejorable fuera de tu alcance, **anótalo y propónlo**
  (un TODO, un issue, una nota en `PROGRESS.md`), no lo hagas dentro de este cambio.
- Mantén los renombrados y movimientos de archivos en commits separados del cambio funcional.

## No rompas lo ajeno

- **Corre los tests antes** de empezar (para saber qué estaba verde) **y después** (para probar que no
  rompiste nada). Si no había tests del área, añade los mínimos para protegerte.
- **No cambies contratos públicos** (firmas de funciones exportadas, esquemas de API, formatos de
  respuesta, eventos) sin saber quién depende de ellos. Si debes, es un cambio versionado y avisado
  (ver [`08-architecture-change`](08-architecture-change.md)).
- **No toques** configuración global, dependencias, migraciones o CI salvo que la tarea lo pida.

## Valla de Chesterton (no borres lo que no entiendes)

> "No quites una valla hasta saber por qué la pusieron."

- Antes de **borrar o cambiar** código que parece raro/inútil, averigua por qué está ahí (git blame,
  comentarios, tests, preguntar). Puede estar resolviendo un caso límite que no ves.
- Código comentado o "muerto" que no entiendes: pregunta antes de eliminarlo.

## Cuando entras a un proyecto a medias

- **Primero leer, luego tocar:** convenciones, estructura, cómo se hacen las cosas aquí
  (puede haber un estándar externo, ver [`12-standards-interop`](12-standards-interop.md)).
- Reproduce el comportamiento actual antes de cambiarlo.
- Replica los **patrones existentes** del repo aunque no sean tu favoritos; la consistencia vale más
  que tu preferencia personal en código ajeno.

---

## Verificables

- [ ] El alcance fue inferido, resumido y confirmado antes de codear.
- [ ] El diff toca solo lo necesario; sin reformateos masivos ni refactors no pedidos.
- [ ] Los tests pasaban antes y siguen pasando después.
- [ ] No se cambiaron contratos públicos sin versionar/avisar.
- [ ] No se borró código no entendido (se investigó o preguntó primero).
- [ ] Las mejoras fuera de alcance quedaron propuestas, no aplicadas.

---

# 12 · Interoperabilidad de estándares

> **Siempre activa.** Este estándar es tuyo, pero no vive solo. Cuando entras a una empresa o proyecto
> con su **propio** estándar, ese gana. Este se vuelve **complementario**: rellena lo que el otro no
> diga, nunca lo contradice.

---

## Orden de precedencia (de mayor a menor)

Cuando dos fuentes digan cosas distintas, gana la de **más arriba**:

1. **Instrucción directa** del lead/equipo para la tarea actual.
2. **Estándar externo / de la empresa** — registrado en
   [`../context/EXTERNAL_STANDARD.md`](../context/EXTERNAL_STANDARD.md).
3. **Este estándar** (`_project-standard/rules/`).
4. **Defaults** de la herramienta/lenguaje.

> Regla de oro: **este estándar nunca se impone sobre el de la empresa.** Si chocan, la empresa manda
> y se documenta la diferencia.

## Cómo complementa (no contradice)

- Donde el estándar externo **define** algo (estilo, naming, ramas, commits, arquitectura) → se sigue
  el externo, aunque difiera de este.
- Donde el estándar externo **no dice nada** → aplican estas reglas para llenar el hueco.
- Los **valores universales** de este estándar (validar entrada, no filtrar secretos, manejar errores,
  no romper lo ajeno) se mantienen salvo que el externo los contradiga explícitamente — y eso sería raro.

## Al unirte a un proyecto con estándar externo

1. **Localiza** su estándar: `CONTRIBUTING.md`, `STYLEGUIDE`, `.editorconfig`, configs de lint/format,
   plantillas de PR, wiki interna, o pregunta al equipo.
2. **Regístralo** en [`../context/EXTERNAL_STANDARD.md`](../context/EXTERNAL_STANDARD.md): resumen,
   enlaces, y la tabla de precedencia/conflictos.
3. **Adopta** sus herramientas tal cual (su ESLint/Prettier/CI), no impongas las tuyas.
4. **Replica sus patrones** existentes en el código (ver [`11-scope-discipline`](11-scope-discipline.md)).

## Conflictos → ADR

Cuando una regla de la empresa contradiga una de aquí, **no la ignores en silencio**: anótala en la
tabla de `EXTERNAL_STANDARD.md` y, si es relevante, como ADR en
[`../context/DECISIONS.md`](../context/DECISIONS.md), indicando que se sigue la externa. Así queda claro
para cualquier IA futura por qué este proyecto se desvía del estándar base.

---

## Verificables

- [ ] Si existe estándar externo, está registrado en `EXTERNAL_STANDARD.md` con enlaces.
- [ ] Se usan las herramientas (lint/format/CI) del proyecto externo, no las propias impuestas.
- [ ] El código nuevo replica los patrones existentes del repo.
- [ ] Los conflictos entre estándares están documentados; gana el externo.
- [ ] No se impuso ninguna regla de este estándar por encima de una de la empresa.

---

# 13 · Guardarraíles anti-errores de junior

> **Siempre activa.** Catálogo de los errores que más cometen los desarrolladores junior y el antídoto
> concreto de cada uno. La IA debe auto-vigilarse contra estos. Muchos enlazan a la regla que los
> desarrolla en detalle.

---

## Antes de escribir código

| Error de junior | Antídoto |
|---|---|
| Arreglar sin entender el bug | **Reproduce primero**, identifica la **causa raíz**, no el síntoma. Escribe un test que falle, luego arréglalo. |
| Asumir en vez de leer | Lee el código y las convenciones existentes antes de inventar. La respuesta suele estar en el repo. |
| No preguntar ante ambigüedad | Si la tarea es ambigua, **pregunta**; construir lo equivocado cuesta más que una pregunta. |
| Empezar a lo grande | Divide en pasos pequeños y verificables. |

## Al escribir código

| Error de junior | Antídoto |
|---|---|
| Hacer más (o menos) de lo pedido | Cíñete al alcance (ver [`11-scope-discipline`](11-scope-discipline.md)). Ni gold-plating ni dejar a medias. |
| Over-engineering | Aplica ponytail/KISS/YAGNI: el mínimo que funciona ([`00-core-principles`](00-core-principles.md)). |
| Copiar sin entender | No pegues código (de internet o de otra IA) que no puedas explicar línea por línea. |
| Números mágicos y hardcode | Constantes con nombre; textos por i18n; config por env ([`07-i18n`](07-i18n.md), [`04-security`](04-security.md)). |
| Solo el camino feliz | Cubre vacío/null/error/concurrencia ([`10-testing-edge-cases`](10-testing-edge-cases.md)). |
| Tragar errores | Nada de `catch {}` vacío; maneja o propaga con contexto ([`03-errors-validation`](03-errors-validation.md)). |
| Reinventar lo que existe | Reusa utilidades/funciones ya presentes antes de crear nuevas. |

## Al integrar y entregar

| Error de junior | Antídoto |
|---|---|
| Romper lo que funcionaba | Corre tests **antes y después**; no cambies contratos públicos sin avisar. |
| PR gigante e irrevisable | Cambios pequeños y enfocados; separa refactor de feature. |
| Commitear basura | Sin secretos, sin `console.log`/prints de debug, sin código comentado, sin archivos generados. |
| Romper compatibilidad hacia atrás | Cambios incompatibles → versionar y comunicar ([`08-architecture-change`](08-architecture-change.md)). |
| Mensajes de commit inútiles | Conventional Commits que expliquen el porqué ([`09-git-docs`](09-git-docs.md)). |

## Con git y el entorno

| Error de junior | Antídoto |
|---|---|
| Commitear directo a `main` | Trabaja en ramas; `main` siempre desplegable. |
| Reescribir historia compartida | Nada de `push --force` sobre ramas compartidas ni `reset --hard` a ciegas. |
| Borrar lo que no entiendes | Valla de Chesterton: investiga antes de eliminar ([`11-scope-discipline`](11-scope-discipline.md)). |
| Probar solo en tu máquina | "Funciona en mi máquina" no basta: env reproducible, validar en CI/staging. |
| Tocar prod sin red de seguridad | Backup + plan de rollback + staging ([`../checklists/pre-deploy.md`](../checklists/pre-deploy.md)). |

## Actitud (lo que separa junior de senior)

- **Documenta tus decisiones** (ADRs) y tu progreso (`PROGRESS.md`); no dejes el contexto solo en tu cabeza.
- **Pide revisión** y acepta el feedback sin tomarlo personal.
- **Di lo que no sabes.** Reportar honestamente "esto falla / no lo terminé / no estoy seguro" vale más
  que aparentar que todo está bien.
- **Deja el código mejor de como lo encontraste** — pero dentro de tu alcance, no fuera.

---

## Verificables

- [ ] El bug se reprodujo y se atacó la causa raíz, no el síntoma.
- [ ] Se reusó lo existente antes de crear código nuevo.
- [ ] El commit no incluye secretos, logs de debug ni código comentado.
- [ ] El cambio es pequeño y revisable; refactor separado de feature.
- [ ] No se rompió compatibilidad ni se tocó `main`/historia compartida indebidamente.
- [ ] Lo no sabido o no terminado se reportó con honestidad.