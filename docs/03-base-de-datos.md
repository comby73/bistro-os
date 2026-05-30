# 03 — Base de datos

## menu_items — gestión de carta (mayo 2026)

`scripts/seed-menu.mjs` carga la **carta inicial demo** desde `src/features/menu/catalog.json`. Después,
owner/admin la administran desde `/menu` (alta/edición/baja). Supabase es la fuente
principal; `catalog.json` es el fallback de dev.

Columnas relevantes de `menu_items`:

| Columna | Uso |
|---|---|
| `base_price` | precio (el front lo expone como `price`) |
| `available` | `false` = **indisponibilidad temporal** (visible como "No disponible") |
| `status` | `'archived'` = **baja lógica** (oculto en /menu y /carta). Nunca DELETE físico |
| `image_url`, `storage_path` | imagen del producto (Supabase Storage, bucket `menu-images`) |
| `category_id` | categoría por restaurante (UUID determinista del seed) |
| `restaurant_id`, `branch_id` | tenant; toda edición valida pertenencia |

> Nota de implementación: `supabase/schema.sql` ya documenta `image_url`/`storage_path`.
> La DB viva puede seguir usando `metadata.image_url` / `metadata.storage_path` hasta ejecutar
> el `ALTER` de promoción incluido en el schema.

**Storage:** bucket público `menu-images`, ruta
`restaurants/{restaurant_id}/menu/{item_id}/{filename}`. No se guardan imágenes en base64.

## Estado actual (mayo 2026)

La app usa Supabase como persistencia operativa para `menu` y `reservations`.  
Los módulos `orders` y `kitchen` siguen en `localStorage` hasta Fase 4D.

Hoy conviven tres mecanismos:

- `mock-data.ts` para semillas de demo y fallback cuando no hay backend.
- `localStorage` para pedidos y cocina (módulos aún no migrados).
- **Supabase real** para:
  - `menu_items` — categorías y productos con disponibilidad y destacados persistidos.
  - `reservations` — reservas operativas con estados y asignación de mesa.
  - `profiles` y `role_assignments` — usuarios internos, roles y pertenencia a restaurante/sucursal.

El indicador de conexión en el sidebar confirma el estado en tiempo real.

## Objetivo de Fase 4A

Fase 4A preparó el contrato de datos real en Supabase para que la migración fuera incremental
y segura. Las fases posteriores ya migraron auth/tenant, menú y reservas.

La estrategia es:

1. definir el modelo relacional completo,
2. dejar RLS inicial sin complejidad prematura,
3. preparar seed coherente con la demo actual,
4. migrar módulo por módulo en fases posteriores.

## Persistencia principal

La base principal es **Supabase PostgreSQL**.

Se mantiene por tres motivos:

- encaja con el stack Next.js + TypeScript,
- resuelve bien datos relacionales operativos,
- permite evolucionar luego hacia RLS por tenant, eventos y APIs.

## Convenciones del esquema

- tablas en plural,
- columnas en `snake_case`,
- `uuid` como `primary key`,
- `created_at` y `updated_at` donde corresponda,
- `status` con `check` simples,
- `metadata jsonb` para extensibilidad,
- claves foráneas explícitas,
- uso de `placed_orders` en lugar de `order`.

## Modelo actual vs futuro

### Hoy

- `menu` y `reservations` leen y escriben en Supabase (con fallback local).
- `orders` y `kitchen` viven en localStorage demo.
- `/sales` sigue siendo cálculo mock.
- `/dashboard` deriva información desde stores locales y cálculos reutilizables.

### Siguiente paso (Fase 4D)

- Conectar `orders` y `kitchen` a Supabase.
- La UI seguirá casi igual.
- La capa que cambia es solo el acceso a datos.

## Tablas del modelo Supabase preparado

### Núcleo organizacional

#### `restaurants`

Representa la cuenta principal del restaurante.

Campos clave:

- nombre,
- plan,
- estado,
- datos de contacto,
- `metadata`.

#### `branches`

Representa sucursales o locales físicos.

Campos clave:

- `restaurant_id`,
- nombre,
- dirección,
- ciudad,
- horario,
- timezone,
- estado.

#### `profiles`

Representa personas del sistema.

Campos clave:

- `auth_user_id` para vincular con Supabase Auth,
- `restaurant_id`,
- `branch_id`,
- nombre completo,
- email,
- teléfono,
- estado.

#### `role_assignments`

Desacopla persona y rol operativo.

Campos clave:

- `profile_id`,
- `restaurant_id`,
- `branch_id`,
- rol,
- estado.

Esto evita acoplar permisos a una sola columna fija y prepara mejor multi-sucursal.

### FOH: salón, reservas y pedidos

#### `restaurant_tables`

Modela mesas físicas.

Campos clave:

- `branch_id`,
- `label`,
- área,
- capacidad,
- estado.

#### `reservations`

Modela reservas operativas.

Campos clave:

- `branch_id`,
- `table_id` opcional,
- `created_by_profile_id`,
- cliente,
- contacto,
- fecha,
- hora,
- cantidad de personas,
- estado,
- notas.

Estados actuales alineados con la app:

- `pending`
- `confirmed`
- `seated`
- `cancelled`
- `completed`

#### `placed_orders`

Es la entidad transaccional central del sistema.

Campos clave:

- `branch_id`,
- `reservation_id` opcional,
- `table_id` opcional,
- `taken_by_profile_id`,
- `waiter_name_snapshot`,
- estado,
- total,
- notas.

Estados preparados:

- `received`
- `preparing`
- `ready`
- `delivered`
- `cancelled`

#### `order_items`

