-- Some Postgres/RLS setups are strict about INSERT with FOR ALL; split policies for authenticated admin CRUD.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'phone_models') THEN
    ALTER TABLE public.phone_models ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "phone_models_authenticated_insert" ON public.phone_models;
    CREATE POLICY "phone_models_authenticated_insert" ON public.phone_models
      FOR INSERT TO authenticated WITH CHECK (true);

    DROP POLICY IF EXISTS "phone_models_authenticated_update" ON public.phone_models;
    CREATE POLICY "phone_models_authenticated_update" ON public.phone_models
      FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "phone_models_authenticated_delete" ON public.phone_models;
    CREATE POLICY "phone_models_authenticated_delete" ON public.phone_models
      FOR DELETE TO authenticated USING (true);

    DROP POLICY IF EXISTS "phone_models_authenticated_select" ON public.phone_models;
    CREATE POLICY "phone_models_authenticated_select" ON public.phone_models
      FOR SELECT TO authenticated USING (true);
  END IF;
END $$;
