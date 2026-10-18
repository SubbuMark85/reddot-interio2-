-- ==========================================================
-- REDDOT INTERIO - SUPABASE PRODUCTION DATABASE SCHEMA & RLS
-- Feature: show_price + project_videos + portfolio storage
-- ==========================================================

-- 1. Create Projects Table (if not exists)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  price TEXT NOT NULL,
  offer_price TEXT NOT NULL,
  show_price BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  location TEXT DEFAULT 'Hyderabad, Telangana',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Rename column 'enabled' to 'show_price' if migrating from previous schema
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'projects' 
      AND column_name = 'enabled'
  ) THEN
    ALTER TABLE public.projects RENAME COLUMN enabled TO show_price;
  END IF;
END $$;

-- 3. Create Project Videos Table (One project -> many videos)
CREATE TABLE IF NOT EXISTS public.project_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS) on base tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_videos ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for projects
-- Base projects table: restricted to authenticated admin to protect hidden prices from API queries
DROP POLICY IF EXISTS "Public can view enabled projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated admin has full access" ON public.projects;
DROP POLICY IF EXISTS "Admin has full access on projects" ON public.projects;

CREATE POLICY "Admin has full access on projects"
ON public.projects
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. RLS Policies for project_videos
-- Anyone can view videos; only authenticated admin can insert, update, or delete
DROP POLICY IF EXISTS "Anyone can view project videos" ON public.project_videos;
CREATE POLICY "Anyone can view project videos"
ON public.project_videos
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Admin has full access on project_videos" ON public.project_videos;
CREATE POLICY "Admin has full access on project_videos"
ON public.project_videos
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 7. Create Public Secure View: projects_public
-- Every project is visible to customers, but if show_price is false, price and offer_price are NULL
CREATE OR REPLACE VIEW public.projects_public AS
SELECT
  id,
  name,
  category,
  media_url,
  media_type,
  CASE WHEN show_price = true THEN price ELSE NULL END AS price,
  CASE WHEN show_price = true THEN offer_price ELSE NULL END AS offer_price,
  show_price,
  description,
  location,
  created_at
FROM public.projects;

GRANT SELECT ON public.projects_public TO anon, authenticated, service_role;

-- 8. Storage Buckets: 'projects' (images) and 'portfolio' (videos & media)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('projects', 'projects', true),
  ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies for 'portfolio' bucket (videos/<project_id>/)
DROP POLICY IF EXISTS "Portfolio files are publicly accessible" ON storage.objects;
CREATE POLICY "Portfolio files are publicly accessible"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id IN ('portfolio', 'projects'));

DROP POLICY IF EXISTS "Admin can upload portfolio files" ON storage.objects;
CREATE POLICY "Admin can upload portfolio files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN ('portfolio', 'projects'));

DROP POLICY IF EXISTS "Admin can update portfolio files" ON storage.objects;
CREATE POLICY "Admin can update portfolio files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id IN ('portfolio', 'projects'));

DROP POLICY IF EXISTS "Admin can delete portfolio files" ON storage.objects;
CREATE POLICY "Admin can delete portfolio files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id IN ('portfolio', 'projects'));

-- 9. Seed Initial Hyderabad Projects
INSERT INTO public.projects (id, name, category, media_url, media_type, price, offer_price, show_price, location, description)
VALUES
('00000000-0000-0000-0000-000000000001', 'The Obsidian Penthouse', 'Luxury Villa', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80', 'image', '₹28,50,000', '₹24,90,000', true, 'Jubilee Hills, Hyderabad', 'Custom fluted Italian marble walls, bespoke warm mood lighting, and imported minimal furniture designed for grand entertaining.'),
('00000000-0000-0000-0000-000000000002', 'Aura Minimalist Living Suite', 'Living Room', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80', 'image', '₹9,80,000', '₹8,20,000', true, 'Financial District, Hyderabad', 'ElevenLabs-inspired monochrome architectural acoustics, low-profile modular seating, and recessed museum-grade spotlights.'),
('00000000-0000-0000-0000-000000000003', 'Verdant Slate Modular Kitchen', 'Modular Kitchen', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80', 'image', '₹14,50,000', '₹12,40,000', true, 'Banjara Hills, Hyderabad', 'Anti-fingerprint matte acrylic shutters, Blum soft-touch hardware, waterfall quartz island with integrated induction cooktop.'),
('00000000-0000-0000-0000-000000000004', 'Serene Sanctuary Master Suite', 'Master Bedroom', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80', 'image', '₹11,00,000', '₹9,50,000', true, 'Gachibowli, Hyderabad', 'Acoustic suede upholstered headboard wall, tinted fluted glass walk-in wardrobe, and smart ambient twilight lighting.')
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Project Videos
INSERT INTO public.project_videos (project_id, video_url, title)
VALUES
('00000000-0000-0000-0000-000000000001', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', '360° Grand Foyer & Marble Cladding Walkthrough'),
('00000000-0000-0000-0000-000000000001', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'Ambient Evening Lighting Cinematic Tour'),
('00000000-0000-0000-0000-000000000002', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 'Living Room Acoustic & Spatial Tour'),
('00000000-0000-0000-0000-000000000003', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4', 'Blum Hardware & Servo-Drive Demo')
ON CONFLICT DO NOTHING;
