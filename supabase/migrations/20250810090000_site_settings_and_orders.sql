-- Site settings for checkout and payments
create table if not exists public.settings (
  id boolean primary key default true, -- singleton row (always true)
  currency_code text not null default 'INR',
  allow_guest_checkout boolean not null default true,
  shipping_method text not null default 'flat', -- 'flat' or 'pickup'
  flat_rate_inr integer not null default 0,
  tax_percent numeric not null default 0,
  payment_providers jsonb not null default '["gpay","paytm","phonepe"]'::jsonb,
  updated_at timestamptz not null default now()
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  public_code text not null unique default encode(gen_random_bytes(6), 'hex'),
  name text,
  email text,
  phone text,
  address_line1 text,
  address_line2 text,
  city text,
  postal_code text,
  shipping_method text not null,
  shipping_fee_inr integer not null default 0,
  tax_percent numeric not null default 0,
  subtotal_inr integer not null,
  total_inr integer not null,
  payment_provider text,
  payment_status text not null default 'unpaid', -- unpaid, paid, failed
  status text not null default 'pending', -- pending, processing, shipped, completed, cancelled
  created_at timestamptz not null default now()
);

-- Order items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  name text not null,
  unit_price_inr integer not null,
  quantity integer not null check (quantity > 0),
  line_total_inr integer not null
);

-- Basic RLS
alter table public.settings enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Public can read settings
create policy if not exists "settings_public_read" on public.settings for select using (true);

-- Anonymous can insert orders and order items
create policy if not exists "orders_insert_anyone" on public.orders for insert with check (true);
create policy if not exists "order_items_insert_anyone" on public.order_items for insert with check (true);

-- Seed a default settings row if none exists
insert into public.settings (id)
  values (true)
  on conflict (id) do nothing;


