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
