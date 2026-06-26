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
