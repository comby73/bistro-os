# Bistró OS

**Bistró OS** es un SaaS multi-restaurante de administración gastronómica (Next.js 16 + Supabase).
No es una landing: es el sistema operativo interno del restaurante — login real, roles, menú,
reservas, pedidos, cocina, dashboard, finanzas y gestión multi-sucursal.

## Qué es ahora

- App operativa multi-restaurante con **autenticación real (Supabase Auth)**.
- **Supabase es la fuente de verdad** de restaurantes, sucursales, perfiles, roles, menú y reservas.
- `mock-data` queda solo como **fallback de desarrollo** cuando no hay variables de Supabase.
- Aislamiento por `restaurant_id` y `branch_id` en datos y navegación.
- Carta pública por restaurante con QR único.

## Autenticación

El login (`/login`) usa **email + contraseña contra Supabase Auth**. No es un selector de rol.
Tras autenticar, el sistema lee el perfil del usuario y resuelve restaurante, sucursal y rol:

- **Mozo / Cocina / Jefe de sala** → entran directo a su sucursal.
- **Dueño / Admin** con 1 sucursal → directo; con varias → selector de sucursal.

### Usuarios demo (contraseña: `demo1234`)

| Email | Rol | Restaurante |
|---|---|---|
| `owner@bistro-os.com` | Dueño | Bistró Palermo |
| `admin@bistro-os.com` | Admin | Bistró Palermo |
| `manager@bistro-os.com` | Jefe de sala | Bistró Palermo |
| `waiter@bistro-os.com` | Mozo | Bistró Palermo |
| `kitchen@bistro-os.com` | Cocina | Bistró Palermo |
| `owner@casanorte.com` | Dueño | Casa Norte |
| `owner@mesadorada.com` | Dueño | La Mesa Dorada |
| `demo@bistro-os.com` | Dueño (multi) | Los 3 restaurantes |

El panel de login incluye accesos rápidos que autocompletan estas credenciales.

## Roles y permisos

| Rol | Rutas |
|---|---|
| `owner` | dashboard, análisis financiero, ventas, pedidos, reservas, cocina, carta, usuarios, sucursales, restaurantes |
| `admin` | dashboard, ventas, pedidos, reservas, cocina, carta |
| `manager` | dashboard, ventas, reservas, pedidos, carta |
| `waiter` | pedidos, carta |
| `kitchen` | cocina |

## Rutas principales

| Ruta | Estado |
|---|---|
| `/` | Landing comercial pública |
| `/login` | Login real (email + contraseña, Supabase Auth) |
| `/select-branch` | Selector de restaurante/sucursal (owner/admin multi) |
| `/dashboard` | Vista interna adaptada por rol |
| `/menu` | Carta operativa — **lee de Supabase** por restaurante |
| `/carta/[slug]` | Carta pública por restaurante — **misma fuente que /menu** |
| `/orders` | Pedidos activos + creación (demo en memoria por restaurante) |
| `/kitchen` | KDS por restaurante (demo en memoria) |
| `/reservations` | Reservas — **lee de Supabase** por restaurante/sucursal |
| `/finances` | Análisis financiero demo: ventas, pagos, costos, inventario, mesas, gastos y nómina (solo owner) |
| `/users` `/branches` `/restaurants` | Altas/bajas (solo owner) |
| `/demo` | Formulario comercial / lead (n8n lead-capture) |

Slugs de carta pública: `bistro-palermo`, `casa-norte`, `la-mesa-dorada`.

## Fuente de datos

| Dato | Fuente real | Fallback |
|---|---|---|
| Restaurantes, sucursales, perfiles, roles | Supabase | `features/restaurants/mock-data` |
| Menú (categorías + items) | Supabase | `features/menu/catalog.json` |
| Reservas | Supabase | `features/reservations/mock-data` |
| Pedidos / cocina | Demo en memoria (aún no en Supabase) | — |
| Finanzas avanzadas | Demo analítica determinística por restaurante | `features/finance/mock-data.ts` |

El menú comparte una sola fuente: `src/features/menu/catalog.json`, consumido por la app
(fallback) y por `scripts/seed-menu.mjs` (carga a Supabase). `/menu` y `/carta` leen del
**mismo repository**, eliminando la doble fuente de verdad anterior.

