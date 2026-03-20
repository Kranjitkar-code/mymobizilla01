-- Enable required extension for UUID and random code generation
create extension if not exists pgcrypto;

-- Utility: updated_at trigger
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  price_inr integer not null,
  discount_percent integer not null default 0,
  specs jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_products_updated_at
before update on public.products
for each row execute function public.update_updated_at_column();

-- Product images
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  url text not null,
  alt text,
  sort_order int default 0
);

-- Services (repair)
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price_inr integer,
  duration_minutes int,
  created_at timestamptz not null default now()
);

-- Repair bookings
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  public_code text not null unique default encode(gen_random_bytes(6), 'hex'),
  name text not null,
  email text,
  phone text,
  device_brand text,
  device_model text,
  issue_description text,
  service_id uuid references public.services(id) on delete set null,
  preferred_date date,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- Buyback models base prices
create table if not exists public.buyback_models (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model text not null,
  base_price_inr integer not null,
  unique (brand, model)
);

-- Buyback quote submissions
create table if not exists public.buyback_quotes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  brand text not null,
  model text not null,
  condition text not null,
  estimated_price_inr integer not null,
  created_at timestamptz not null default now()
);

-- Courses
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  price_inr integer,
  level text,
  created_at timestamptz not null default now()
);

-- Enrollments
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  created_at timestamptz not null default now()
);

-- Blog posts
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image_url text,
  published_at timestamptz,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

-- Videos (gallery)
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  youtube_id text not null,
  description text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- Contact messages
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  message text not null,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_categories_slug on public.categories(slug);

-- Enable RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.services enable row level security;
alter table public.bookings enable row level security;
alter table public.buyback_models enable row level security;
alter table public.buyback_quotes enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.blog_posts enable row level security;
alter table public.videos enable row level security;
alter table public.contact_messages enable row level security;

-- Public read policies for catalog-like data
create policy if not exists "categories_public_read" on public.categories for select using (true);
create policy if not exists "products_public_read" on public.products for select using (is_active);
create policy if not exists "product_images_public_read" on public.product_images for select using (true);
create policy if not exists "services_public_read" on public.services for select using (true);
create policy if not exists "courses_public_read" on public.courses for select using (true);
create policy if not exists "videos_public_read" on public.videos for select using (true);
create policy if not exists "buyback_models_public_read" on public.buyback_models for select using (true);

-- Blog: only published visible
create policy if not exists "blog_public_read_published" on public.blog_posts for select using (status = 'published');

-- Insert-only submissions (anonymous allowed)
create policy if not exists "bookings_insert_anyone" on public.bookings for insert with check (true);
create policy if not exists "buyback_quotes_insert_anyone" on public.buyback_quotes for insert with check (true);
create policy if not exists "enrollments_insert_anyone" on public.enrollments for insert with check (true);
create policy if not exists "contact_messages_insert_anyone" on public.contact_messages for insert with check (true);
