-- Product reviews
create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  name text not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

-- Discount codes
create table if not exists public.discount_codes (
  code text primary key,
  description text,
  percent_off int check (percent_off between 0 and 100),
  amount_off_inr integer,
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz
);

-- RLS
alter table public.product_reviews enable row level security;
alter table public.discount_codes enable row level security;

create policy if not exists "reviews_public_read" on public.product_reviews for select using (true);
create policy if not exists "reviews_insert_anyone" on public.product_reviews for insert with check (true);
create policy if not exists "discount_codes_public_read" on public.discount_codes for select using (is_active);

-- Extend bookings with customer_type
alter table public.bookings add column if not exists customer_type text default 'b2c';


