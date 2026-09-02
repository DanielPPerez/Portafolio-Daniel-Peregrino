import "server-only"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Cliente Supabase para uso server-side (route handlers, server actions, repositorios).
 * Usa service_role y falla rápido si las env vars no están (regla 03 — validar en frontera).
 */
let cached: SupabaseClient | null = null

export function getSupabaseServerClient(): SupabaseClient {
  if (cached) return cached

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      "Supabase server env vars missing: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.",
    )
  }

  cached = createClient(url, key, { auth: { persistSession: false } })
  return cached
}
