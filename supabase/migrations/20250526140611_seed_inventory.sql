/*
  # Seed inventory data

  1. Changes
    - Insert inventory data for all products
    - Set initial stock and prices for each size
*/

-- Insert inventory data for each product
INSERT INTO inventory (product_id, size, available_quantity, price)
VALUES
  -- Pudim Tradicional
  ('pudim-tradicional', '80ml', 50, 8.00),
  ('pudim-tradicional', '120ml', 50, 10.00),
  ('pudim-tradicional', '250ml', 50, 18.50),
  ('pudim-tradicional', '500ml', 50, 35.00),
  ('pudim-tradicional', '1000ml', 50, 69.50),

  -- Pudim de Chocolate
  ('pudim-chocolate', '80ml', 50, 9.00),
  ('pudim-chocolate', '120ml', 50, 12.50),
  ('pudim-chocolate', '250ml', 50, 22.90),
  ('pudim-chocolate', '500ml', 50, 41.00),
  ('pudim-chocolate', '1000ml', 50, 69.50),

  -- Pudim de Doce de Leite
  ('pudim-doce-de-leite', '80ml', 50, 9.50),
  ('pudim-doce-de-leite', '120ml', 50, 13.00),
  ('pudim-doce-de-leite', '250ml', 50, 24.00),
  ('pudim-doce-de-leite', '500ml', 50, 43.00),
  ('pudim-doce-de-leite', '1000ml', 50, 72.00),

  -- Pudim Ninho com Nutella
  ('pudim-ninho-nutella', '80ml', 50, 12.90),
  ('pudim-ninho-nutella', '120ml', 50, 14.90),
  ('pudim-ninho-nutella', '250ml', 50, 26.90),
  ('pudim-ninho-nutella', '500ml', 50, 47.00),
  ('pudim-ninho-nutella', '1000ml', 50, 85.00),

  -- Pudim de Pistache
  ('pudim-pistache', '80ml', 50, 12.90),
  ('pudim-pistache', '120ml', 50, 14.90),
  ('pudim-pistache', '250ml', 50, 26.90),
  ('pudim-pistache', '500ml', 50, 47.00),
  ('pudim-pistache', '1000ml', 50, 85.00),

  -- Pudim de Brigadeiro
  ('pudim-brigadeiro', '80ml', 50, 9.50),
  ('pudim-brigadeiro', '120ml', 50, 13.00),
  ('pudim-brigadeiro', '250ml', 50, 24.00),
  ('pudim-brigadeiro', '500ml', 50, 43.00),
  ('pudim-brigadeiro', '1000ml', 50, 72.00),

  -- Pudim de Chocolate Branco
  ('pudim-chocolate-branco', '80ml', 50, 9.50),
  ('pudim-chocolate-branco', '120ml', 50, 13.00),
  ('pudim-chocolate-branco', '250ml', 50, 24.00),
  ('pudim-chocolate-branco', '500ml', 50, 43.00),
  ('pudim-chocolate-branco', '1000ml', 50, 72.00),

  -- Pudim de Chocolate Suíço
  ('pudim-chocolate-suico', '80ml', 50, 11.50),
  ('pudim-chocolate-suico', '120ml', 50, 14.90),
  ('pudim-chocolate-suico', '250ml', 50, 26.90),
  ('pudim-chocolate-suico', '500ml', 50, 45.00),
  ('pudim-chocolate-suico', '1000ml', 50, 82.50),

  -- Pudim de Paçoca
  ('pudim-pacoca', '80ml', 50, 9.50),
  ('pudim-pacoca', '120ml', 50, 13.00),
  ('pudim-pacoca', '250ml', 50, 24.00),
  ('pudim-pacoca', '500ml', 50, 43.00),
  ('pudim-pacoca', '1000ml', 50, 72.00)
ON CONFLICT (product_id, size) DO UPDATE 
SET 
  available_quantity = EXCLUDED.available_quantity,
  price = EXCLUDED.price; 