## Gestión de carta desde la app

`scripts/seed-menu.mjs` carga la carta inicial demo; después **owner/admin administran la carta desde
`/menu`** sin tocar código:

- Crear producto, editar nombre/descripción/precio/categoría/estación.
- Disponibilidad (`available=false` = "No disponible" temporal) y destacado.
- **Baja lógica** (`status='archived'`): el producto se oculta en `/menu` y `/carta`, nunca
  se borra físicamente.
- **Imagen**: upload real a Supabase Storage (bucket `menu-images`,
  `restaurants/{restaurant_id}/menu/{item_id}/{filename}`) o URL directa como fallback.

Todo se guarda en Supabase si está configurado; si no, cae a `localStorage`. `/orders` y
`/carta/[slug]` reflejan los cambios porque leen el mismo repository.
Permisos: owner/admin (rol `chef` → roadmap). manager/waiter solo lectura; kitchen no administra menú.

## Análisis financiero demo

`/finances` es un tablero analítico para owner. No reemplaza contabilidad ni facturación fiscal,
pero permite demostrar gestión financiera interna:

- gráficos de ventas por día,
- desglose por forma de pago,
- tabla de ventas exportable a Excel,
- costos y margen por producto,
- faltantes de insumos de salón/cocina/limpieza,
- listado y estado de mesas,
- gastos del mes,
- pago estimado de empleados.
- carga rápida local de gastos, stock/faltantes y propinas.

La información es demo determinística por restaurante (`src/features/finance/mock-data.ts`) hasta
conectar pedidos, pagos, inventario y nómina reales en Supabase. Las altas rápidas se guardan en
`localStorage` por restaurante para que la demo sea editable.

## Cómo probar

```bash
npm install
npm run dev
```

1. **Login** → http://localhost:3000/login → entrar con cualquier usuario demo (`demo1234`).
2. **Menú interno** → `/menu` → muestra los productos del restaurante activo (Casa Norte y
   La Mesa Dorada ya no aparecen vacíos).
3. **Carta pública** → `/carta/casa-norte`, `/carta/la-mesa-dorada`, `/carta/bistro-palermo`.
4. **Reservas** → `/reservations` → reservas del restaurante/sucursal activos.
5. **Pedidos** → `/orders` → comandas demo del restaurante activo.
6. **Cocina** → `/kitchen` → tickets demo del restaurante activo.
7. **Análisis financiero** → `/finances` → tablero demo + exportación Excel.

## Seeds de Supabase

Con `.env.local` configurado:

```bash
npm run seed:menu          # carga categorías + items del catálogo a Supabase
npm run seed:reservations  # carga reservas demo por restaurante
npm run seed:demo          # ambos
```

Son **idempotentes** (UUID deterministas + upsert). El seed de menú archiva
(`status='archived'`) los items que ya no estén en el catálogo.

### Consultas de validación

```sql
select restaurant_id, count(*) from menu_items
where coalesce(status,'active')='active' group by restaurant_id order by restaurant_id;
-- esperado: 001→18, 002→13, 003→11

select restaurant_id, count(*) from reservations group by restaurant_id order by restaurant_id;
```

## Variables de entorno

Copiar `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` → cliente / lectura pública.
- `SUPABASE_SERVICE_ROLE_KEY` → **solo server-side** (seeds, escritura segura). Nunca exponer en cliente.
- `N8N_LEAD_WEBHOOK_URL` → opcional (captura de leads).

> `.env.local` está en `.gitignore` y no debe commitearse.

## Validación de calidad

```bash
npm run lint
npm test
npm run build
```

## Deploy (Vercel)

- Build de producción: `npm run build` (verificado, sin errores).
- Variables a configurar en Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`.
- **URL pública: _pendiente de completar con URL de Vercel_.**

## Roadmap

1. Persistir pedidos/cocina en Supabase (`placed_orders` / `kitchen_events`).
2. Conectar análisis financiero a ventas/pagos/gastos/inventario reales.
3. RLS por tenant (hoy `supabase/policies.sql` solo abre lectura pública de menú).
4. Automatizaciones n8n: reserva confirmada → Telegram, pedido demorado → notificación.
5. Promover `image_url`/`storage_path` desde `metadata` a columnas reales en la DB viva cuando se aplique la migración SQL.
