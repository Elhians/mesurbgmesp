-- Drop existing tables with dependencies
DROP TABLE IF EXISTS measurements CASCADE;
DROP TABLE IF EXISTS clients CASCADE;

-- Create the clients table
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  telephone TEXT NOT NULL,
  notes TEXT,
  epaule NUMERIC,
  masse NUMERIC,
  longueur_pantalon NUMERIC,
  longueur_chemise NUMERIC,
  cuisse NUMERIC,
  tour_de_bras NUMERIC,
  ceinture NUMERIC,
  poitrine NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index for faster searches
CREATE INDEX idx_clients_nom ON clients(nom);
CREATE INDEX idx_clients_prenom ON clients(prenom);
CREATE INDEX idx_clients_telephone ON clients(telephone);

-- Enable Row Level Security (optional, for public access disable it)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (adjust as needed)
CREATE POLICY "Allow all operations" ON clients
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
