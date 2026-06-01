-- Bistró OS — Migración: Capacidad de mesas y disponibilidad para reservas
-- Ejecutar en Supabase SQL Editor (seguro, idempotente)
--
-- Agrega:
--   1. Vista  v_branch_capacity      — capacidad total por sucursal + desglose por área
--   2. Función available_tables_for_reservation() — mesas libres para fecha/hora/personas
--   3. Políticas RLS para que n8n (y futuros clientes) puedan escribir reservas y eventos
--
-- Requiere que schema.sql ya haya sido ejecutado (tablas branches, restaurants,
-- restaurant_tables, reservations, events existen).

-- ────────────────────────────────────────────────────────────────────────────
-- 1. VISTA: v_branch_capacity
--    Muestra cuántas mesas y cuántos cubiertos tiene cada sucursal,
--    con desglose por área (salón, terraza, privado, etc.).
--    Útil para el dashboard y para que n8n consulte antes de crear una reserva.
-- ────────────────────────────────────────────────────────────────────────────
DROP VIEW IF EXISTS v_branch_capacity;

CREATE VIEW v_branch_capacity AS
SELECT
  b.id                                                              AS branch_id,
  b.name                                                            AS branch_name,
  r.id                                                              AS restaurant_id,
  r.name                                                            AS restaurant_name,

  -- Totales globales
  COUNT(t.id)                                                       AS total_tables,
  COALESCE(SUM(t.capacity), 0)                                      AS total_seats,

  -- Solo mesas en estado 'available'
  COUNT(t.id)   FILTER (WHERE t.status = 'available')               AS available_tables,
  COALESCE(SUM(t.capacity) FILTER (WHERE t.status = 'available'), 0) AS available_seats,

  -- Desglose por área: [{area, tables, seats}]
  COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'area',     t.area,
        'tables',   area_counts.cnt,
        'seats',    area_counts.seats
      )
      ORDER BY t.area
    ) FILTER (WHERE t.area IS NOT NULL),
    '[]'::jsonb
  )                                                                 AS areas_detail

FROM branches b
JOIN restaurants r ON r.id = b.restaurant_id
LEFT JOIN restaurant_tables t ON t.branch_id = b.id
LEFT JOIN LATERAL (
  SELECT
    t2.area,
    COUNT(*)        AS cnt,
    SUM(t2.capacity) AS seats
  FROM restaurant_tables t2
  WHERE t2.branch_id = b.id
    AND t2.area = t.area
  GROUP BY t2.area
) area_counts ON true
GROUP BY b.id, b.name, r.id, r.name;

-- Consultas de ejemplo:
--   SELECT * FROM v_branch_capacity;
--   SELECT restaurant_name, branch_name, total_seats, available_seats
--   FROM v_branch_capacity ORDER BY restaurant_name;


