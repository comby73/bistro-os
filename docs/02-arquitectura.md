# 02 — Arquitectura

## Gestión de carta desde la app (mayo 2026)

`/menu` es un gestor real de carta digital, no solo lectura. owner/admin pueden
crear, editar, cambiar precio/categoría/estación/imagen, marcar disponible/destacado
y dar de baja (baja lógica) — todo desde un drawer lateral (`MenuItemEditor`).

Flujo de escritura (patrón repository + server actions):

```
UI (MenuItemForm / drawer)
   → server action (features/menu/actions.ts)  ── valida rol + ownership (cookies)
      → repository (features/menu/repository.ts) ── Supabase si está configurado
         → menu_items (insert/update/archive)
   → fallback demo-store (localStorage) si no hay Supabase
```

- Permisos server-side: solo `owner`/`admin` (rol `chef` → roadmap). El cliente nunca
  define `restaurant_id`; lo inyecta el server desde la cookie de sesión.
- Aislamiento por tenant: toda edición valida que el item pertenezca al `restaurant_id` activo.
- `/menu`, `/orders` y `/carta/[slug]` leen del **mismo repository** (sin doble fuente).
- Imágenes: upload real a Supabase Storage (bucket `menu-images`) vía server action; en
  fallback local se edita la URL directamente.

## Stack

- Next.js + TypeScript para app y UI.
- Tailwind CSS para la interfaz.
- Supabase PostgreSQL para auth, tenant, menú/carta y reservas.
- `localStorage` + stores demo para pedidos/cocina y fallback local.
- n8n como integración opcional para automatizaciones externas.
- LLM como capa asistiva documentada, no crítica.

## Principios

1. Modularidad por dominio.
2. Separación UI / negocio / estado demo / datos futuros.
3. Roles explícitos y navegación contextual.
4. Integraciones externas no bloqueantes.
5. Persistencia real por dominio, con fallback local para demo resiliente.
6. Testing básico sobre validaciones y cálculos.

## Capas

```txt
Rutas App Router
→ AppShell y navegación por rol
→ Componentes de UI
→ Features (tipos, cálculos, stores demo, acciones)
→ Adaptadores de datos por módulo
→ Supabase real / fallback local según dominio
→ Automatizaciones opcionales (n8n)
```

La siguiente transición arquitectónica no reemplaza la UI: reemplaza gradualmente la fuente de datos por módulo.

## Modos visuales

- Modo Gestión: `owner`, `admin`, `manager`.
- Modo Servicio: `waiter` en `/orders`.
- Modo Cocina: `kitchen` en `/kitchen`.

La misma lógica de negocio puede renderizar experiencias distintas por rol sin duplicar el store demo.

## Roles implementados

| Rol | Rutas / módulos actuales |
|---|---|
| `owner` | dashboard, sales, orders, reservations, kitchen, menu |
| `admin` | dashboard, sales, orders, reservations, kitchen, menu |
| `manager` | dashboard, sales solo lectura, reservations, orders, menu supervisión |
| `waiter` | orders, menu, dashboard contextual |
| `kitchen` | kitchen, dashboard contextual |

## Rutas actuales

- `/`
- `/login`
- `/dashboard`
- `/orders`
- `/kitchen`
- `/reservations`
- `/menu`
- `/sales`
- `/demo`

## Módulos implementados

- `auth`: Supabase Auth, perfiles, roles y control de acceso.
- `dashboard`: centro de control vivo derivado de stores demo y cálculos reutilizables.
- `orders`: carga y seguimiento de pedidos.
- `kitchen`: KDS demo y avance de estados.
- `reservations`: módulo operativo con Supabase, fallback local, filtros y acciones de estado.
- `menu`: gestor de carta con CRUD, disponibilidad, destacados, baja lógica e imágenes en Storage.
- `sales`: ventas y caja simulada.
- `finance`: tablero analítico demo por restaurante con ventas, pagos, costos, inventario,
  mesas, gastos, empleados y exportación Excel.
- `leads`: formulario comercial con automatización opcional.

## Modelo operativo de referencia

Como referencia conceptual, Bistró OS se alinea con la separación clásica entre:

- **FOH (Front of House)**: salón, toma de pedidos, reservas, atención de mesa, caja operativa.
- **BOH (Back of House)**: cocina, preparación, control interno, stock futuro, costeo futuro.

Aplicado al estado actual del proyecto:

- `waiter` opera FOH rápido desde `/orders`.
- `waiter` consulta disponibilidad real del turno desde `/menu`.
- `manager` coordina FOH desde dashboard, reservas y supervisión de pedidos.
- `manager` supervisa la carta activa sin editarla.
- `kitchen` opera BOH desde `/kitchen` como KDS.
- `owner` y `admin` observan el conjunto con foco de gestión.

