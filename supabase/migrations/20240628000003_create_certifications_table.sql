-- Create certifications table for dynamic certification management
-- Replaces hardcoded certifications data in lib/site-data.ts

CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issuer VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Create policies for certifications
-- Allow public read access (for website visitors)
CREATE POLICY "Certifications are viewable by everyone"
  ON certifications FOR SELECT
  USING (true);

-- Allow authenticated users to insert their own certifications
CREATE POLICY "Users can insert their own certifications"
  ON certifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow users to update their own certifications
CREATE POLICY "Users can update their own certifications"
  ON certifications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow users to delete their own certifications
CREATE POLICY "Users can delete their own certifications"
  ON certifications FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_certifications_updated_at
BEFORE UPDATE ON certifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();