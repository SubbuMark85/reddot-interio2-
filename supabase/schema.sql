-- ==========================================================
-- REDDOT INTERIO - SUPABASE PRODUCTION DATABASE SCHEMA & RLS
-- ==========================================================

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  price TEXT NOT NULL,
  offer_price TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  location TEXT DEFAULT 'Hyderabad, Telangana',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for projects
-- Public / Customers: can ONLY select projects where enabled is true
DROP POLICY IF EXISTS "Public can view enabled projects" ON public.projects;
CREATE POLICY "Public can view enabled projects"
ON public.projects
FOR SELECT
TO public
USING (enabled = true);

-- Authenticated Admin: full access to insert, select, update, delete
DROP POLICY IF EXISTS "Authenticated admin has full access" ON public.projects;
CREATE POLICY "Authenticated admin has full access"
ON public.projects
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. Storage Bucket for Project Media (Photos & Videos)
INSERT INTO storage.buckets (id, name, public)
VALUES ('projects', 'projects', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 5. Storage RLS Policies
-- Allow anyone to read project media
DROP POLICY IF EXISTS "Project media is publicly accessible" ON storage.objects;
CREATE POLICY "Project media is publicly accessible"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'projects');

-- Allow authenticated admin to upload media
DROP POLICY IF EXISTS "Admin can upload project media" ON storage.objects;
CREATE POLICY "Admin can upload project media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'projects');

-- Allow authenticated admin to update project media
DROP POLICY IF EXISTS "Admin can update project media" ON storage.objects;
CREATE POLICY "Admin can update project media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'projects');

-- Allow authenticated admin to delete project media
DROP POLICY IF EXISTS "Admin can delete project media" ON storage.objects;
CREATE POLICY "Admin can delete project media"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'projects');

-- 6. Seed Initial Hyderabad Projects
INSERT INTO public.projects (name, category, media_url, media_type, price, offer_price, enabled, location, description)
VALUES
('The Obsidian Penthouse', 'Luxury Villa', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80', 'image', '₹28,50,000', '₹24,90,000', true, 'Jubilee Hills, Hyderabad', 'Custom fluted Italian marble walls, bespoke warm mood lighting, and imported minimal furniture designed for grand entertaining.'),
('Aura Minimalist Living Suite', 'Living Room', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80', 'image', '₹9,80,000', '₹8,20,000', true, 'Financial District, Hyderabad', 'ElevenLabs-inspired monochrome architectural acoustics, low-profile modular seating, and recessed museum-grade spotlights.'),
('Verdant Slate Modular Kitchen', 'Modular Kitchen', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80', 'image', '₹14,50,000', '₹12,40,000', true, 'Banjara Hills, Hyderabad', 'Anti-fingerprint matte acrylic shutters, Blum soft-touch hardware, waterfall quartz island with integrated induction cooktop.'),
('Serene Sanctuary Master Suite', 'Master Bedroom', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80', 'image', '₹11,00,000', '₹9,50,000', true, 'Gachibowli, Hyderabad', 'Acoustic suede upholstered headboard wall, tinted fluted glass walk-in wardrobe, and smart ambient twilight lighting.'),
('Nexus Tech HQ Executive Studio', 'Commercial', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80', 'image', '₹34,00,000', '₹29,00,000', true, 'Hitec City, Hyderabad', 'Biophilic ergonomic workstations, acoustic felt ceiling baffles, and private presentation pod with glass privacy switch.'),
('Crimson Accent Private Villa', 'Luxury Villa', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80', 'image', '₹42,00,000', '₹36,50,000', true, 'Kokapet, Hyderabad', 'Triple-height foyer with signature RedDot crimson metal statement stairs, ambient cove fixtures, and automated louvers.')
ON CONFLICT DO NOTHING;