Este modelo ayuda a ordenar el producto en módulos transaccionales claros:

- **Pedidos** como núcleo de operación entre salón y cocina.
- **KDS / cocina** como reflejo del avance del pedido en tiempo real.
- **Ventas y caja** como cierre operativo del turno.
- **Análisis financiero** como lectura analítica para owner: margen, faltantes, gastos y nómina.

## Contexto multi-restaurante

La app modela varios restaurantes conviviendo en el mismo SaaS. Supabase resuelve perfiles,
roles, restaurantes y sucursales; los mocks quedan como fallback de desarrollo. Vive en
`src/features/restaurants/`:

- `types.ts` — interfaces `Restaurant`, `Branch`, `RestaurantSession`.
- `mock-data.ts` — fallback de 3 restaurantes (Bistró Palermo, Casa Norte, La Mesa Dorada).
- `session.ts` — helper server-side `getActiveRestaurantSession(cookieStore)` y las
  constantes de cookie (`RESTAURANT_COOKIE`, `BRANCH_COOKIE`). Sigue el mismo patrón
  que `features/auth/demo-session.ts`.
- `demo-store.ts` — hook cliente `useActiveRestaurant()` (localStorage + cookies,
  SSR-safe) y acciones de sesión.
- `actions.ts` — server actions para fijar/limpiar las cookies de restaurante y rol.

**Flujo de selección.** `/login` autentica con Supabase Auth. Según `role_assignments`,
roles operativos entran directo a su sucursal y owner/admin con más de una opción pasan por
`/select-branch`.

**Propagación.** Las páginas server leen `getActiveRestaurantSession(await cookies())`
y pasan `restaurantId` a cada workspace. Los stores demo (`menu`, `reservations`,
`orders`) filtran por `restaurant_id` cuando se les pasa el id; si no hay sesión,
muestran todo (fallback compatible con el comportamiento previo). El `AppShell`
muestra nombre del restaurante (con su `brand_color`), sucursal y un link "Cambiar".

## Pedidos y cocina demo

Pedidos/cocina todavía no están en Supabase. La experiencia operativa se resuelve con:

- `src/features/orders/mock-data.ts`: seeds por restaurante usando UUIDs reales.
- `src/features/orders/demo-store.ts`: store cliente con `localStorage` por `restaurant_id`.
- `src/features/orders/calculations.ts`: creación de pedidos, totales, tiempos y transición de estados.
- `src/components/orders/`: toma y seguimiento de pedidos.
- `src/components/kitchen/`: tablero KDS.

El store usa keys por restaurante (`bistro-demo-orders-v2-{restaurant_id}`), por lo que Bistró
Palermo, Casa Norte y La Mesa Dorada no mezclan tickets. Si la key está vacía, se cargan 1-2
pedidos seed del restaurante; si ya existe data local del usuario, no se pisa. La key vieja global
`bistro-demo-orders-v1` se usa solo como migración suave, filtrando por `restaurant_id`.

`/orders` recibe el catálogo resuelto del restaurante activo desde el mismo repository de carta.
Esto permite que productos creados/editados en `/menu` aparezcan en la toma de pedidos, mientras
los archivados quedan ocultos por el store de menú.

`/kitchen` lee el mismo store de pedidos y agrupa por `received`, `preparing`, `ready` y
`delivered`. Las acciones disponibles avanzan `received → preparing → ready → delivered`.

> Branding: hoy `slug`, descripción y color viven en `metadata`; si se promueven a columnas,
> seguir las propuestas comentadas en `supabase/schema.sql`.
- **Menú** como catálogo jerárquico de productos, categorías y disponibilidad.

## Integraciones futuras de referencia

Sin implementarlas todavía, la arquitectura deja espacio para:

- APIs REST internas para pedidos, reservas, menú y caja.
- Webhooks salientes para eventos como `order.ready` o resúmenes operativos.
- Disponibilidad dinámica de cocina y menú.
- Stock y costeo como módulos BOH de una fase posterior.

## Integraciones

- La app debe operar aunque n8n no exista o falle.
- Supabase ya persiste tenant, auth, menú y reservas.
- Pedidos/cocina siguen en demo-store hasta Fase 4D.

## Estrategia de migración a Supabase

La migración es incremental:

1. conectar primero dominios de bajo riesgo (`menu`, `reservations`),
2. dejar pedidos/cocina para cuando ya exista un patrón estable de lectura/escritura,
3. mover dashboard a datos reales cuando los dominios fuente estén conectados,
4. endurecer RLS por tenant/rol sobre la base ya estabilizada.

Orden esperado:

- Fase 4B: `menu` ✅
- Fase 4C: `reservations` ✅
- Fase 4D: `orders` + `kitchen`
- Fase 4E: `dashboard`
- Fase 4F: RLS multi-tenant serio por rol
