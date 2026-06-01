-- Bistró OS — Seed: Restaurantes demo completos
-- Compatible con schema.sql Fase 4A (sin columna slug todavía)
-- Ejecutar en Supabase SQL Editor — seguro con ON CONFLICT DO NOTHING
-- Crea: Bistró Palermo, Casa Norte, La Mesa Dorada + sucursales + mesas
--
-- IDs fijos para consistencia entre entornos:
--   Bistró Palermo   restaurant: 11111111-0000-0000-0000-000000000001
--   Casa Norte        restaurant: 22222222-0000-0000-0000-000000000001
--   La Mesa Dorada   restaurant: 33333333-0000-0000-0000-000000000001

-- ──────────────────────────────────────────────
-- RESTAURANTES
-- ──────────────────────────────────────────────
INSERT INTO restaurants (id, name, email, phone, city, country, plan, metadata)
VALUES
  (
    '11111111-0000-0000-0000-000000000001',
    'Bistro Palermo',
    'info@bistro-palermo.com',
    '+54 11 5555 1101',
    'Buenos Aires', 'Argentina', 'Pro',
    '{"slug":"bistro-palermo","carta_url":"https://bistro-os.vercel.app/carta/bistro-palermo","source":"seed_demo"}'::jsonb
  ),
  (
    '22222222-0000-0000-0000-000000000001',
    'Casa Norte',
    'info@casanorte.com',
    '+54 11 5555 2201',
    'Buenos Aires', 'Argentina', 'Pro',
    '{"slug":"casa-norte","carta_url":"https://bistro-os.vercel.app/carta/casa-norte","source":"seed_demo"}'::jsonb
  ),
  (
    '33333333-0000-0000-0000-000000000001',
    'La Mesa Dorada',
    'info@lamesadorada.com',
    '+54 11 5555 3301',
    'Buenos Aires', 'Argentina', 'Starter',
    '{"slug":"la-mesa-dorada","carta_url":"https://bistro-os.vercel.app/carta/la-mesa-dorada","source":"seed_demo"}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────
-- SUCURSALES
-- ──────────────────────────────────────────────
INSERT INTO branches (id, restaurant_id, name, address, city, phone, opening_hours, metadata)
VALUES
  (
    '11111111-0000-0000-0000-000000000010',
    '11111111-0000-0000-0000-000000000001',
    'Palermo Soho',
    'Thames 1234', 'Buenos Aires', '+54 11 5555 1102',
    '{"mon":"12:00-00:00","tue":"12:00-00:00","wed":"12:00-00:00","thu":"12:00-00:00","fri":"12:00-01:00","sat":"12:00-01:00","sun":"12:00-23:30"}'::jsonb,
    '{"source":"seed_demo"}'::jsonb
  ),
  (
    '22222222-0000-0000-0000-000000000010',
    '22222222-0000-0000-0000-000000000001',
    'Casa Norte Central',
    'Av. Cabildo 567', 'Buenos Aires', '+54 11 5555 2202',
    '{"mon":"12:00-23:30","tue":"12:00-23:30","wed":"12:00-23:30","thu":"12:00-23:30","fri":"12:00-00:30","sat":"12:00-00:30","sun":"12:00-23:00"}'::jsonb,
    '{"source":"seed_demo"}'::jsonb
  ),
  (
    '33333333-0000-0000-0000-000000000010',
    '33333333-0000-0000-0000-000000000001',
    'La Mesa Dorada Microcentro',
    'Florida 789', 'Buenos Aires', '+54 11 5555 3302',
    '{"mon":"11:00-23:00","tue":"11:00-23:00","wed":"11:00-23:00","thu":"11:00-23:00","fri":"11:00-23:30","sat":"12:00-23:30","sun":"13:00-22:00"}'::jsonb,
    '{"source":"seed_demo"}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────
-- MESAS — Bistró Palermo
-- ──────────────────────────────────────────────
INSERT INTO restaurant_tables (id, branch_id, label, area, capacity, status, metadata)
VALUES
  ('11111111-0001-0000-0000-000000000001', '11111111-0000-0000-0000-000000000010', 'Mesa 1', 'salón',   2, 'available', '{"source":"seed_demo"}'::jsonb),
  ('11111111-0002-0000-0000-000000000001', '11111111-0000-0000-0000-000000000010', 'Mesa 2', 'salón',   2, 'available', '{"source":"seed_demo"}'::jsonb),
  ('11111111-0003-0000-0000-000000000001', '11111111-0000-0000-0000-000000000010', 'Mesa 3', 'salón',   4, 'available', '{"source":"seed_demo"}'::jsonb),
  ('11111111-0004-0000-0000-000000000001', '11111111-0000-0000-0000-000000000010', 'Mesa 4', 'terraza', 4, 'available', '{"source":"seed_demo"}'::jsonb),
  ('11111111-0005-0000-0000-000000000001', '11111111-0000-0000-0000-000000000010', 'Mesa 5', 'terraza', 6, 'available', '{"source":"seed_demo"}'::jsonb),
  ('11111111-0006-0000-0000-000000000001', '11111111-0000-0000-0000-000000000010', 'Mesa 6', 'privado', 8, 'available', '{"source":"seed_demo"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────
-- MESAS — Casa Norte
-- ──────────────────────────────────────────────
INSERT INTO restaurant_tables (id, branch_id, label, area, capacity, status, metadata)
VALUES
  ('22222222-0001-0000-0000-000000000001', '22222222-0000-0000-0000-000000000010', 'Mesa 1', 'salón',   2, 'available', '{"source":"seed_demo"}'::jsonb),
  ('22222222-0002-0000-0000-000000000001', '22222222-0000-0000-0000-000000000010', 'Mesa 2', 'salón',   2, 'available', '{"source":"seed_demo"}'::jsonb),
  ('22222222-0003-0000-0000-000000000001', '22222222-0000-0000-0000-000000000010', 'Mesa 3', 'salón',   4, 'available', '{"source":"seed_demo"}'::jsonb),
  ('22222222-0004-0000-0000-000000000001', '22222222-0000-0000-0000-000000000010', 'Mesa 4', 'barra',   4, 'available', '{"source":"seed_demo"}'::jsonb),
  ('22222222-0005-0000-0000-000000000001', '22222222-0000-0000-0000-000000000010', 'Mesa 5', 'fondo',   6, 'available', '{"source":"seed_demo"}'::jsonb),
  ('22222222-0006-0000-0000-000000000001', '22222222-0000-0000-0000-000000000010', 'Mesa 6', 'privado', 8, 'available', '{"source":"seed_demo"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────
-- MESAS — La Mesa Dorada
-- ──────────────────────────────────────────────
INSERT INTO restaurant_tables (id, branch_id, label, area, capacity, status, metadata)
VALUES
  ('33333333-0001-0000-0000-000000000001', '33333333-0000-0000-0000-000000000010', 'Mesa 1', 'salón',   2, 'available', '{"source":"seed_demo"}'::jsonb),
  ('33333333-0002-0000-0000-000000000001', '33333333-0000-0000-0000-000000000010', 'Mesa 2', 'salón',   4, 'available', '{"source":"seed_demo"}'::jsonb),
  ('33333333-0003-0000-0000-000000000001', '33333333-0000-0000-0000-000000000010', 'Mesa 3', 'ventana', 4, 'available', '{"source":"seed_demo"}'::jsonb),
  ('33333333-0004-0000-0000-000000000001', '33333333-0000-0000-0000-000000000010', 'Mesa 4', 'terraza', 6, 'available', '{"source":"seed_demo"}'::jsonb),
  ('33333333-0005-0000-0000-000000000001', '33333333-0000-0000-0000-000000000010', 'Mesa 5', 'privado', 8, 'available', '{"source":"seed_demo"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────
-- ACTUALIZAR carta_url si los restaurantes YA existen
-- Correr solo si ya hiciste el INSERT y necesitás agregar carta_url
-- ──────────────────────────────────────────────
-- UPDATE restaurants SET metadata = metadata || '{"carta_url":"https://bistro-os.vercel.app/carta/bistro-palermo"}'::jsonb WHERE metadata->>'slug' = 'bistro-palermo';
-- UPDATE restaurants SET metadata = metadata || '{"carta_url":"https://bistro-os.vercel.app/carta/casa-norte"}'::jsonb WHERE metadata->>'slug' = 'casa-norte';
-- UPDATE restaurants SET metadata = metadata || '{"carta_url":"https://bistro-os.vercel.app/carta/la-mesa-dorada"}'::jsonb WHERE metadata->>'slug' = 'la-mesa-dorada';

-- ──────────────────────────────────────────────
-- VERIFICACIÓN (copiar y correr por separado)
-- ──────────────────────────────────────────────
-- SELECT r.name, b.name as branch, count(t.id) as mesas
-- FROM restaurants r
-- JOIN branches b ON b.restaurant_id = r.id
-- LEFT JOIN restaurant_tables t ON t.branch_id = b.id
-- WHERE r.metadata->>'source' = 'seed_demo'
-- GROUP BY r.name, b.name
-- ORDER BY r.name;
