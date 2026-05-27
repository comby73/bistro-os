-- Bistró OS — RLS inicial Fase 4A
-- Objetivo: dejar el esquema preparado sin inventar autorización compleja antes de Fase 4F.
-- Estrategia actual: habilitar RLS y abrir solo lecturas públicas mínimas del menú.

alter table leads enable row level security;
alter table restaurants enable row level security;
alter table branches enable row level security;
alter table profiles enable row level security;
alter table role_assignments enable row level security;
alter table restaurant_tables enable row level security;
alter table menu_categories enable row level security;
alter table menu_items enable row level security;
alter table reservations enable row level security;
alter table placed_orders enable row level security;
alter table order_items enable row level security;
alter table kitchen_events enable row level security;
alter table sales_payments enable row level security;
alter table cash_closings enable row level security;
alter table events enable row level security;
alter table ai_interactions enable row level security;

drop policy if exists "public can read active menu categories" on menu_categories;
create policy "public can read active menu categories"
on menu_categories
for select
using (status = 'active');

drop policy if exists "public can read active menu items" on menu_items;
create policy "public can read active menu items"
on menu_items
for select
using (status = 'active' and available = true);

-- TODO Fase 4F:
-- 1. Reemplazar lecturas públicas por permisos por tenant y branch.
-- 2. Usar auth.uid() + profiles + role_assignments para aislar restaurante/sucursal.
-- 3. Separar permisos de lectura y escritura por rol operativo.
-- 4. Permitir service role o backend-only mutations para eventos internos y automatizaciones.
-- 5. Definir políticas específicas para dashboard, ventas/caja y eventos de cocina.
