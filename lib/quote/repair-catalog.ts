import "server-only"
import { getSupabaseServerClient } from "@/lib/supabase/server"

/**
 * Catálogo de reparaciones (server-side). Lee de Supabase.
 * Mismo patrón que `lib/quote/catalog.ts` (Fase 1) pero el origen de los datos es
 * una tabla en vez de un literal — los precios cambian más seguido y se editan sin
 * redeploy (ADR-0012).
 */

export type DeviceCategory = "phone" | "tablet" | "console"

export type RepairDataConfidence = "local_validated" | "market_reference"

export type QualityTier = "premium_original" | "economic_incell"

export type RepairPriceReference = {
  id: string
  deviceCategory: DeviceCategory
  repairTypeId: string
  nameKey: string
  qualityTier: QualityTier | null
  referencePriceMXN: number
  priceRangeMinMXN: number
  priceRangeMaxMXN: number
  dataConfidence: RepairDataConfidence
  notes: string | null
}

export type RepairServiceAddon = {
  id: string
  addonId: string
  nameKey: string
  priceMXN: number
}

type RepairRow = {
  id: string
  device_category: string
  repair_type_id: string
  name_key: string
  quality_tier: string | null
  reference_price_mxn: number | string
  price_range_min_mxn: number | string
  price_range_max_mxn: number | string
  data_confidence: string
  notes: string | null
}

type AddonRow = {
  id: string
  addon_id: string
  name_key: string
  price_mxn: number | string
}

function toNumber(value: number | string): number {
  return typeof value === "string" ? Number(value) : value
}

function mapRepairRow(row: RepairRow): RepairPriceReference {
  return {
    id: row.id,
    deviceCategory: row.device_category as DeviceCategory,
    repairTypeId: row.repair_type_id,
    nameKey: row.name_key,
    qualityTier: row.quality_tier as QualityTier | null,
    referencePriceMXN: toNumber(row.reference_price_mxn),
    priceRangeMinMXN: toNumber(row.price_range_min_mxn),
    priceRangeMaxMXN: toNumber(row.price_range_max_mxn),
    dataConfidence: row.data_confidence as RepairDataConfidence,
    notes: row.notes,
  }
}

function mapAddonRow(row: AddonRow): RepairServiceAddon {
  return {
    id: row.id,
    addonId: row.addon_id,
    nameKey: row.name_key,
    priceMXN: toNumber(row.price_mxn),
  }
}

/** Devuelve todas las filas de una categoría. Vacío si no hay datos (ej. tablet). */
export async function getRepairPriceReferences(
  deviceCategory: DeviceCategory,
): Promise<RepairPriceReference[]> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("repair_price_references")
    .select("*")
    .eq("device_category", deviceCategory)

  if (error) {
    throw new Error(`Failed to read repair_price_references: ${error.message}`)
  }

  return (data ?? []).map((row) => mapRepairRow(row as RepairRow))
}

/**
 * Busca una fila exacta por (categoría, tipo, tier). Si no hay match, devuelve null
 * — la fase del motor decide qué hacer (regla de "no extrapolar").
 */
export async function getRepairPriceReference(
  deviceCategory: DeviceCategory,
  repairTypeId: string,
  qualityTier?: QualityTier,
): Promise<RepairPriceReference | null> {
  const supabase = getSupabaseServerClient()
  let query = supabase
    .from("repair_price_references")
    .select("*")
    .eq("device_category", deviceCategory)
    .eq("repair_type_id", repairTypeId)

  if (qualityTier) {
    query = query.eq("quality_tier", qualityTier)
  } else {
    query = query.is("quality_tier", null)
  }

  const { data, error } = await query.maybeSingle()

  if (error) {
    throw new Error(`Failed to read repair_price_references: ${error.message}`)
  }

  return data ? mapRepairRow(data as RepairRow) : null
}

export async function getRepairServiceAddons(): Promise<RepairServiceAddon[]> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.from("repair_service_addons").select("*")

  if (error) {
    throw new Error(`Failed to read repair_service_addons: ${error.message}`)
  }

  return (data ?? []).map((row) => mapAddonRow(row as AddonRow))
}

export async function getRepairServiceAddon(addonId: string): Promise<RepairServiceAddon | null> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("repair_service_addons")
    .select("*")
    .eq("addon_id", addonId)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to read repair_service_addons: ${error.message}`)
  }

  return data ? mapAddonRow(data as AddonRow) : null
}
