-- Create site_settings table for configurable site-wide settings
-- Useful for things like CV file URLs, site metadata, etc. that might need updates without code deploys

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(50) DEFAULT 'string' CHECK (setting_type IN ('string', 'json', 'integer', 'boolean')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for site settings
-- Allow public to read (for frontend to get configuration)
CREATE POLICY "Site settings are readable by everyone"
  ON site_settings FOR SELECT
  USING (true);

-- Allow authenticated users to manage settings
CREATE POLICY "Authenticated users can manage site settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON site_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert some default settings for CV paths
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
  ('cv_path_es', '/cv/Daniel-Peregrino-Full-Stack_CV.pdf', 'string', 'Path to Spanish CV PDF'),
  ('cv_path_en', '/cv/Daniel%20Peregrino_Full-Stack_CV_ENGLISH.pdf', 'string', 'Path to English CV PDF')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  setting_type = EXCLUDED.setting_type,
  description = EXCLUDED.description,
  updated_at = NOW();