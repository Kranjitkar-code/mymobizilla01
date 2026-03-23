-- Legacy singleton tables used by ContentService (getSettings / getEditableContent) alongside website_content.

CREATE TABLE IF NOT EXISTS public.website_settings (
  id text PRIMARY KEY,
  site_title text,
  contact_phone text,
  contact_email text,
  contact_address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.editable_content (
  id text PRIMARY KEY,
  hero_title text,
  hero_subtitle text,
  contact_phone text,
  contact_email text,
  contact_address text,
  about_us text,
  services_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

INSERT INTO public.website_settings (id) VALUES ('site_settings') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.editable_content (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editable_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "website_settings_public_read" ON public.website_settings;
CREATE POLICY "website_settings_public_read" ON public.website_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "website_settings_authenticated_all" ON public.website_settings;
CREATE POLICY "website_settings_authenticated_all" ON public.website_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "editable_content_public_read" ON public.editable_content;
CREATE POLICY "editable_content_public_read" ON public.editable_content FOR SELECT USING (true);
DROP POLICY IF EXISTS "editable_content_authenticated_all" ON public.editable_content;
CREATE POLICY "editable_content_authenticated_all" ON public.editable_content FOR ALL TO authenticated USING (true) WITH CHECK (true);
