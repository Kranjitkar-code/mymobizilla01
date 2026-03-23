CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text,
  email text,
  phone text,
  interest text,
  message text,
  status text DEFAULT 'unread',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_insert_contact" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "admin_read_contact" ON contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "admin_update_contact" ON contact_messages
  FOR UPDATE USING (auth.role() = 'authenticated');
