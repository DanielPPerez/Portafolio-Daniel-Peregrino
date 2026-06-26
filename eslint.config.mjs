import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"
import prettier from "eslint-config-prettier"

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "_project-standard/**", "next-env.d.ts", "public/**"],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  prettier,
  {
    rules: {
      // Patrones de cliente legítimos que esta regla nueva marca como falso positivo:
      // guard de montaje para hidratación (next-themes), init desde localStorage y
      // sincronización de la transición de página con la ruta.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]

export default eslintConfig
