-- Seed data for site_settings table
-- Stores configuration values like CV paths

INSERT INTO site_settings (setting_key, setting_value, description) VALUES
  ('cv_path_es', '/cv/Daniel-Peregrino-Full-Stack_CV.pdf', 'Path to Spanish CV PDF'),
  ('cv_path_en', '/cv/Daniel%20Peregrino_Full-Stack_CV_ENGLISH.pdf', 'Path to English CV PDF')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description,
  updated_at = NOW();