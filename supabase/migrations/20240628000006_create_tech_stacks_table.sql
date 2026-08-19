-- Create tech_stacks table for managing technologies displayed in the tech stack section
-- Allows updating technologies without code changes

CREATE TABLE IF NOT EXISTS tech_stacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(100) NOT NULL, -- e.g., 'Frontend', 'Backend & Architecture', etc.
  name VARCHAR(100) NOT NULL, -- Technology name (e.g., 'React', 'PostgreSQL')
  proficiency VARCHAR(20) CHECK (proficiency IN ('beginner', 'intermediate', 'advanced', 'expert')),
  years_experience INTEGER,
  logo_url TEXT, -- Optional: URL to logo icon
  color VARCHAR(7), -- Optional: hex color for display (e.g., '#3B82F6')
  is_featured BOOLEAN DEFAULT FALSE, -- Whether to highlight this technology
  display_order INTEGER DEFAULT 0, -- For ordering within category
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tech_stacks ENABLE ROW LEVEL SECURITY;

-- Create policies for tech_stacks
-- Allow public to read (for frontend to display tech stack)
CREATE POLICY "Tech stacks are readable by everyone"
  ON tech_stacks FOR SELECT
  USING (true);

-- Allow authenticated users to manage tech stacks
CREATE POLICY "Authenticated users can manage tech stacks"
  ON tech_stacks FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER update_tech_stacks_updated_at
BEFORE UPDATE ON tech_stacks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_tech_stacks_category ON tech_stacks(category);
CREATE INDEX IF NOT EXISTS idx_tech_stacks_display_order ON tech_stacks(display_order);
CREATE INDEX IF NOT EXISTS idx_tech_stacks_featured ON tech_stacks(is_featured) WHERE is_featured = true;