-- Bistró OS — Supabase schema Fase 4A
-- Objetivo: preparar persistencia real sin migrar todavía la app desde localStorage.
-- Convenciones: tablas en plural, snake_case, uuid, timestamps, metadata jsonb.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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
  country text not null default 'Argentina',
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
  timezone text not null default 'America/Argentina/Buenos_Aires',
  opening_hours jsonb not null default '{}'::jsonb,
  status text not null default 'active' check (status in ('active', 'inactive')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  restaurant_id uuid references restaurants(id) on delete set null,
  branch_id uuid references branches(id) on delete set null,
  full_name text not null,
  email text,
  phone text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists role_assignments (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  branch_id uuid references branches(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'manager', 'waiter', 'kitchen')),
  status text not null default 'active' check (status in ('active', 'inactive')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, branch_id, role)
);

create table if not exists restaurant_tables (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references branches(id) on delete cascade,
  label text not null,
  area text,
  capacity integer not null check (capacity > 0),
  status text not null default 'available' check (status in ('available', 'occupied', 'reserved', 'blocked')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (branch_id, label)
);

create table if not exists menu_categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  branch_id uuid references branches(id) on delete cascade,
  name text not null,
  position integer not null default 0,
  status text not null default 'active' check (status in ('active', 'inactive')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  branch_id uuid references branches(id) on delete cascade,
  category_id uuid references menu_categories(id) on delete set null,
  name text not null,
  description text,
  base_price numeric(10,2) not null check (base_price >= 0),
  station text not null default 'hot' check (station in ('cold', 'hot', 'grill', 'bar', 'pass')),
  available boolean not null default true,
  featured boolean not null default false,
  status text not null default 'active' check (status in ('active', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  branch_id uuid not null references branches(id) on delete cascade,
  table_id uuid references restaurant_tables(id) on delete set null,
  created_by_profile_id uuid references profiles(id) on delete set null,
  customer_name text not null,
  customer_contact text not null,
  reservation_date date not null,
  reservation_time time not null,
  party_size integer not null check (party_size > 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'seated', 'cancelled', 'completed')),
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists placed_orders (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  branch_id uuid not null references branches(id) on delete cascade,
  reservation_id uuid references reservations(id) on delete set null,
  table_id uuid references restaurant_tables(id) on delete set null,
  taken_by_profile_id uuid references profiles(id) on delete set null,
  waiter_name_snapshot text,
  status text not null default 'received' check (status in ('received', 'preparing', 'ready', 'delivered', 'cancelled')),
  total_amount numeric(10,2) not null default 0 check (total_amount >= 0),
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  placed_order_id uuid not null references placed_orders(id) on delete cascade,
  menu_item_id uuid references menu_items(id) on delete set null,
  name_snapshot text not null,
  unit_price_snapshot numeric(10,2) not null check (unit_price_snapshot >= 0),
  quantity integer not null check (quantity > 0),
  station text not null default 'hot' check (station in ('cold', 'hot', 'grill', 'bar', 'pass')),
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists kitchen_events (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  branch_id uuid not null references branches(id) on delete cascade,
  placed_order_id uuid not null references placed_orders(id) on delete cascade,
  actor_profile_id uuid references profiles(id) on delete set null,
  station text not null check (station in ('cold', 'hot', 'grill', 'bar', 'pass')),
  from_status text check (from_status in ('received', 'preparing', 'ready', 'delivered', 'cancelled')),
  to_status text not null check (to_status in ('received', 'preparing', 'ready', 'delivered', 'cancelled')),
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists sales_payments (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  branch_id uuid not null references branches(id) on delete cascade,
  placed_order_id uuid references placed_orders(id) on delete set null,
  received_by_profile_id uuid references profiles(id) on delete set null,
  payment_method text not null check (payment_method in ('cash', 'card', 'transfer', 'qr')),
  status text not null default 'paid' check (status in ('pending', 'paid', 'voided')),
  amount numeric(10,2) not null check (amount >= 0),
  tip_amount numeric(10,2) not null default 0 check (tip_amount >= 0),
  paid_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cash_closings (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  branch_id uuid not null references branches(id) on delete cascade,
  opened_by_profile_id uuid references profiles(id) on delete set null,
  closed_by_profile_id uuid references profiles(id) on delete set null,
  status text not null default 'open' check (status in ('open', 'closed')),
  opening_amount numeric(10,2) not null default 0 check (opening_amount >= 0),
  expected_amount numeric(10,2) not null default 0 check (expected_amount >= 0),
  counted_amount numeric(10,2) check (counted_amount >= 0),
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete set null,
  branch_id uuid references branches(id) on delete set null,
  source text not null default 'app' check (source in ('app', 'supabase', 'n8n', 'manual')),
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists ai_interactions (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  branch_id uuid references branches(id) on delete set null,
  profile_id uuid references profiles(id) on delete set null,
  interaction_type text not null,
  input jsonb not null,
  output jsonb not null,
  model text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at_leads on leads;
create trigger set_updated_at_leads before update on leads for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_restaurants on restaurants;
create trigger set_updated_at_restaurants before update on restaurants for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_branches on branches;
create trigger set_updated_at_branches before update on branches for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_profiles on profiles;
create trigger set_updated_at_profiles before update on profiles for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_role_assignments on role_assignments;
create trigger set_updated_at_role_assignments before update on role_assignments for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_restaurant_tables on restaurant_tables;
create trigger set_updated_at_restaurant_tables before update on restaurant_tables for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_menu_categories on menu_categories;
create trigger set_updated_at_menu_categories before update on menu_categories for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_menu_items on menu_items;
create trigger set_updated_at_menu_items before update on menu_items for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_reservations on reservations;
create trigger set_updated_at_reservations before update on reservations for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_placed_orders on placed_orders;
create trigger set_updated_at_placed_orders before update on placed_orders for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_order_items on order_items;
create trigger set_updated_at_order_items before update on order_items for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_sales_payments on sales_payments;
create trigger set_updated_at_sales_payments before update on sales_payments for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_cash_closings on cash_closings;
create trigger set_updated_at_cash_closings before update on cash_closings for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_ai_interactions on ai_interactions;
create trigger set_updated_at_ai_interactions before update on ai_interactions for each row execute function public.set_updated_at();
