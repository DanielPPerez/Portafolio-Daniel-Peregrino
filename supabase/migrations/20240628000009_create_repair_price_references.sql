-- Repair price references + add-ons for the phone/tablet/console line of the quote engine.
-- Same conventions as the rest of the supabase/migrations folder:
--   - gen_random_uuid() PK, timestamptz default now(), update_updated_at_column() trigger,
--     RLS enabled, public SELECT, authenticated write.

CREATE TABLE IF NOT EXISTS repair_price_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_category TEXT NOT NULL CHECK (device_category IN ('phone', 'tablet', 'console')),
  repair_type_id TEXT NOT NULL,
  name_key TEXT NOT NULL,
  -- Pantallas (reparación más cara) tienen dos niveles de calidad; el resto queda NULL.
  quality_tier TEXT CHECK (quality_tier IN ('premium_original', 'economic_incell')),
  reference_price_mxn NUMERIC NOT NULL CHECK (reference_price_mxn >= 0),
  price_range_min_mxn NUMERIC NOT NULL CHECK (price_range_min_mxn >= 0),
  price_range_max_mxn NUMERIC NOT NULL CHECK (price_range_max_mxn >= 0),
  -- 'local_validated' = encuesta local Chiapas; 'market_reference' = referencia nacional.
  -- La UI muestra un disclaimer distinto según este valor (Fase 5).
  data_confidence TEXT NOT NULL CHECK (data_confidence IN ('local_validated', 'market_reference')),
  notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Invariante: el rango envuelve al punto medio.
  CHECK (price_range_min_mxn <= reference_price_mxn AND reference_price_mxn <= price_range_max_mxn)
);

-- Unicidad de lookup: permite que el mismo repair_type_id exista con y sin quality_tier,
-- pero rechaza duplicados accidentales. coalesce('') trata NULL como un valor estable.
CREATE UNIQUE INDEX IF NOT EXISTS uq_repair_lookup
  ON repair_price_references (device_category, repair_type_id, COALESCE(quality_tier, ''));

CREATE INDEX IF NOT EXISTS idx_repair_device_category
  ON repair_price_references (device_category);

CREATE TABLE IF NOT EXISTS repair_service_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  addon_id TEXT NOT NULL UNIQUE,
  name_key TEXT NOT NULL,
  price_mxn NUMERIC NOT NULL DEFAULT 0 CHECK (price_mxn >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE repair_price_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_service_addons ENABLE ROW LEVEL SECURITY;

-- Lectura pública: el cotizador (server-side) y la UI necesitan leer sin auth.
CREATE POLICY "Repair price references are publicly readable"
  ON repair_price_references FOR SELECT
  USING (true);

CREATE POLICY "Repair service addons are publicly readable"
  ON repair_service_addons FOR SELECT
  USING (true);

-- Escritura: solo usuarios autenticados (futuro panel admin).
CREATE POLICY "Authenticated users can manage repair price references"
  ON repair_price_references FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage repair service addons"
  ON repair_service_addons FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Triggers de updated_at (función creada en 20240628000000_create_updated_at_function.sql)
CREATE TRIGGER update_repair_price_references_updated_at
BEFORE UPDATE ON repair_price_references
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_repair_service_addons_updated_at
BEFORE UPDATE ON repair_service_addons
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
