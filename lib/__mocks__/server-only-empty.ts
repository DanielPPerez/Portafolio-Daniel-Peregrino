// Mock de `server-only` para Vitest. El paquete real lanza un error si se importa
// fuera de un Server Component de Next; los tests corren en Node puro, donde no aplica.
// Los tests del pricing engine inyectan su propio repositorio, así que este módulo
// puede estar vacío sin perder cobertura.
export {}
