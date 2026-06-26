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
