-- Create repair_orders table
CREATE TABLE repair_orders (
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

-- Create index for tracking code lookups
CREATE INDEX idx_repair_orders_tracking_code ON repair_orders(tracking_code);

-- Create index for status filtering
CREATE INDEX idx_repair_orders_status ON repair_orders(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_repair_orders_updated_at 
  BEFORE UPDATE ON repair_orders 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE repair_orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access for tracking
CREATE POLICY "Allow public read access for tracking" ON repair_orders
  FOR SELECT USING (true);

-- Create policy to allow public insert for new orders
CREATE POLICY "Allow public insert" ON repair_orders
  FOR INSERT WITH CHECK (true);

-- Create policy to allow public update (for status updates by admins)
CREATE POLICY "Allow public update" ON repair_orders
  FOR UPDATE USING (true);