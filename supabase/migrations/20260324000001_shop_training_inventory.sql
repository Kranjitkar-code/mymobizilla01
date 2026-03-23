-- Tables referenced by ShopService, TrainingService, and admin RLS (public catalog read + authenticated manage).

CREATE TABLE IF NOT EXISTS public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS brands_name_lower ON public.brands (lower(name));

CREATE TABLE IF NOT EXISTS public.phone_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  series text,
  description text,
  image_url text,
  base_price numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (brand, model)
);

CREATE TABLE IF NOT EXISTS public.training_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  level text,
  short_description text,
  detailed_description text,
  key_learning_outcomes jsonb DEFAULT '[]'::jsonb,
  target_audience jsonb DEFAULT '[]'::jsonb,
  duration text,
  price text,
  highlights jsonb DEFAULT '[]'::jsonb,
  promotional_text text,
  image_url text,
  google_form_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.training_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  video_url text,
  youtube_id text,
  thumbnail_url text,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.accessories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  brand text,
  model text,
  sku text,
  price numeric DEFAULT 0,
  stock integer,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  brand text,
  model text,
  sku text,
  price numeric DEFAULT 0,
  stock integer,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.machineries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  brand text,
  model text,
  sku text,
  price numeric DEFAULT 0,
  stock integer,
  image_url text,
  condition text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.secondhand_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  brand text,
  model text,
  sku text,
  price numeric DEFAULT 0,
  stock integer,
  image_url text,
  condition text,
  status text DEFAULT 'available',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.inventories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  brand text,
  model text,
  sku text,
  price numeric DEFAULT 0,
  quantity integer,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Older DBs may already have phone_models / accessories / parts with fewer columns (CREATE TABLE IF NOT EXISTS skips).
ALTER TABLE public.phone_models ADD COLUMN IF NOT EXISTS brand text;
ALTER TABLE public.phone_models ADD COLUMN IF NOT EXISTS model text;
ALTER TABLE public.phone_models ADD COLUMN IF NOT EXISTS series text;
ALTER TABLE public.phone_models ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.phone_models ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.phone_models ADD COLUMN IF NOT EXISTS base_price numeric DEFAULT 0;
ALTER TABLE public.phone_models ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE public.phone_models ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'phone_models' AND column_name = 'name'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'phone_models' AND column_name = 'brand'
  ) THEN
    UPDATE public.phone_models
    SET
      brand = COALESCE(NULLIF(trim(brand), ''), 'Unknown'),
      model = COALESCE(NULLIF(trim(model), ''), NULLIF(trim(name), ''), 'Unknown')
    WHERE brand IS NULL OR brand = '' OR model IS NULL OR model = '';
  END IF;
END $$;

ALTER TABLE public.accessories ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE public.parts ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'phone_models' AND column_name = 'brand'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_phone_models_brand ON public.phone_models (brand);
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'accessories' AND column_name = 'created_at'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_accessories_created ON public.accessories (created_at DESC);
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'parts' AND column_name = 'created_at'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_parts_created ON public.parts (created_at DESC);
  END IF;
END $$;

-- RLS: anonymous read for storefront; full access for authenticated (admin)
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machineries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secondhand_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "brands_public_read" ON public.brands;
CREATE POLICY "brands_public_read" ON public.brands FOR SELECT USING (true);
DROP POLICY IF EXISTS "brands_authenticated_all" ON public.brands;
CREATE POLICY "brands_authenticated_all" ON public.brands FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "phone_models_public_read" ON public.phone_models;
CREATE POLICY "phone_models_public_read" ON public.phone_models FOR SELECT USING (true);
DROP POLICY IF EXISTS "phone_models_authenticated_all" ON public.phone_models;
CREATE POLICY "phone_models_authenticated_all" ON public.phone_models FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "training_courses_public_read" ON public.training_courses;
CREATE POLICY "training_courses_public_read" ON public.training_courses FOR SELECT USING (true);
DROP POLICY IF EXISTS "training_courses_authenticated_all" ON public.training_courses;
CREATE POLICY "training_courses_authenticated_all" ON public.training_courses FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "training_videos_public_read" ON public.training_videos;
CREATE POLICY "training_videos_public_read" ON public.training_videos FOR SELECT USING (true);
DROP POLICY IF EXISTS "training_videos_authenticated_all" ON public.training_videos;
CREATE POLICY "training_videos_authenticated_all" ON public.training_videos FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "accessories_public_read" ON public.accessories;
CREATE POLICY "accessories_public_read" ON public.accessories FOR SELECT USING (true);
DROP POLICY IF EXISTS "accessories_authenticated_all" ON public.accessories;
CREATE POLICY "accessories_authenticated_all" ON public.accessories FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "parts_public_read" ON public.parts;
CREATE POLICY "parts_public_read" ON public.parts FOR SELECT USING (true);
DROP POLICY IF EXISTS "parts_authenticated_all" ON public.parts;
CREATE POLICY "parts_authenticated_all" ON public.parts FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "machineries_public_read" ON public.machineries;
CREATE POLICY "machineries_public_read" ON public.machineries FOR SELECT USING (true);
DROP POLICY IF EXISTS "machineries_authenticated_all" ON public.machineries;
CREATE POLICY "machineries_authenticated_all" ON public.machineries FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "secondhand_inventory_public_read" ON public.secondhand_inventory;
CREATE POLICY "secondhand_inventory_public_read" ON public.secondhand_inventory FOR SELECT USING (true);
DROP POLICY IF EXISTS "secondhand_inventory_authenticated_all" ON public.secondhand_inventory;
CREATE POLICY "secondhand_inventory_authenticated_all" ON public.secondhand_inventory FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "inventories_public_read" ON public.inventories;
CREATE POLICY "inventories_public_read" ON public.inventories FOR SELECT USING (true);
DROP POLICY IF EXISTS "inventories_authenticated_all" ON public.inventories;
CREATE POLICY "inventories_authenticated_all" ON public.inventories FOR ALL TO authenticated USING (true) WITH CHECK (true);