Persiste el detalle del pedido desacoplado del menú vivo.

Campos clave:

- `placed_order_id`,
- `menu_item_id` opcional,
- `name_snapshot`,
- `unit_price_snapshot`,
- cantidad,
- estación,
- notas.

Esto permite conservar nombre y precio histórico aunque el menú cambie.

### BOH: cocina y ejecución

#### `kitchen_events`

En vez de crear primero una tabla compleja de tickets por estación, Fase 4A prepara un log operativo de eventos de cocina.

Campos clave:

- `placed_order_id`,
- `actor_profile_id`,
- estación,
- `from_status`,
- `to_status`,
- notas,
- `occurred_at`.

Con eso se puede:

- reconstruir la secuencia del ticket,
- auditar tiempos,
- migrar luego a una vista materializada o tabla de tickets si hace falta.

### Carta operativa

#### `menu_categories`

Categorías jerárquicas del menú.

Campos clave:

- `restaurant_id`,
- `branch_id` opcional,
- nombre,
- posición,
- estado.

#### `menu_items`

Productos del menú.

Campos clave:

- `category_id`,
- nombre,
- descripción,
- `base_price`,
- estación,
- `available`,
- `featured`,
- estado.

Esto refleja exactamente lo que hoy maneja la demo en `/menu` y lo que consume `/orders`.

### Caja y ventas operativas

#### `sales_payments`

Representa cobros operativos, no facturación fiscal homologada.

Campos clave:

- `placed_order_id` opcional,
- medio de pago,
- estado,
- monto,
- propina,
- `paid_at`.

#### `cash_closings`

Representa aperturas/cierres de caja operativos.

Campos clave:

- sucursal,
- quién abrió,
- quién cerró,
- monto inicial,
- esperado,
- contado,
- estado,
- notas.

## Importante sobre `/sales`

`/sales` **no representa facturación fiscal real**.

El modelo preparado cubre:

- ventas operativas,
- medios de pago,
- pendientes de cobro,
- cierres de caja.

No cubre todavía:

- comprobantes fiscales homologados,
- integración AFIP,
- POS real,
- conciliación bancaria.

### Eventos e IA

#### `events`

Tabla genérica de eventos del sistema.

Campos clave:

- fuente,
- tipo de evento,
- payload,
- metadata.

Sirve para observabilidad y futura integración opcional con n8n.

#### `ai_interactions`

Registro de interacciones asistidas por IA.

Campos clave:

- tipo,
- input,
- output,
- modelo,
- actor opcional.

#### `leads`

Se mantiene como tabla comercial separada del núcleo operativo.

## RLS inicial

El archivo `supabase/policies.sql` deja un punto de partida prudente:

- RLS habilitado para todas las tablas del nuevo modelo.
- Solo lectura pública mínima para:
  - `menu_categories` activas
  - `menu_items` activos y disponibles

Todavía **no** se definen políticas complejas por tenant, branch y rol porque:

- aunque Supabase Auth ya está activo, las escrituras actuales pasan por server actions con service role,
- primero conviene estabilizar dominios y ownership antes de congelar políticas DB incorrectas.

Eso queda para Fase 4F.

## Seeds de referencia

Los seeds actuales preparan:

- `scripts/seed-supabase.mjs`: 3 restaurantes, 3 sucursales, perfiles demo y `role_assignments`.
- `scripts/create-auth-users.mjs`: usuarios de Supabase Auth para el login real.
- `scripts/seed-menu.mjs`: 15 categorías (5 por restaurante) y 42 productos; archiva items obsoletos.
- `scripts/seed-reservations.mjs`: 3 reservas por restaurante, idempotentes.

Pedidos, cocina, pagos y cierre de caja siguen como datos demo/locales hasta Fase 4D+.

## Estrategia de migración por módulo

La migración se hará de menor riesgo a mayor riesgo:

1. menú,
2. reservas,
3. pedidos y cocina,
4. dashboard,
5. RLS serio por tenant y rol.

## Estado concreto de Fase 4B

El primer módulo en abrir esta transición es `menu`.

Se decidió un adaptador con dos comportamientos:

- **modo local**: sigue usando `mock-data` + `localStorage`,
- **modo Supabase**: se activa solo cuando existen:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

Razón de esta decisión:

- evita medias configuraciones difíciles de depurar,
- impide depender de credenciales para correr la demo local,
- mantiene reversible la migración del catálogo.

Además, `/orders` no migra todavía como módulo, pero sí consume el mismo catálogo ya resuelto por el adaptador de `menu` para no desalinear disponibilidad ni precios.

## Estado concreto de Fase 4C

El segundo módulo en abrir esta transición es `reservations`.

Se sigue el mismo criterio de seguridad:

- **modo local** por defecto,
- **modo Supabase** solo con variables completas,
- escrituras remotas solo desde server actions,
- UI y UX sin rediseño.

La lectura remota usa la tabla `reservations` del schema preparado y mapea solo los campos que hoy ya usa la app:

- cliente,
- contacto,
- fecha,
- hora,
- cantidad,
- estado,
- notas,
- mesa asignada.

La mesa asignada queda persistida en esta fase dentro de `metadata.table_assigned_label`, para no bloquear la migración por depender todavía de una gestión completa de mesas reales.

La razón es simple:

- menú tiene menos mutaciones críticas,
- reservas son un dominio acotado,
- pedidos/cocina son el corazón operativo y requieren más cuidado,
- dashboard puede migrarse al final porque depende de los anteriores.

## Roadmap posterior

Se deja explícitamente fuera de esta fase:

- stock,
- recetas,
- costeo,
- delivery,
- pagos reales,
- facturación fiscal real.
