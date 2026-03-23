-- ============================================================
-- MOBIZILLA NEPAL LOCALIZATION MIGRATION
-- Legacy India/INR schema → Mobizilla Nepal (NPR)
-- Idempotent: skips renames if columns are already NPR or missing.
-- ============================================================

-- Products
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'price_inr'
  ) THEN
    ALTER TABLE public.products RENAME COLUMN price_inr TO price_npr;
  END IF;
END $$;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS vat_inclusive boolean DEFAULT true;

-- Services
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'services' AND column_name = 'price_inr'
  ) THEN
    ALTER TABLE public.services RENAME COLUMN price_inr TO price_npr;
  END IF;
END $$;

-- Buyback models
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'buyback_models' AND column_name = 'base_price_inr'
  ) THEN
    ALTER TABLE public.buyback_models RENAME COLUMN base_price_inr TO base_price_npr;
  END IF;
END $$;

-- Buyback quotes
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'buyback_quotes' AND column_name = 'estimated_price_inr'
  ) THEN
    ALTER TABLE public.buyback_quotes RENAME COLUMN estimated_price_inr TO estimated_price_npr;
  END IF;
END $$;

-- Courses
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'price_inr'
  ) THEN
    ALTER TABLE public.courses RENAME COLUMN price_inr TO price_npr;
  END IF;
END $$;

-- Orders
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'shipping_fee_inr'
  ) THEN
    ALTER TABLE public.orders RENAME COLUMN shipping_fee_inr TO shipping_fee_npr;
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'subtotal_inr'
  ) THEN
    ALTER TABLE public.orders RENAME COLUMN subtotal_inr TO subtotal_npr;
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'total_inr'
  ) THEN
    ALTER TABLE public.orders RENAME COLUMN total_inr TO total_npr;
  END IF;
END $$;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS vat_amount_npr integer DEFAULT 0;

-- Order items
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'order_items' AND column_name = 'unit_price_inr'
  ) THEN
    ALTER TABLE public.order_items RENAME COLUMN unit_price_inr TO unit_price_npr;
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'order_items' AND column_name = 'line_total_inr'
  ) THEN
    ALTER TABLE public.order_items RENAME COLUMN line_total_inr TO line_total_npr;
  END IF;
END $$;

-- Repair orders: Nepal-specific columns (split so partial runs are safe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'repair_orders') THEN
    ALTER TABLE public.repair_orders ADD COLUMN IF NOT EXISTS vat_amount_npr integer DEFAULT 0;
    ALTER TABLE public.repair_orders ADD COLUMN IF NOT EXISTS city text DEFAULT 'Kathmandu';
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'repair_orders' AND column_name = 'customer_source'
    ) THEN
      ALTER TABLE public.repair_orders ADD COLUMN customer_source text DEFAULT 'walk_in'
        CHECK (customer_source IN ('walk_in','online','corporate','academy','referral'));
    END IF;
  END IF;
END $$;

-- Settings
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'settings') THEN
    ALTER TABLE public.settings ALTER COLUMN currency_code SET DEFAULT 'NPR';
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'settings' AND column_name = 'flat_rate_inr'
    ) THEN
      ALTER TABLE public.settings RENAME COLUMN flat_rate_inr TO flat_rate_npr;
    END IF;
    ALTER TABLE public.settings ALTER COLUMN tax_percent SET DEFAULT 13;
    ALTER TABLE public.settings ALTER COLUMN payment_providers SET DEFAULT '["esewa","khalti","connectips","fonepay"]'::jsonb;
    ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS shipping_zones jsonb DEFAULT
      '[
        {"name":"Kathmandu Valley","fee":0,"label":"Free"},
        {"name":"Outside Valley","fee":200,"label":"NPR 200"},
        {"name":"International","fee":1500,"label":"NPR 1500"}
      ]';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'settings') THEN
    UPDATE public.settings SET
      currency_code = 'NPR',
      tax_percent = 13,
      payment_providers = '["esewa","khalti","connectips","fonepay"]'
    WHERE id = true;
  END IF;
END $$;

-- Enrollments
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'enrollments')
     AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'enrollments' AND column_name = 'batch_preference'
  ) THEN
    ALTER TABLE public.enrollments ADD COLUMN batch_preference text DEFAULT 'morning'
      CHECK (batch_preference IN ('morning', 'afternoon'));
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'repair_orders') THEN
    EXECUTE 'COMMENT ON TABLE public.repair_orders IS ''Mobizilla Nepal repair bookings — tracking prefix: SNP''';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'courses') THEN
    EXECUTE 'COMMENT ON TABLE public.courses IS ''Mobizilla Academy courses''';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
    EXECUTE 'COMMENT ON TABLE public.products IS ''Mobizilla Store products — prices in NPR''';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders') THEN
    EXECUTE 'COMMENT ON TABLE public.orders IS ''Mobizilla Store orders — amounts in NPR with 13% VAT''';
  END IF;
END $$;
