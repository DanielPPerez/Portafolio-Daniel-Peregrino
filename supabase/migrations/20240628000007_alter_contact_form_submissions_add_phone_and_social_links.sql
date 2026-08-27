-- Add phone and social_links columns to contact_form_submissions table
-- phone: optional contact phone number (TEXT)
-- social_links: optional array of social links (JSONB)

ALTER TABLE contact_form_submissions
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS social_links JSONB;

-- No need to update existing rows; columns will be NULL by default