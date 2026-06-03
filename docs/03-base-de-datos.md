# 03 — Base de datos

## Schema principal — `supabase/schema.sql`

Tablas del sistema (Fase 4A):

| Tabla | Descripción |
|---|---|
| `restaurants` | Restaurantes del sistema |
| `branches` | Sucursales por restaurante |
| `profiles` | Usuarios internos con rol |
| `role_assignments` | Asignaciones de rol por restaurante/sucursal |
| `restaurant_tables` | Mesas con número, capacidad y estado |
| `menu_categories` | Categorías del menú |
| `menu_items` | Productos con precio, disponibilidad e imagen |
| `reservations` | Reservas de clientes con estado y origen |
| `placed_orders` | Pedidos del restaurante |
| `order_items` | Items de cada pedido |
| `kitchen_events` | Transiciones de estado en cocina |
| `sales_payments` | Pagos registrados |
| `cash_closings` | Aperturas y cierres de caja |
| `events` | Log de eventos de sistema (n8n, app, manual) |
| `ai_interactions` | Interacciones con IA |
| `leads` | Leads del formulario comercial |

## IDs canónicos de restaurantes

El seed principal (`scripts/seed-supabase.mjs`) crea los restaurantes con estos IDs fijos:

| Restaurante | restaurant_id | branch_id |
|---|---|---|
| Bistró Palermo | `00000000-0000-0000-0000-000000000001` | `00000000-0000-0000-0000-000000000010` |
| Casa Norte | `00000000-0000-0000-0000-000000000002` | `00000000-0000-0000-0000-000000000020` |
| La Mesa Dorada | `00000000-0000-0000-0000-000000000003` | `00000000-0000-0000-0000-000000000030` |

**IMPORTANTE:** Todos los módulos de la app, el formulario público `/reservar/[slug]` y el workflow
n8n de Telegram deben apuntar a estos IDs. Usar cualquier otro set produce datos invisibles para
el dueño logueado.

> `supabase/seed_restaurants_demo.sql` crea restaurantes con IDs `111.../222.../333...`
> únicamente para testing del workflow n8n con mesas disponibles. No confundir con los IDs canónicos.

## `menu_items` — gestión de carta

Columnas relevantes:

| Columna | Uso |
|---|---|
| `base_price` | precio (el front lo expone como `price`) |
| `available` | `false` = **indisponibilidad temporal** (visible como "No disponible") |
| `status` | `'archived'` = **baja lógica** (oculto en /menu y /carta). Nunca DELETE físico |
| `image_url`, `storage_path` | imagen del producto (Supabase Storage, bucket `menu-images`) |
| `category_id` | categoría por restaurante (UUID determinista del seed) |
| `restaurant_id`, `branch_id` | tenant; toda edición valida pertenencia |

**Storage:** bucket público `menu-images`, ruta `restaurants/{restaurant_id}/menu/{item_id}/{filename}`.

## `reservations` — reservas de clientes

Columnas relevantes:

| Columna | Tipo | Descripción |
|---|---|---|
| `restaurant_id` | uuid NOT NULL | FK a `restaurants` |
| `branch_id` | uuid NOT NULL | FK a `branches` |
| `customer_name` | text NOT NULL | Nombre del cliente |
| `customer_contact` | text NOT NULL | Teléfono u otro contacto |
| `reservation_date` | date NOT NULL | Fecha |
| `reservation_time` | time NOT NULL | Hora |
| `party_size` | integer NOT NULL | Cantidad de personas |
| `status` | text | `pending`, `confirmed`, `seated`, `cancelled`, `completed` |
| `notes` | text | Comentarios opcionales |
| `metadata` | jsonb | `source`, `telegram_chat_id`, `assigned_table_label`, etc. |

### Orígenes de reserva (`metadata.source`)

| Valor | Canal |
|---|---|
| `web_form` | Formulario público `/reservar/[slug]` |
| `telegram_audio` | Bot Telegram — mensaje de audio (transcripción con Whisper) |
| `telegram_text` | Bot Telegram — mensaje de texto |
| `demo` | Carga manual desde la app |

