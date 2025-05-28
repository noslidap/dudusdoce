/*
  # Create and seed products table

  1. New Tables
    - None (products table already exists)
  
  2. Changes
    - Insert product data into the existing products table
    
  3. Security
    - No changes to existing RLS policies
*/

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert products if they don't exist
INSERT INTO products (id, name, description, image, featured, is_new, "order")
VALUES
  ('pudim-tradicional', 'Pudim Tradicional', 'O clássico pudim de leite condensado, cremoso e com uma calda dourada perfeita.', 'https://raw.githubusercontent.com/your-repo/pudim-tradicional.png', true, false, 0),
  ('pudim-chocolate', 'Pudim de Chocolate', 'Pudim de chocolate belga com calda de chocolate meio amargo.', 'https://raw.githubusercontent.com/your-repo/pudim-chocolate.png', false, false, 1),
  ('pudim-doce-de-leite', 'Pudim de Doce de Leite', 'Pudim com doce de leite argentino, uma combinação irresistível.', 'https://raw.githubusercontent.com/your-repo/pudim-doce-de-leite.png', true, false, 2),
  ('pudim-ninho-nutella', 'Pudim de Ninho com Nutella', 'A combinação perfeita de leite Ninho com Nutella.', 'https://raw.githubusercontent.com/your-repo/pudim-ninho-nutella.png', false, false, 3),
  ('pudim-pistache', 'Pudim de Pistache', 'Pudim de pistache importado com pedaços crocantes.', 'https://raw.githubusercontent.com/your-repo/pudim-pistache.png', false, false, 4),
  ('pudim-brigadeiro', 'Pudim de Brigadeiro', 'Pudim com brigadeiro cremoso e granulado.', 'https://raw.githubusercontent.com/your-repo/pudim-brigadeiro.png', false, false, 5),
  ('pudim-chocolate-branco', 'Pudim de Chocolate Branco', 'Pudim de chocolate branco belga com calda especial.', 'https://raw.githubusercontent.com/your-repo/pudim-chocolate-branco.png', false, false, 6),
  ('pudim-chocolate-suico', 'Pudim de Chocolate Suíço', 'Pudim de chocolate suíço premium com calda especial.', 'https://raw.githubusercontent.com/your-repo/pudim-chocolate-suico.png', false, false, 7),
  ('pudim-pacoca', 'Pudim de Paçoca', 'Pudim com paçoca artesanal e calda de amendoim.', 'https://raw.githubusercontent.com/your-repo/pudim-pacoca.png', false, true, 8)
ON CONFLICT (id) DO UPDATE 
SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  featured = EXCLUDED.featured,
  is_new = EXCLUDED.is_new,
  "order" = EXCLUDED."order";

-- Atualizar o pudim de ninho com nutella para não ser mais novidade
UPDATE products 
SET is_new = false 
WHERE id = 'pudim-ninho-nutella';