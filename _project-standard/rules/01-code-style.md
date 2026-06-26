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
