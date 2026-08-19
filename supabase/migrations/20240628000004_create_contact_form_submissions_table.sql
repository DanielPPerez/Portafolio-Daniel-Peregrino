-- Create contact_form_submissions table for persistent contact form storage
-- Replaces ephemeral form handling with database storage

CREATE TABLE IF NOT EXISTS contact_form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  project_type VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  -- Optional fields for tracking
  ip_address INET,
  user_agent TEXT,
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Status for admin tracking
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  admin_notes TEXT
);

-- Enable Row Level Security
ALTER TABLE contact_form_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for contact form submissions
-- Allow public to insert (for the contact form)
CREATE POLICY "Anyone can submit a contact form"
  ON contact_form_submissions FOR INSERT
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users (admins) to view submissions
CREATE POLICY "Authenticated users can view contact form submissions"
  ON contact_form_submissions FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update submissions (for status changes, etc.)
CREATE POLICY "Authenticated users can update contact form submissions"
  ON contact_form_submissions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Note: Delete policy is typically not needed for contact forms (keep for history)

-- Create updated_at trigger
CREATE TRIGGER update_contact_form_submissions_updated_at
BEFORE UPDATE ON contact_form_submissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add some helpful indexes for common queries
CREATE INDEX IF NOT EXISTS idx_contact_form_submissions_status ON contact_form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_form_submissions_created_at ON contact_form_submissions(created_at DESC);