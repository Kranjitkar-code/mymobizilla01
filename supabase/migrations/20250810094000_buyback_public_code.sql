-- Add public_code to buyback quotes for tracking
alter table public.buyback_quotes add column if not exists public_code text unique default substring(md5(random()::text || clock_timestamp()::text) from 1 for 12);

