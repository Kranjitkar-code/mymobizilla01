-- Idempotent: public site may only SELECT published rows on blogs (drafts stay private).
-- Safe if 20260323000001 already created blogs_public_read_published.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'blogs') THEN
    EXECUTE 'DROP POLICY IF EXISTS "public_read_blogs" ON public.blogs';
    EXECUTE 'DROP POLICY IF EXISTS "blogs_public_read_published" ON public.blogs';
    EXECUTE 'CREATE POLICY "blogs_public_read_published" ON public.blogs FOR SELECT USING (published = true)';
  END IF;
END $$;
