# Catálogo de patrones de arquitectura

> Referencia rápida. Para elegir según tu caso, usa [`decision-guide.md`](decision-guide.md).
> Todos se combinan con el pilar de tolerancia al cambio ([`../rules/08-architecture-change.md`](../rules/08-architecture-change.md)):
> el patrón define la **forma**, los puertos/adaptadores te dan la **flexibilidad**.

---

## 1. Monolito (single-deploy)

Todo en un despliegue. Una base de código, un proceso.

- **Pros:** simple de desarrollar, desplegar y debuggear. Transacciones ACID directas. Cero overhead de red interno.
- **Contras:** si crece sin disciplina, se vuelve un "big ball of mud". Escala como bloque (todo o nada).
- **Cuándo SÍ:** la mayoría de proyectos nuevos, MVPs, equipos pequeños.
- **Cuándo NO:** necesitas escalar partes de forma independiente con cargas muy distintas.

## 2. Monolito modular ⭐ (default recomendado)

Un solo despliegue, pero internamente dividido en **módulos con fronteras claras** (por feature/dominio),
comunicados por interfaces. Es un monolito que *podría* partirse en servicios si hiciera falta.

- **Pros:** simplicidad del monolito + orden del desacoplamiento. Te prepara para extraer servicios sin pagar el costo distribuido antes de tiempo.
- **Contras:** requiere disciplina para no cruzar fronteras entre módulos.
- **Cuándo SÍ:** casi siempre el mejor punto de partida para web full-stack y APIs.
- **Cuándo NO:** proyecto trivial de un archivo (es over-engineering); o ya sabes que necesitas servicios separados.

## 3. Hexagonal / Clean / Ports & Adapters

No es alternativa al monolito, es **cómo lo organizas por dentro**: dominio puro en el centro,
detalles (BD, HTTP, SDKs) como adaptadores en el borde. Se aplica dentro de un monolito modular o de un servicio.

- **Pros:** lógica de negocio testeable y aislada; cambiar BD/framework no toca el dominio. **Es la base de la tolerancia al cambio.**
- **Contras:** más estructura/indirección; exceso en scripts triviales.
- **Cuándo SÍ:** cualquier proyecto con lógica de negocio real que vaya a vivir y cambiar.
- **Cuándo NO:** un script de 100 líneas sin reglas de negocio.

## 4. Layered (N-capas: presentación → aplicación → dominio → datos)

Organización clásica por capas horizontales. Simple de entender.

- **Pros:** familiar, ordenado, bajo costo mental.
- **Contras:** tiende a filtrar detalles entre capas si no se cuida; menos explícito que hexagonal sobre las dependencias.
- **Cuándo SÍ:** CRUD directo, equipos que ya lo dominan.
- **Cuándo NO:** lógica de dominio rica que quieres aislar fuerte (prefiere hexagonal).

## 5. Event-driven (eventos / mensajería)

Componentes que se comunican publicando y consumiendo **eventos** (colas, pub/sub).

- **Pros:** desacople temporal, resiliencia, picos absorbidos por la cola, buena para integraciones y side-effects asíncronos.
- **Contras:** consistencia eventual (no inmediata), más difícil de razonar y debuggear, necesita idempotencia.
- **Cuándo SÍ:** procesamiento asíncrono, integraciones, side-effects (emails, reportes), alta carga desacoplada.
- **Cuándo NO:** flujos que requieren respuesta inmediata y consistencia fuerte.

## 6. Serverless (funciones / FaaS)

Funciones que corren bajo demanda en infra gestionada (Lambda, Cloud Functions, edge).

- **Pros:** escala automática, pagas por uso, cero gestión de servidores. Ideal para cargas intermitentes.
- **Contras:** cold starts, límites de ejecución, lock-in del proveedor, estado externo obligatorio.
- **Cuándo SÍ:** APIs de tráfico variable, webhooks, tareas programadas, automatizaciones, MVPs de bajo costo.
- **Cuándo NO:** procesos largos, baja latencia constante, o cuando quieres portabilidad total.

## 7. Microservicios

Varios servicios independientes, cada uno con su despliegue y (idealmente) su BD.

- **Pros:** escalado y despliegue independiente por servicio, equipos autónomos, aislamiento de fallos.
- **Contras:** **alta complejidad** — red, consistencia distribuida, observabilidad, DevOps pesado. Caro y lento si no lo necesitas.
- **Cuándo SÍ:** organización grande, varios equipos, partes con escalas muy distintas, producto maduro.
- **Cuándo NO:** equipo pequeño o producto joven. **Empieza monolito modular y extrae cuando duela**, no antes.

---

## Regla de oro

> Empieza con lo más simple que respete las fronteras (monolito modular + hexagonal). La complejidad
> distribuida (eventos, microservicios) se **gana**, no se asume. Migrar de monolito modular a
> servicios es barato si respetaste los puertos; lo caro es lo contrario.
