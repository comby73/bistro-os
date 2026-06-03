# Bistró OS

**Bistró OS** es un SaaS multi-restaurante de administración gastronómica (Next.js + Supabase).
No es una landing: es el sistema operativo interno del restaurante — login real, roles, menú,
reservas, pedidos, cocina, dashboard, finanzas, gestión multi-sucursal y canales de reserva externos.

## Qué es ahora

- App operativa multi-restaurante con **autenticación real (Supabase Auth)**.
- **Supabase es la fuente de verdad** de restaurantes, sucursales, perfiles, roles, menú y reservas.
- `mock-data` queda solo como **fallback de desarrollo** cuando no hay variables de Supabase.
- Aislamiento por `restaurant_id` y `branch_id` en datos y navegación.
- Carta pública por restaurante con QR único.
- Formulario público de reservas por restaurante (sin login).
- Links a sitio público visibles en el sidebar del app para cada restaurante.
- Reservas vía tres canales: web, Telegram (n8n) y carga manual del staff.

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

| Ruta | Estado | Descripción |
|---|---|---|
| `/` | ✅ Operativo | Landing comercial pública |
| `/login` | ✅ Operativo | Login real (email + contraseña, Supabase Auth) |
| `/select-branch` | ✅ Operativo | Selector de restaurante/sucursal (owner/admin multi) |
| `/dashboard` | ✅ Operativo | Vista interna adaptada por rol |
| `/menu` | ✅ Supabase | Carta operativa — lee/escribe en Supabase |
| `/carta/[slug]` | ✅ Supabase | Carta pública por restaurante — mismo repo que /menu |
| `/reservar/[slug]` | ✅ Supabase | Formulario público de reservas — sin login, graba directo a Supabase |
| `/orders` | ⚠️ localStorage | Pedidos activos + creación (demo operativo por restaurante) |
| `/kitchen` | ⚠️ localStorage | KDS por restaurante (demo operativo por restaurante) |
| `/reservations` | ✅ Supabase | Reservas — lee de Supabase, auto-refresh 30s |
| `/finances` | ⚠️ Demo | Análisis financiero demo (datos determinísticos, no reales) |
| `/sales` | ⚠️ Demo | Ventas y caja simulada (no conecta con pedidos reales aún) |
| `/users` | ✅ Supabase | Alta/baja de usuarios (solo owner) |
| `/branches` | ✅ Supabase | Gestión de sucursales (solo owner/admin) |
| `/restaurants` | ✅ Supabase | Gestión de restaurantes (solo owner) |
| `/demo` | ✅ Operativo | Formulario comercial / lead; puede llamar a n8n |

Slugs de carta pública y reservas: `bistro-palermo`, `casa-norte`, `la-mesa-dorada`.

## Sitio público por restaurante

Cada restaurante tiene dos páginas públicas (sin login):

| URL | Descripción |
|---|---|
| `/carta/[slug]` | Carta pública con botón "Reservar mesa" |
| `/reservar/[slug]` | Formulario de reservas (nombre, teléfono, fecha, hora, personas) |

El staff ve estas URLs en el sidebar bajo **"🌐 Sitio público"** con botón para copiar y abrir.

## Canales de reserva

| Canal | Cómo llega | source en metadata |
|---|---|---|
| Formulario web `/reservar/[slug]` | Directo a Supabase vía Server Action | `web_form` |
| Telegram (n8n) | Bot → n8n Cloud → Supabase | `telegram_audio` / `telegram_text` |
| Staff manual | Desde `/reservations` en la app | `demo` |

Todas las reservas usan los mismos IDs canónicos (`00000000-...-0001/002/003`)
para que sean visibles al dueño logueado en `/reservations`.

## Fuente de datos

| Dato | Fuente real | Fallback |
|---|---|---|
| Restaurantes, sucursales, perfiles, roles | Supabase | `features/restaurants/mock-data` |
| Menú (categorías + items) | Supabase | `features/menu/catalog.json` |
| Reservas | Supabase | `features/reservations/mock-data` |
| Pedidos / cocina | Demo operativo en `localStorage` por restaurante | seeds en `features/orders/mock-data.ts` |
| Finanzas avanzadas | Demo determinístico por restaurante | `features/finance/mock-data.ts` |
| Ventas/caja | Demo simulada | `features/sales/mock-data.ts` |

Los importes visibles se muestran en **pesos argentinos (ARS)**.
Valores base históricos convertidos con tasa fija demo: `1 USD = $1430 ARS`.

## IDs canónicos de restaurantes en Supabase

Todos los módulos (formulario web, n8n, panel interno) usan estos IDs:

| Restaurante | restaurant_id | branch_id |
|---|---|---|
| Bistró Palermo | `00000000-0000-0000-0000-000000000001` | `00000000-0000-0000-0000-000000000010` |
| Casa Norte | `00000000-0000-0000-0000-000000000002` | `00000000-0000-0000-0000-000000000020` |
| La Mesa Dorada | `00000000-0000-0000-0000-000000000003` | `00000000-0000-0000-0000-000000000030` |

