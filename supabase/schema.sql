-- Bistró OS — Supabase schema inicial
-- Convenciones: tablas en plural, snake_case, uuid, timestamps, status.

create extension if not exists "pgcrypto";

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  restaurant_name text not null,
  owner_name text not null,
  email text not null,
  whatsapp text not null,
  city text not null,
  restaurant_type text not null,
  number_of_tables integer not null check (number_of_tables > 0),
  plan_interest text not null check (plan_interest in ('Starter', 'Pro', 'Enterprise')),
  message text,
  lead_score text check (lead_score in ('low', 'medium', 'high')),
  status text not null default 'new' check (status in ('new', 'qualified', 'contacted', 'lost', 'converted')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  email text,
  phone text,
  city text,
  country text default 'Argentina',
  plan text not null default 'Starter' check (plan in ('Starter', 'Pro', 'Enterprise')),
  status text not null default 'active' check (status in ('active', 'paused', 'cancelled')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists branches (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name text not null,
  address text,
  city text,
  phone text,
  opening_hours jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key,
  restaurant_id uuid references restaurants(id) on delete set null,
  full_name text not null,
  role text not null default 'staff' check (role in ('owner', 'manager', 'kitchen', 'staff')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists menu_categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name text not null,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  category_id uuid references menu_categories(id) on delete set null,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  station text not null default 'hot' check (station in ('cold', 'hot', 'grill', 'bar', 'pass')),
  is_available boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  branch_id uuid references branches(id) on delete set null,
  customer_name text not null,
  customer_email text,
  customer_whatsapp text not null,
  reservation_date date not null,
  reservation_time time not null,
  party_size integer not null check (party_size > 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  branch_id uuid references branches(id) on delete set null,
  table_label text,
  status text not null default 'received' check (status in ('received', 'preparing', 'ready', 'delivered', 'cancelled')),
  total_amount numeric(10,2) not null default 0,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  menu_item_id uuid references menu_items(id) on delete set null,
  name_snapshot text not null,
  unit_price numeric(10,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  station text not null default 'hot' check (station in ('cold', 'hot', 'grill', 'bar', 'pass')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists kitchen_tickets (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  station text not null check (station in ('cold', 'hot', 'grill', 'bar', 'pass')),
  status text not null default 'received' check (status in ('received', 'preparing', 'ready', 'delivered')),
  started_at timestamptz,
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  order_id uuid references orders(id) on delete set null,
  rating integer check (rating between 1 and 5),
  comment text,
  sentiment text check (sentiment in ('positive', 'neutral', 'critical')),
  category text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists ai_interactions (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  interaction_type text not null,
  input jsonb not null,
  output jsonb not null,
  model text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete set null,
  event_type text not null,
  source text not null default 'app',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
