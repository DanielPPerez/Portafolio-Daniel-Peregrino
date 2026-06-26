# Skill propia: estilo de comentarios

> Regla personal de comentarios. Es la versión accionable de
> [`../rules/01-code-style.md`](../rules/01-code-style.md). Una IA debe aplicarla en cada función que
> escriba o modifique.

---

## Las 4 reglas

1. **Una sola línea** de descripción por función (docstring/JSDoc de una línea). Nunca bloques largos.
2. **Cero comentarios obvios.** Si el código se lee solo, no lo narres.
3. **Comenta el *por qué*, no el *qué*.** El "qué" lo dice el código; el "por qué" se pierde sin comentario.
4. **Etiqueta lo importante** dentro del cuerpo con tags grepeables.

## Tags

| Tag | Cuándo |
|---|---|
| `@sensitive` | Toca secreto/PII/credencial. Revisar antes de loguear o serializar. |
| `@param-critico` | Parámetro que cambia el comportamiento (límites, flags, modos, políticas). |
| `@sideffect` | I/O, escritura de estado, dependencia externa (red, reloj, BD, env). |
| `@todo` | Pendiente; acompáñalo de contexto o ticket. |

## Idioma

- Comentarios en **español** por defecto; **inglés** si `COMMENTS_LANG=en` en `AI_CONTEXT.md`.
- El **código siempre en inglés**, independientemente del idioma de comentarios.

## Plantillas

**TypeScript / JavaScript**
```ts
/** Resuelve el precio final aplicando descuentos vigentes del cliente. */
function resolveFinalPrice(base: Money, customer: Customer): Money {
  // @param-critico `customer.tier` define el % de descuento por nivel
  const discount = discounts.forTier(customer.tier)
  // @sideffect consulta el catálogo de promociones activo a esta fecha
  const promo = promotions.activeFor(customer.id)
  return base.minus(discount).minus(promo)
}
```

**Python**
```py
def issue_token(user_id: str, scopes: list[str]) -> Token:
    """Emite un token firmado con los scopes solicitados."""
    # @sensitive la clave de firma viene de env; nunca loguear el token resultante
    key = settings.signing_key
    # @param-critico `TOKEN_TTL` define la expiración; afecta seguridad
    return sign(user_id, scopes, ttl=TOKEN_TTL, key=key)
```

## Auto-revisión (lo que una IA debe verificar al terminar)

- [ ] ¿Cada función nueva/modificada tiene **una** línea de descripción?
- [ ] ¿Eliminé comentarios obvios o redundantes?
- [ ] ¿Los comentarios restantes explican el *por qué*?
- [ ] ¿Marqué con tags los valores sensibles, parámetros críticos y side-effects?
- [ ] ¿El idioma de comentarios coincide con `COMMENTS_LANG`?

## Búsqueda rápida (para auditar)

```bash
# Encuentra todos los puntos sensibles del proyecto
grep -rn "@sensitive" src/
grep -rn "@todo" src/
```
