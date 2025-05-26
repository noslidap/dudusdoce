/*
  # Create and seed products table

  1. New Tables
    - None (products table already exists)
  
  2. Changes
    - Insert product data into the existing products table
    
  3. Security
    - No changes to existing RLS policies
*/

-- Insert products if they don't exist
INSERT INTO products (id, name, description, image, featured, is_new)
VALUES
  ('pudim-tradicional', 'Pudim Tradicional', 'O clássico pudim de leite condensado, cremoso e com uma calda dourada perfeita.', 'https://raw.githubusercontent.com/your-repo/pudim-tradicional.png', true, false),
  ('pudim-chocolate', 'Pudim de Chocolate', 'Pudim de chocolate belga com calda de chocolate meio amargo.', 'https://raw.githubusercontent.com/your-repo/pudim-chocolate.png', false, false),
  ('pudim-doce-de-leite', 'Pudim de Doce de Leite', 'Pudim com doce de leite argentino, uma combinação irresistível.', 'https://raw.githubusercontent.com/your-repo/pudim-doce-de-leite.png', true, false),
  ('pudim-ninho-nutella', 'Pudim de Ninho com Nutella', 'A combinação perfeita de leite Ninho com Nutella.', 'https://raw.githubusercontent.com/your-repo/pudim-ninho-nutella.png', false, true),
  ('pudim-pistache', 'Pudim de Pistache', 'Pudim de pistache importado com pedaços crocantes.', 'https://raw.githubusercontent.com/your-repo/pudim-pistache.png', false, false),
  ('pudim-brigadeiro', 'Pudim de Brigadeiro', 'Pudim com brigadeiro cremoso e granulado.', 'https://raw.githubusercontent.com/your-repo/pudim-brigadeiro.png', false, false),
  ('pudim-chocolate-branco', 'Pudim de Chocolate Branco', 'Pudim de chocolate branco belga com calda especial.', 'https://raw.githubusercontent.com/your-repo/pudim-chocolate-branco.png', false, false),
  ('pudim-chocolate-suico', 'Pudim de Chocolate Suíço', 'Pudim de chocolate suíço premium com calda especial.', 'https://raw.githubusercontent.com/your-repo/pudim-chocolate-suico.png', false, false),
  ('pudim-pacoca', 'Pudim de Paçoca', 'Pudim com paçoca artesanal e calda de amendoim.', 'https://raw.githubusercontent.com/your-repo/pudim-pacoca.png', false, true)
ON CONFLICT (id) DO UPDATE 
SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  featured = EXCLUDED.featured,
  is_new = EXCLUDED.is_new;