> **Nota:** `supabase/seed_restaurants_demo.sql` crea un set alternativo (`11111111-...`)
> con mesas para testing de n8n. No usar esos IDs en el código de la app.
> El workflow n8n debe apuntar a los IDs `000...` de arriba.

## Gestión de carta desde la app

`scripts/seed-menu.mjs` carga la carta inicial demo; después **owner/admin administran la carta desde
`/menu`** sin tocar código:

- Crear producto, editar nombre/descripción/precio/categoría/estación.
- Disponibilidad (`available=false` = "No disponible" temporal) y destacado.
- **Baja lógica** (`status='archived'`): el producto se oculta en `/menu` y `/carta`, nunca
  se borra físicamente.
- **Imagen**: upload real a Supabase Storage (bucket `menu-images`,
  `restaurants/{restaurant_id}/menu/{item_id}/{filename}`) o URL directa como fallback.

## Análisis financiero demo

`/finances` es un tablero analítico para owner. No reemplaza contabilidad ni facturación fiscal.
Los datos son determinísticos por restaurante hasta que `placed_orders` y `sales_payments` estén conectados.

## Pedidos y cocina demo

`/orders` y `/kitchen` son operativos pero **aún no escriben en Supabase** (Fase 4D pendiente).
El store persiste en `localStorage` con key `bistro-demo-orders-v2-{restaurant_id}`.

## Automatización Telegram (n8n)

El bot de Telegram reserva por audio o texto. Ver `docs/04-automatizaciones-n8n.md` para detalles.

Workflow activo: `Bistró OS — Telegram Audio Reservation` (`1Twr5DBBHwtIrjy9`)

Bugs corregidos en el workflow (junio 2026):
- `customer_contact` null → INSERT bloqueado silenciosamente (campo NOT NULL)
- Lectura de mesas con `.all()` en vez de `.first()` (siempre asignaba `pending`)
- Regex `mañana` no reconocía la ñ
- `partyP` devolvía 1 por "una reserva" (falso positivo)

## Cómo probar

```bash
npm install
npm run dev
```

1. **Login** → http://localhost:3000/login → entrar con cualquier usuario demo (`demo1234`).
2. **Menú interno** → `/menu` → muestra los productos del restaurante activo.
3. **Carta pública** → `/carta/bistro-palermo` (con botón "Reservar mesa").
4. **Formulario de reservas** → `/reservar/bistro-palermo` → llenarlo y enviar.
5. **Verificar reserva** → loguearse como owner → `/reservations` → aparece la reserva web.
6. **Reservas auto-refresh** → el panel se actualiza cada 30s, botón "Actualizar" manual.
7. **Sitio público en sidebar** → el sidebar muestra las URLs públicas con botón "Copiar".
8. **Pedidos** → `/orders` → comandas demo del restaurante activo.
9. **Cocina** → `/kitchen` → tickets demo del restaurante activo.
10. **Análisis financiero** → `/finances` → tablero demo + exportación Excel.

## Seeds de Supabase

Con `.env.local` configurado:

```bash
npm run seed:menu          # carga categorías + items del catálogo a Supabase
npm run seed:reservations  # carga reservas demo por restaurante
npm run seed:demo          # ambos
```

Son **idempotentes** (UUID deterministas + upsert).

## Migraciones SQL

Archivos en `supabase/`:

| Archivo | Descripción |
|---|---|
| `schema.sql` | Schema completo de tablas y triggers |
| `policies.sql` | RLS básico (lectura pública de menú + escritura de reservas) |
| `seed_restaurants_demo.sql` | Restaurantes/sucursales/mesas demo para testing n8n |
| `migration_capacity.sql` | Vista `v_branch_capacity` + función `available_tables_for_reservation()` |

## Variables de entorno

Copiar `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` → cliente / lectura pública.
- `SUPABASE_SERVICE_ROLE_KEY` → **solo server-side**. Nunca exponer en cliente.
- `N8N_LEAD_WEBHOOK_URL` → opcional (captura de leads desde `/demo`).

> `.env.local` está en `.gitignore` y no debe commitearse.

## Validación de calidad

```bash
npm run lint
npm test
npm run build
```

## Deploy (Vercel)

- Build de producción: `npm run build` (verificado, sin errores).
- Variables a configurar en Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- Install Command recomendado:
  ```bash
  npm install --omit=optional --no-audit --no-fund
  ```
- Motivo: `@vitejs/plugin-react` trae `rolldown` con bindings nativos por plataforma como opcionales.
- **URL pública: https://bistro-os-phi.vercel.app**

## Roadmap

Ver `docs/08-roadmap.md` para el detalle completo.

Próximos pasos:
1. Ventas/caja conectada a pedidos reales (`placed_orders`).
2. Persistir pedidos y cocina en Supabase (Fase 4D).
3. RLS por tenant y rol (Fase 4F).
4. Dashboard financiero con datos reales (Fase 4G).
5. Facturación simulada profesional + ARCA como integración futura documentada.
