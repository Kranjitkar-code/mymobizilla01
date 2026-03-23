-- Align repair_orders with admin UI (Orders page) and tighten RLS (no anonymous updates).

ALTER TABLE public.repair_orders ADD COLUMN IF NOT EXISTS admin_notes text;
ALTER TABLE public.repair_orders ADD COLUMN IF NOT EXISTS technician_name text;
ALTER TABLE public.repair_orders ADD COLUMN IF NOT EXISTS service_type text DEFAULT 'repair';

ALTER TABLE public.repair_orders DROP CONSTRAINT IF EXISTS repair_orders_status_check;
ALTER TABLE public.repair_orders ADD CONSTRAINT repair_orders_status_check
  CHECK (status IN ('pending', 'in_progress', 'ready', 'completed', 'cancelled'));

DROP POLICY IF EXISTS "Allow public update" ON public.repair_orders;

DROP POLICY IF EXISTS "repair_orders_authenticated_all" ON public.repair_orders;
CREATE POLICY "repair_orders_authenticated_all"
  ON public.repair_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
