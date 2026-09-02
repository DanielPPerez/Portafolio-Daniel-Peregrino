import { defineConfig } from "vitest/config"
import path from "node:path"

export default defineConfig({
  test: {
    include: ["lib/**/*.test.ts"],
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      // server-only lanza un error fuera de Next (no tiene sentido en tests).
      // Alias a un módulo vacío: los tests ya inyectan el repositorio de reparación.
      "server-only": path.resolve(__dirname, "lib/__mocks__/server-only-empty.ts"),
    },
  },
})
