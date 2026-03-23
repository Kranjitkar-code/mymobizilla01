-- Admin CMS tables, RLS policies, and website_content (section + jsonb).
-- If an older website_content table exists with a different shape, drop it in the SQL editor first, then re-run this migration or apply the CREATE manually.

-- ---------------------------------------------------------------------------
-- STEP B — Core tables (IF NOT EXISTS)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.website_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  section text UNIQUE NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text,
  email text,
  phone text,
  interest text,
  message text,
  status text DEFAULT 'unread',
  admin_reply text,
  replied_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text,
  link_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  bio text,
  photo_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  content text,
  rating integer,
  image_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.why_choose_us (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.video_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  video_url text NOT NULL,
  description text,
  thumbnail_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text,
  content text,
  cover_url text,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders') THEN
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS admin_notes text;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS technician_name text;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- STEP A — RLS policies (from project brief; errors ignored if duplicate)
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  tbl text;
  -- NOTE: `orders` is excluded — anonymous customers must INSERT bookings; see policies below.
  tables text[] := ARRAY[
    'banners','faqs','services','team_members','testimonials',
    'why_choose_us','video_lists','blogs','website_content',
    'contact_messages','training_courses','training_videos',
    'brands','phone_models','accessories','parts',
    'parts_categories','inventories','secondhand_inventory',
    'accessory_brands','accessory_categories','accessory_sub_categories',
    'machinery_brands','machinery_categories','machineries',
    'machinery_working_natures','permissions','roles'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    BEGIN
      EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
    BEGIN
      EXECUTE format(
        'CREATE POLICY "auth_full_%I" ON %I FOR ALL USING (auth.role() = ''authenticated'') WITH CHECK (auth.role() = ''authenticated'')',
        tbl, tbl
      );
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END LOOP;
END $$;

DO $$
DECLARE
  tbl text;
  public_tables text[] := ARRAY[
    'banners','faqs','services','team_members','testimonials',
    'why_choose_us','video_lists','blogs','brands',
    'phone_models','training_courses','training_videos','website_content'
  ];
BEGIN
  FOREACH tbl IN ARRAY public_tables LOOP
    BEGIN
      EXECUTE format(
        'CREATE POLICY "public_read_%I" ON %I FOR SELECT USING (true)',
        tbl, tbl
      );
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END LOOP;
END $$;

-- Orders: repair/buyback bookings — public insert + read for tracking; authenticated full access for admin
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders') THEN
    ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;
DO $$ BEGIN
  CREATE POLICY "orders_public_select" ON public.orders FOR SELECT USING (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "orders_public_insert" ON public.orders FOR INSERT WITH CHECK (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "orders_authenticated_all" ON public.orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