-- ────────────────────────────────────────────────────────────────────────────
-- 2. FUNCIÓN: available_tables_for_reservation(branch_id, date, time, party_size)
--    Devuelve las mesas libres para una fecha+hora+cantidad de personas dadas.
--    "Libre" = status='available' + sin reserva pendiente/confirmada en ese slot.
--    Ordena por capacidad ascendente → la primera es la mesa más ajustada.
--
--    Uso desde Supabase REST (n8n):
--      POST /rest/v1/rpc/available_tables_for_reservation
--      Body: { "p_branch_id": "...", "p_date": "2026-06-05",
--              "p_time": "21:00:00", "p_party_size": 4 }
-- ────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION available_tables_for_reservation(
  p_branch_id   uuid,
  p_date        date,
  p_time        time,
  p_party_size  integer
)
RETURNS TABLE (
  table_id   uuid,
  label      text,
  area       text,
  capacity   integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    t.id        AS table_id,
    t.label,
    t.area,
    t.capacity
  FROM restaurant_tables t
  WHERE t.branch_id  = p_branch_id
    AND t.capacity   >= p_party_size
    AND t.status     = 'available'
    AND t.id NOT IN (
      SELECT r.table_id
      FROM   reservations r
      WHERE  r.branch_id        = p_branch_id
        AND  r.reservation_date = p_date
        AND  r.reservation_time = p_time
        AND  r.status           NOT IN ('cancelled')
        AND  r.table_id         IS NOT NULL
    )
  ORDER BY t.capacity ASC;
$$;

-- Consulta de ejemplo:
--   SELECT * FROM available_tables_for_reservation(
--     '22222222-0000-0000-0000-000000000010',  -- branch_id Casa Norte
--     '2026-06-05',
--     '21:00:00',
--     4
--   );


-- ────────────────────────────────────────────────────────────────────────────
-- 3. POLÍTICAS RLS — escritura de reservas y eventos desde n8n / bots externos
--    La clave usada en n8n (sb_secret_...) es service_role y ya bypasea RLS.
--    Estas políticas cubren el caso futuro de usar la clave anon o un JWT
--    de un usuario autenticado externo.
-- ────────────────────────────────────────────────────────────────────────────

-- Reservas: permitir INSERT desde cualquier rol autenticado o anon
-- (la validación de negocio la hace la app / n8n, no la policy)
DROP POLICY IF EXISTS "allow insert reservations" ON reservations;
CREATE POLICY "allow insert reservations"
  ON reservations
  FOR INSERT
  WITH CHECK (true);

-- Reservas: permitir leer las propias reservas (anon puede leer todo por ahora)
DROP POLICY IF EXISTS "allow select reservations" ON reservations;
CREATE POLICY "allow select reservations"
  ON reservations
  FOR SELECT
  USING (true);

-- Reservas: permitir update de estado (para que la app cambie pending → confirmed)
DROP POLICY IF EXISTS "allow update reservations" ON reservations;
CREATE POLICY "allow update reservations"
  ON reservations
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Eventos: permitir INSERT (n8n registra eventos de reserva)
DROP POLICY IF EXISTS "allow insert events" ON events;
CREATE POLICY "allow insert events"
  ON events
  FOR INSERT
  WITH CHECK (true);

-- Eventos: permitir SELECT (para auditoría desde la app)
DROP POLICY IF EXISTS "allow select events" ON events;
CREATE POLICY "allow select events"
  ON events
  FOR SELECT
  USING (true);

-- restaurant_tables: permitir SELECT (n8n consulta mesas disponibles)
DROP POLICY IF EXISTS "allow select restaurant_tables" ON restaurant_tables;
CREATE POLICY "allow select restaurant_tables"
  ON restaurant_tables
  FOR SELECT
  USING (true);

-- restaurants: permitir SELECT (n8n busca por nombre)
DROP POLICY IF EXISTS "allow select restaurants" ON restaurants;
CREATE POLICY "allow select restaurants"
  ON restaurants
  FOR SELECT
  USING (true);

-- branches: permitir SELECT (n8n busca sucursal por restaurant_id)
DROP POLICY IF EXISTS "allow select branches" ON branches;
CREATE POLICY "allow select branches"
  ON branches
  FOR SELECT
  USING (true);


-- ────────────────────────────────────────────────────────────────────────────
-- VERIFICACIÓN — copiar y correr por separado
-- ────────────────────────────────────────────────────────────────────────────
-- 1. Capacidad por restaurante:
--   SELECT restaurant_name, branch_name, total_tables, total_seats,
--          available_tables, available_seats
--   FROM v_branch_capacity
--   ORDER BY restaurant_name;
--
-- 2. Mesas disponibles para una reserva:
--   SELECT * FROM available_tables_for_reservation(
--     '22222222-0000-0000-0000-000000000010',
--     CURRENT_DATE + 1,
--     '21:00:00',
--     4
--   );
--
-- 3. Ver reservas creadas desde Telegram:
--   SELECT customer_name, customer_contact, reservation_date, reservation_time,
--          party_size, status, metadata->>'source', metadata->>'assigned_table_label'
--   FROM reservations
--   WHERE metadata->>'source' IN ('telegram_audio','telegram_text')
--   ORDER BY created_at DESC
--   LIMIT 10;
