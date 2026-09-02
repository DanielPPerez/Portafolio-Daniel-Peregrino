-- Seed data for repair_price_references + repair_service_addons.
--
-- Fuentes:
--   * phones: encuesta local de Chiapas (TapaTech Tapachula) + tabla nacional de referencia
--     => data_confidence = 'local_validated'
--   * consoles: talleres de Monterrey / CDMX / Cuernavaca + agregador nacional.
--     No hay datos públicos de precios locales de Chiapas para consolas (documentado en ADR-0012).
--     => data_confidence = 'market_reference'
--   * tablets: sin datos en esta fase. NO se inventan filas (YAGNI / honestidad al cliente).
--
-- Punto medio de cada fila = (min + max) / 2 (se redondea al entero más cercano).
-- ON CONFLICT (uq_repair_lookup) re-aplica el UPSERT, así el seed es idempotente.

-- ============================================================
-- CONSOLES (10 filas, todas 'market_reference')
-- ============================================================
INSERT INTO repair_price_references
  (device_category, repair_type_id, name_key, quality_tier,
   reference_price_mxn, price_range_min_mxn, price_range_max_mxn,
   data_confidence, notes)
VALUES
  ('console', 'console_cleaning_thermal_paste', 'quoteCatalog.repairs.console.cleaning', NULL,
     350,  250,  450, 'market_reference', 'Switch/OLED ~$250, PS5/Xbox Series ~$350'),
  ('console', 'console_diagnostics',           'quoteCatalog.repairs.console.diagnostics', NULL,
       0,    0,  400, 'market_reference', 'Gratuito por defecto, igual que celulares'),
  ('console', 'console_joystick_drift',        'quoteCatalog.repairs.console.joystickDrift', NULL,
     500,  350,  700, 'market_reference', 'Joy-Con, DualSense o mando Xbox — el servicio más solicitado'),
  ('console', 'console_hdmi_port_repair',      'quoteCatalog.repairs.console.hdmiPort', NULL,
     700,  500, 1200, 'market_reference', 'Reparación de soldadura, sin señal de imagen'),
  ('console', 'console_power_supply_repair',   'quoteCatalog.repairs.console.powerSupply', NULL,
     800,  500, 1500, 'market_reference', 'No enciende / fuente de poder'),
  ('console', 'console_disc_drive_repair',     'quoteCatalog.repairs.console.discDrive', NULL,
     900,  600, 1500, 'market_reference', 'Lector no lee discos (PS5/Xbox, no aplica a Switch)'),
  ('console', 'console_battery_replacement',   'quoteCatalog.repairs.console.battery', NULL,
     600,  400,  900, 'market_reference', 'Principalmente Nintendo Switch — batería inflada'),
  ('console', 'console_controller_repair',     'quoteCatalog.repairs.console.controller', NULL,
     400,  250,  700, 'market_reference', 'Reparación de mando por separado (botones, análogos)'),
  ('console', 'console_software_repair',       'quoteCatalog.repairs.console.software', NULL,
     400,  200,  700, 'market_reference', 'Sistema operativo corrupto, actualización fallida'),
  ('console', 'console_overheating_repair',    'quoteCatalog.repairs.console.overheating', NULL,
     600,  400, 1000, 'market_reference', 'Más allá de limpieza básica — cambio de ventilador/disipador')
ON CONFLICT (device_category, repair_type_id, COALESCE(quality_tier, ''))
DO UPDATE SET
  name_key            = EXCLUDED.name_key,
  reference_price_mxn = EXCLUDED.reference_price_mxn,
  price_range_min_mxn = EXCLUDED.price_range_min_mxn,
  price_range_max_mxn = EXCLUDED.price_range_max_mxn,
  data_confidence     = EXCLUDED.data_confidence,
  notes               = EXCLUDED.notes,
  updated_at          = NOW();

-- ============================================================
-- PHONES (22 filas: 20 servicios + 2 variantes de pantalla, todas 'local_validated')
-- ============================================================
INSERT INTO repair_price_references
  (device_category, repair_type_id, name_key, quality_tier,
   reference_price_mxn, price_range_min_mxn, price_range_max_mxn,
   data_confidence, notes)
