-- Create table for meeting requests (calificación antes del calendario)
-- Stores leads that have passed the qualification form and are approved to see the booking calendar.

CREATE TABLE IF NOT EXISTS meeting_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  social_links JSONB,
  company_name TEXT,
  role TEXT,
  project_budget_range TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE meeting_requests ENABLE ROW LEVEL SECURITY;

-- Allow public (anon) to insert (for the qualification form)
CREATE POLICY "Anyone can insert a meeting request"
  ON meeting_requests FOR INSERT
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users (admins, service role) to view and update
CREATE POLICY "Authenticated users can view meeting requests"
  ON meeting_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update meeting requests"
  ON meeting_requests FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- No delete policy; keep history for auditing.

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_meeting_requests_created_at ON meeting_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_meeting_requests_email ON meeting_requests(email);