-- Idempotent: align contact_messages with app + CMS (older DBs may lack columns)
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS interest text;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS status text DEFAULT 'unread';
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS admin_reply text;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS replied_at timestamptz;

-- Normalize status default when column existed without default
ALTER TABLE public.contact_messages
  ALTER COLUMN status SET DEFAULT 'unread';
