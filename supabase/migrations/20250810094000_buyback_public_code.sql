-- Add public_code to buyback quotes for tracking
alter table public.buyback_quotes add column if not exists public_code text unique default encode(gen_random_bytes(6), 'hex');