VALUES
  -- Pantallas: dos variantes (premium original / económica incell)
  ('phone', 'screen_replacement', 'quoteCatalog.repairs.phone.screen', 'economic_incell',
    750,  600,  950, 'local_validated', NULL),
  ('phone', 'screen_replacement', 'quoteCatalog.repairs.phone.screen', 'premium_original',
   1450, 1200, 3500, 'local_validated', NULL),

  -- Servicios generales
  ('phone', 'battery_replacement',    'quoteCatalog.repairs.phone.battery',    NULL,
    750,  500, 1500, 'local_validated', NULL),
  ('phone', 'charging_port',          'quoteCatalog.repairs.phone.chargingPort', NULL,
    500,  300, 1000, 'local_validated', NULL),
  ('phone', 'button_repair',          'quoteCatalog.repairs.phone.buttons',     NULL,
    500,  300,  800, 'local_validated', NULL),
  ('phone', 'software_troubleshooting', 'quoteCatalog.repairs.phone.software',  NULL,
    450,  200, 1000, 'local_validated', NULL),
  ('phone', 'data_recovery',          'quoteCatalog.repairs.phone.dataRecovery', NULL,
   2500, 1000, 5000, 'local_validated', NULL),
  ('phone', 'camera_repair',          'quoteCatalog.repairs.phone.camera',      NULL,
   1500,  800, 3000, 'local_validated', NULL),
  ('phone', 'speaker_repair',         'quoteCatalog.repairs.phone.speaker',     NULL,
    700,  400, 1200, 'local_validated', NULL),
  ('phone', 'internal_cleaning',      'quoteCatalog.repairs.phone.cleaning',    NULL,
    500,  300,  800, 'local_validated', NULL),
  ('phone', 'account_unlock',         'quoteCatalog.repairs.phone.accountUnlock', NULL,
    400,  150, 1500, 'local_validated', NULL),
  ('phone', 'motherboard_repair',     'quoteCatalog.repairs.phone.motherboard', NULL,
   3000, 1500, 5000, 'local_validated', NULL),
  ('phone', 'back_glass_replacement', 'quoteCatalog.repairs.phone.backGlass',   NULL,
   1000,  500, 1800, 'local_validated', NULL),
  ('phone', 'fingerprint_sensor_repair', 'quoteCatalog.repairs.phone.fingerprint', NULL,
   1500,  800, 2500, 'local_validated', NULL),
  ('phone', 'microphone_repair',      'quoteCatalog.repairs.phone.microphone',  NULL,
    650,  400, 1000, 'local_validated', NULL),
  ('phone', 'screen_protector_install', 'quoteCatalog.repairs.phone.protector', NULL,
    200,  100,  300, 'local_validated', NULL),
  ('phone', 'water_resistance_repair', 'quoteCatalog.repairs.phone.waterResistance', NULL,
   1800, 1000, 3000, 'local_validated', NULL),
  ('phone', 'diagnostics',            'quoteCatalog.repairs.phone.diagnostics', NULL,
      0,    0,  500, 'local_validated', 'Diagnóstico gratuito como gancho de venta (estrategia local)'),
  ('phone', 'app_configuration',      'quoteCatalog.repairs.phone.appConfig',   NULL,
    200,  100,  300, 'local_validated', NULL),
  ('phone', 'antenna_replacement',    'quoteCatalog.repairs.phone.antenna',     NULL,
   1500,  800, 2500, 'local_validated', NULL),
  ('phone', 'wifi_repair',            'quoteCatalog.repairs.phone.wifi',        NULL,
   1300,  800, 2000, 'local_validated', NULL)
ON CONFLICT (device_category, repair_type_id, COALESCE(quality_tier, ''))
DO UPDATE SET
  name_key            = EXCLUDED.name_key,
  reference_price_mxn = EXCLUDED.reference_price_mxn,
  price_range_min_mxn = EXCLUDED.price_range_min_mxn,
  price_range_max_mxn = EXCLUDED.price_range_max_mxn,
  data_confidence     = EXCLUDED.data_confidence,
  notes               = EXCLUDED.notes,
  updated_at          = NOW();

-- ============================================================
-- ADD-ONS (cargo fijo, sin rango)
-- ============================================================
INSERT INTO repair_service_addons (addon_id, name_key, price_mxn) VALUES
  ('home_pickup_delivery',  'quoteCatalog.addons.homePickupDelivery',  100),
  ('advanced_diagnostics',  'quoteCatalog.addons.advancedDiagnostics',    0)
ON CONFLICT (addon_id) DO UPDATE SET
  name_key   = EXCLUDED.name_key,
  price_mxn  = EXCLUDED.price_mxn,
  updated_at = NOW();
