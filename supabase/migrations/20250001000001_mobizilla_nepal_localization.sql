-- ============================================================
-- MOBIZILLA NEPAL LOCALIZATION MIGRATION
-- Converts SnapTechFix (India/INR) → Mobizilla Nepal (NPR)
-- ============================================================

-- Products: rename price column
ALTER TABLE products RENAME COLUMN price_inr TO price_npr;
ALTER TABLE products ADD COLUMN IF NOT EXISTS vat_inclusive boolean DEFAULT true;

-- Services: rename price column
ALTER TABLE services RENAME COLUMN price_inr TO price_npr;

-- Buyback models: rename base price column
ALTER TABLE buyback_models RENAME COLUMN base_price_inr TO base_price_npr;

-- Buyback quotes: rename estimated price column
ALTER TABLE buyback_quotes RENAME COLUMN estimated_price_inr TO estimated_price_npr;

-- Courses: rename price column
ALTER TABLE courses RENAME COLUMN price_inr TO price_npr;

-- Orders: rename columns and add VAT
ALTER TABLE orders RENAME COLUMN shipping_fee_inr TO shipping_fee_npr;
ALTER TABLE orders RENAME COLUMN subtotal_inr TO subtotal_npr;
ALTER TABLE orders RENAME COLUMN total_inr TO total_npr;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS vat_amount_npr integer DEFAULT 0;

-- Order items: rename columns
ALTER TABLE order_items RENAME COLUMN unit_price_inr TO unit_price_npr;
ALTER TABLE order_items RENAME COLUMN line_total_inr TO line_total_npr;

-- Repair orders: add Nepal-specific columns
ALTER TABLE repair_orders
  ADD COLUMN IF NOT EXISTS vat_amount_npr integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS city text DEFAULT 'Kathmandu',
  ADD COLUMN IF NOT EXISTS customer_source text DEFAULT 'walk_in'
    CHECK (customer_source IN ('walk_in','online','corporate','academy','referral'));

-- Settings: update to Nepal defaults
ALTER TABLE settings ALTER COLUMN currency_code SET DEFAULT 'NPR';
ALTER TABLE settings RENAME COLUMN flat_rate_inr TO flat_rate_npr;
ALTER TABLE settings ALTER COLUMN tax_percent SET DEFAULT 13;
ALTER TABLE settings ALTER COLUMN payment_providers SET DEFAULT '["esewa","khalti","connectips","fonepay"]'::jsonb;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS shipping_zones jsonb DEFAULT
  '[
    {"name":"Kathmandu Valley","fee":0,"label":"Free"},
    {"name":"Outside Valley","fee":200,"label":"NPR 200"},
    {"name":"International","fee":1500,"label":"NPR 1500"}
  ]';

UPDATE settings SET
  currency_code = 'NPR',
  tax_percent = 13,
  payment_providers = '["esewa","khalti","connectips","fonepay"]'
WHERE id = true;

-- Enrollments: add batch preference for Mobizilla Academy
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS batch_preference text DEFAULT 'morning'
  CHECK (batch_preference IN ('morning', 'afternoon'));

COMMENT ON TABLE repair_orders IS 'Mobizilla Nepal repair bookings — tracking prefix: SNP';
COMMENT ON TABLE courses IS 'Mobizilla Academy courses';
COMMENT ON TABLE products IS 'Mobizilla Store products — prices in NPR';
COMMENT ON TABLE orders IS 'Mobizilla Store orders — amounts in NPR with 13% VAT';
