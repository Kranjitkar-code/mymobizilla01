-- Create repair_orders table (idempotent: safe if table already exists on remote)
CREATE TABLE IF NOT EXISTS public.repair_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_category TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  issue TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  tracking_code TEXT UNIQUE NOT NULL,
  estimated_cost INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_repair_orders_tracking_code ON public.repair_orders(tracking_code);
CREATE INDEX IF NOT EXISTS idx_repair_orders_status ON public.repair_orders(status);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_repair_orders_updated_at ON public.repair_orders;
CREATE TRIGGER update_repair_orders_updated_at
  BEFORE UPDATE ON public.repair_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.repair_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access for tracking" ON public.repair_orders;
CREATE POLICY "Allow public read access for tracking" ON public.repair_orders
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert" ON public.repair_orders;
CREATE POLICY "Allow public insert" ON public.repair_orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update" ON public.repair_orders;
CREATE POLICY "Allow public update" ON public.repair_orders
  FOR UPDATE USING (true);
