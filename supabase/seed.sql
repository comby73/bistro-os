-- Bistró OS — seed Fase 4A
-- Dataset mínimo para validar el modelo futuro sin conectar todavía la app.

insert into restaurants (
  id,
  name,
  legal_name,
  email,
  phone,
  city,
  country,
  plan,
  metadata
)
values (
  '00000000-0000-0000-0000-000000000001',
  'Bistró Demo',
  'Bistró Demo SRL',
  'demo@bistro-os.com',
  '+54 11 5555 0101',
  'Buenos Aires',
  'Argentina',
  'Pro',
  '{"source":"seed"}'::jsonb
)
on conflict (id) do nothing;

insert into branches (
  id,
  restaurant_id,
  name,
  address,
  city,
  phone,
  opening_hours,
  metadata
)
values (
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000001',
  'Sucursal Palermo',
  'Costa Rica 5000',
  'Buenos Aires',
  '+54 11 5555 0202',
  '{"mon":"12:00-23:30","tue":"12:00-23:30","wed":"12:00-23:30","thu":"12:00-23:30","fri":"12:00-00:30","sat":"12:00-00:30","sun":"12:00-23:00"}'::jsonb,
  '{"source":"seed"}'::jsonb
)
on conflict (id) do nothing;

insert into profiles (
  id,
  restaurant_id,
  branch_id,
  full_name,
  email,
  phone,
  metadata
)
values
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'Sofía Owner', 'owner@bistro-os.com', '+54 11 5555 1001', '{"demo_role":"owner"}'::jsonb),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'Martín Admin', 'admin@bistro-os.com', '+54 11 5555 1002', '{"demo_role":"admin"}'::jsonb),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'Carla Manager', 'manager@bistro-os.com', '+54 11 5555 1003', '{"demo_role":"manager"}'::jsonb),
  ('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'Nico Waiter', 'waiter@bistro-os.com', '+54 11 5555 1004', '{"demo_role":"waiter"}'::jsonb),
  ('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'Lucía Kitchen', 'kitchen@bistro-os.com', '+54 11 5555 1005', '{"demo_role":"kitchen"}'::jsonb)
on conflict (id) do nothing;

insert into role_assignments (
  id,
  restaurant_id,
  branch_id,
  profile_id,
  role,
  metadata
)
values
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000101', 'owner', '{"source":"seed"}'::jsonb),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000102', 'admin', '{"source":"seed"}'::jsonb),
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000103', 'manager', '{"source":"seed"}'::jsonb),
  ('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000104', 'waiter', '{"source":"seed"}'::jsonb),
  ('00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000105', 'kitchen', '{"source":"seed"}'::jsonb)
on conflict (id) do nothing;

insert into restaurant_tables (
  id,
  branch_id,
  label,
  area,
  capacity,
  status,
  metadata
)
values
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000010', 'Mesa 7', 'Salon principal', 4, 'occupied', '{"source":"seed"}'::jsonb),
  ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000010', 'Mesa 11', 'Salon principal', 4, 'reserved', '{"source":"seed"}'::jsonb),
  ('00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000010', 'Mesa 14', 'Ventana', 2, 'available', '{"source":"seed"}'::jsonb)
on conflict (id) do nothing;

insert into menu_categories (
  id,
  restaurant_id,
  branch_id,
  name,
  position,
  metadata
)
values
  ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'Entradas', 1, '{"source":"seed"}'::jsonb),
  ('00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'Principales', 2, '{"source":"seed"}'::jsonb),
  ('00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'Cocteleria', 3, '{"source":"seed"}'::jsonb)
on conflict (id) do nothing;

insert into menu_items (
  id,
  restaurant_id,
  branch_id,
  category_id,
  name,
  description,
  base_price,
  station,
  available,
  featured,
  metadata
)
values
  ('00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000401', 'Tartar de atun rojo', 'Palta, sesamo, soja citrica.', 28.00, 'cold', true, true, '{"source":"seed"}'::jsonb),
  ('00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000402', 'Risotto de hongos', 'Hongos de estacion, parmesano, aceite de trufa.', 24.00, 'hot', true, false, '{"source":"seed"}'::jsonb),
  ('00000000-0000-0000-0000-000000000503', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000402', 'Cordero patagonico', 'Pure ahumado, jugo reducido, hierbas de temporada.', 38.00, 'grill', true, true, '{"source":"seed"}'::jsonb),
  ('00000000-0000-0000-0000-000000000504', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000403', 'Negroni de la casa', 'Gin, bitter, vermut rojo, naranja.', 12.00, 'bar', true, false, '{"source":"seed"}'::jsonb)
on conflict (id) do nothing;

insert into reservations (
  id,
  restaurant_id,
  branch_id,
  table_id,
  created_by_profile_id,
  customer_name,
  customer_contact,
  reservation_date,
  reservation_time,
  party_size,
  status,
  notes,
  metadata
)
values
  ('00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000103', 'Valentina Perez', '+54 11 6000 1111', current_date, '21:00', 4, 'confirmed', 'Aniversario.', '{"source":"seed"}'::jsonb),
  ('00000000-0000-0000-0000-000000000602', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', null, '00000000-0000-0000-0000-000000000103', 'Marcos Diaz', '+54 11 6000 2222', current_date, '22:00', 2, 'pending', 'Prefiere ventana.', '{"source":"seed"}'::jsonb)
on conflict (id) do nothing;

insert into placed_orders (
  id,
  restaurant_id,
  branch_id,
  reservation_id,
  table_id,
  taken_by_profile_id,
  waiter_name_snapshot,
  status,
  total_amount,
  notes,
  metadata
)
values
  ('00000000-0000-0000-0000-000000000701', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', null, '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000104', 'Nico Waiter', 'preparing', 80.00, 'Salida primero la entrada.', '{"source":"seed"}'::jsonb),
  ('00000000-0000-0000-0000-000000000702', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000104', 'Nico Waiter', 'received', 100.00, 'Sin hielo en cocteleria.', '{"source":"seed"}'::jsonb)
on conflict (id) do nothing;

insert into order_items (
  id,
  placed_order_id,
  menu_item_id,
  name_snapshot,
  unit_price_snapshot,
  quantity,
  station,
  notes,
  metadata
)
values
  ('00000000-0000-0000-0000-000000000801', '00000000-0000-0000-0000-000000000701', '00000000-0000-0000-0000-000000000501', 'Tartar de atun rojo', 28.00, 2, 'cold', null, '{"source":"seed"}'::jsonb),
  ('00000000-0000-0000-0000-000000000802', '00000000-0000-0000-0000-000000000701', '00000000-0000-0000-0000-000000000502', 'Risotto de hongos', 24.00, 1, 'hot', null, '{"source":"seed"}'::jsonb),
  ('00000000-0000-0000-0000-000000000803', '00000000-0000-0000-0000-000000000702', '00000000-0000-0000-0000-000000000503', 'Cordero patagonico', 38.00, 2, 'grill', null, '{"source":"seed"}'::jsonb),
  ('00000000-0000-0000-0000-000000000804', '00000000-0000-0000-0000-000000000702', '00000000-0000-0000-0000-000000000504', 'Negroni de la casa', 12.00, 2, 'bar', 'Sin hielo.', '{"source":"seed"}'::jsonb)
on conflict (id) do nothing;

insert into kitchen_events (
  id,
  restaurant_id,
  branch_id,
  placed_order_id,
  actor_profile_id,
  station,
  from_status,
  to_status,
  notes,
  metadata
)
values
  ('00000000-0000-0000-0000-000000000901', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000701', '00000000-0000-0000-0000-000000000105', 'hot', 'received', 'preparing', 'Pase enviado a caliente.', '{"source":"seed"}'::jsonb),
  ('00000000-0000-0000-0000-000000000902', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000701', '00000000-0000-0000-0000-000000000105', 'cold', 'received', 'preparing', 'Mise en place lista.', '{"source":"seed"}'::jsonb)
on conflict (id) do nothing;

insert into sales_payments (
  id,
  restaurant_id,
  branch_id,
  placed_order_id,
  received_by_profile_id,
  payment_method,
  status,
  amount,
  tip_amount,
  paid_at,
  metadata
)
values
  ('00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000701', '00000000-0000-0000-0000-000000000102', 'card', 'paid', 80.00, 8.00, now() - interval '20 minutes', '{"source":"seed"}'::jsonb),
  ('00000000-0000-0000-0000-000000001002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', null, '00000000-0000-0000-0000-000000000102', 'cash', 'pending', 100.00, 0.00, null, '{"source":"seed"}'::jsonb)
on conflict (id) do nothing;

insert into cash_closings (
  id,
  restaurant_id,
  branch_id,
  opened_by_profile_id,
  closed_by_profile_id,
  status,
  opening_amount,
  expected_amount,
  counted_amount,
  notes,
  opened_at,
  closed_at,
  metadata
)
values
  ('00000000-0000-0000-0000-000000001101', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000102', 'closed', 150.00, 238.00, 238.00, 'Cierre demo sin diferencias.', now() - interval '8 hours', now() - interval '15 minutes', '{"source":"seed"}'::jsonb)
on conflict (id) do nothing;

insert into events (
  id,
  restaurant_id,
  branch_id,
  source,
  event_type,
  payload,
  metadata
)
values
  ('00000000-0000-0000-0000-000000001201', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'app', 'reservation.confirmed', '{"reservation_id":"00000000-0000-0000-0000-000000000601"}'::jsonb, '{"source":"seed"}'::jsonb),
  ('00000000-0000-0000-0000-000000001202', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'app', 'order.received', '{"placed_order_id":"00000000-0000-0000-0000-000000000702"}'::jsonb, '{"source":"seed"}'::jsonb)
on conflict (id) do nothing;

insert into ai_interactions (
  id,
  restaurant_id,
  branch_id,
  profile_id,
  interaction_type,
  input,
  output,
  model,
  metadata
)
values
  ('00000000-0000-0000-0000-000000001301', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000101', 'daily_summary', '{"date":"2026-05-27"}'::jsonb, '{"summary":"Servicio estable con una reserva pendiente de confirmar."}'::jsonb, 'gpt-5', '{"source":"seed"}'::jsonb)
on conflict (id) do nothing;
