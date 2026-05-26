-- Bistró OS — RLS inicial
-- Ajustar antes de producción según modelo multi-tenant definitivo.

alter table leads enable row level security;
alter table restaurants enable row level security;
alter table branches enable row level security;
alter table profiles enable row level security;
alter table menu_categories enable row level security;
alter table menu_items enable row level security;
alter table reservations enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table kitchen_tickets enable row level security;
alter table feedback enable row level security;
alter table ai_interactions enable row level security;
alter table events enable row level security;

-- Política temporal para prototipo: permitir lectura pública de menú.
create policy "public can read active menu categories"
on menu_categories for select
using (is_active = true);

create policy "public can read available menu items"
on menu_items for select
using (is_available = true);

-- Las escrituras deberían ejecutarse desde backend/server actions o n8n con service role.
-- No exponer SUPABASE_SERVICE_ROLE_KEY en el cliente.