## `restaurant_tables` — mesas

| Columna | Descripción |
|---|---|
| `branch_id` | FK a `branches` |
| `label` | Nombre de la mesa (ej: "Mesa 3") |
| `area` | Zona (ej: "salón", "terraza", "privado") |
| `capacity` | Comensales máximos |
| `status` | `available`, `occupied`, `reserved`, `blocked` |

## Migraciones aplicadas

### `supabase/policies.sql` (Fase 4A)
- RLS habilitado en todas las tablas.
- Lectura pública: `menu_categories` y `menu_items` (solo activos/disponibles).

### `supabase/migration_capacity.sql` (junio 2026)
Ejecutar en Supabase SQL Editor (idempotente).

**Vista `v_branch_capacity`**
```sql
SELECT restaurant_name, branch_name, total_tables, total_seats,
       available_tables, available_seats
FROM v_branch_capacity
ORDER BY restaurant_name;
```
Devuelve la capacidad total y disponible de cada sucursal, con desglose por área.

**Función `available_tables_for_reservation(branch_id, date, time, party_size)`**
```sql
SELECT * FROM available_tables_for_reservation(
  '00000000-0000-0000-0000-000000000010',  -- branch_id Bistró Palermo
  '2026-07-01',
  '21:00:00',
  4
);
```
Devuelve mesas libres (`status='available'` + sin reserva pendiente/confirmada en ese slot).
Ordena por capacidad ascendente → la primera es la mesa más ajustada.

**Políticas RLS agregadas**
```sql
-- reservations: INSERT, SELECT, UPDATE
-- events: INSERT, SELECT
-- restaurant_tables: SELECT
-- restaurants: SELECT
-- branches: SELECT
```
Permiten a n8n (con anon key) escribir reservas y leer mesas, sucursales y restaurantes.

## Estado actual de persistencia (junio 2026)

| Módulo | Persistencia | Próximo paso |
|---|---|---|
| Auth / usuarios | ✅ Supabase Auth + `profiles` | — |
| Restaurantes / sucursales | ✅ Supabase | — |
| Menú (categorías + items) | ✅ Supabase | Promover image_url a columna real |
| Reservas | ✅ Supabase (3 canales) | Auto-refresh 30s activo |
| Pedidos / cocina | ⚠️ localStorage por restaurante | Fase 4D: migrar a `placed_orders` |
| Ventas / caja | ⚠️ Mock data simulada | Conectar con `placed_orders` |
| Finanzas | ⚠️ Demo determinístico | Fase 4G: conectar datos reales |
| Capacidad de mesas | ✅ Vista + función SQL | n8n puede consultar via RPC |

## Seeds disponibles

```bash
npm run seed:menu          # categorías + items → Supabase
npm run seed:reservations  # reservas demo por restaurante → Supabase
npm run seed:demo          # ambos
```

También: `supabase/seed_restaurants_demo.sql` → correlo manualmente en SQL Editor para crear
restaurantes/sucursales/mesas de testing para n8n.

## Consultas de validación

```sql
-- Menú por restaurante
SELECT restaurant_id, COUNT(*) FROM menu_items
WHERE COALESCE(status,'active') = 'active' GROUP BY restaurant_id ORDER BY restaurant_id;
-- Esperado: 001→18, 002→13, 003→11

-- Reservas por canal
SELECT metadata->>'source' AS canal, status, COUNT(*)
FROM reservations
GROUP BY 1, 2
ORDER BY 1, 2;

-- Capacidad de mesas
SELECT restaurant_name, branch_name, total_tables, total_seats, available_seats
FROM v_branch_capacity ORDER BY restaurant_name;

-- Reservas recientes de canales externos
SELECT customer_name, customer_contact, reservation_date, reservation_time,
       party_size, status, metadata->>'source' AS canal
FROM reservations
WHERE metadata->>'source' IN ('telegram_audio','telegram_text','web_form')
ORDER BY created_at DESC LIMIT 10;
```
