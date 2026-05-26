insert into restaurants (id, name, email, city, country, plan)
values
  ('00000000-0000-0000-0000-000000000001', 'Bistró Demo', 'demo@bistro-os.com', 'Buenos Aires', 'Argentina', 'Pro')
on conflict do nothing;

insert into branches (restaurant_id, name, address, city)
values
  ('00000000-0000-0000-0000-000000000001', 'Sucursal Palermo', 'Costa Rica 5000', 'Buenos Aires');

insert into menu_categories (restaurant_id, name, position)
values
  ('00000000-0000-0000-0000-000000000001', 'Entradas', 1),
  ('00000000-0000-0000-0000-000000000001', 'Principales', 2),
  ('00000000-0000-0000-0000-000000000001', 'Coctelería', 3);
