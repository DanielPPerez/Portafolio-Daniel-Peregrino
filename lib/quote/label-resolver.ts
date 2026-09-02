import type { Dictionary } from "@/lib/i18n/es"

export type LabelKey = string

function getPath(obj: unknown, segments: string[]): unknown {
  let current: unknown = obj
  for (const seg of segments) {
    if (current && typeof current === "object" && seg in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[seg]
    } else {
      return undefined
    }
  }
  return current
}

/**
 * Resuelve un labelKey del catálogo (p. ej. "quoteCatalog.repairs.phone.battery")
 * a su traducción en el diccionario activo. Si la key no existe, devuelve la key cruda
 * (defensivo: la UI sigue funcionando, solo muestra el identificador en vez de un texto humano).
 */
export function resolveLabelKey(key: LabelKey, dict: Dictionary): string {
  const segments = key.split(".")
  const value = getPath(dict, segments)
  return typeof value === "string" ? value : key
}
