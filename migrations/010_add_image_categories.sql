-- =============================================
-- Image Categories and Media Update
-- =============================================

-- Create image_categories table
CREATE TABLE IF NOT EXISTS image_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Add image_category_id to media table
ALTER TABLE media
ADD COLUMN image_category_id uuid REFERENCES image_categories(id) ON DELETE SET NULL;

-- Enable RLS (Row Level Security) if needed, but for now we rely on app logic
-- Add index
CREATE INDEX IF NOT EXISTS idx_media_image_category ON media(image_category_id);
