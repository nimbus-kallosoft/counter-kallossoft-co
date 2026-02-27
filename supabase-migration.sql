-- Run this in Supabase SQL Editor for project bpwpplfvqdhtbitxchlg

-- Page views counter table
CREATE TABLE IF NOT EXISTS page_views (
  id TEXT PRIMARY KEY DEFAULT 'counter',
  count BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert initial row
INSERT INTO page_views (id, count) VALUES ('counter', 0)
ON CONFLICT (id) DO NOTHING;

-- Atomic increment function
CREATE OR REPLACE FUNCTION increment_page_views()
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
  new_count BIGINT;
BEGIN
  UPDATE page_views
  SET count = count + 1, updated_at = now()
  WHERE id = 'counter'
  RETURNING count INTO new_count;
  RETURN new_count;
END;
$$;

-- RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON page_views
  FOR SELECT USING (true);

-- Permissions
GRANT EXECUTE ON FUNCTION increment_page_views() TO anon;
GRANT SELECT ON page_views TO anon;
