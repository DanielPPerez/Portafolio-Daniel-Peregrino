-- Create the update_updated_at_column() function used by triggers
-- This function updates the updated_at timestamp to the current time

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Alternatively, if you prefer not to use PL/pgSQL, you can use SQL:
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
--   UPDATE SET updated_at = NOW() WHERE id = OLD.id;
--   RETURN NEW;
-- $$ LANGUAGE SQL;