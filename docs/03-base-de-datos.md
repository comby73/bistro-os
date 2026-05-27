# 03 — Base de datos

## Estado actual

La app **todavía no usa Supabase como persistencia operativa**.

Hoy conviven dos mecanismos:

- `mock-data.ts` para catálogos y semillas de demo.
- `localStorage` para los módulos interactivos:
  - pedidos / cocina
  - reservas
  - menú operativo

Esto permite demostrar el producto sin backend externo mientras se estabilizan UX, permisos y flujos operativos.

## Objetivo de Fase 4A

Fase 4A no migra la app.  
Prepara el contrato de datos real en Supabase para que la migración futura sea incremental y segura.

La estrategia es:

1. definir el modelo relacional completo,
2. dejar RLS inicial sin complejidad prematura,
3. preparar seed coherente con la demo actual,
4. migrar módulo por módulo en fases posteriores.

## Persistencia futura

La base prevista sigue siendo **Supabase PostgreSQL**.

Se mantiene por tres motivos:

- encaja con el stack Next.js + TypeScript,
- resuelve bien datos relacionales operativos,
- permite evolucionar luego hacia auth real, RLS, eventos y APIs.

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

- `orders`, `reservations` y `menu` viven en stores demo locales.
- `/sales` sigue siendo cálculo mock.
- `/dashboard` deriva información desde stores locales y cálculos reutilizables.

### Futuro

- Supabase almacenará el estado operativo real.
- La UI seguirá casi igual.
- La capa que cambiará primero será la de acceso a datos.

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

- `auth_user_id` opcional hasta que exista auth real,
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

- la app aún no usa auth real,
- no conviene congelar una política incorrecta demasiado pronto.

Eso queda para Fase 4F.

## Seed de referencia

El seed actual prepara:

- 1 restaurante,
- 1 sucursal,
- perfiles demo,
- asignaciones de rol,
- mesas,
- categorías,
- productos,
- reservas,
- pedidos,
- items,
- eventos de cocina,
- pagos,
- cierre de caja,
- eventos genéricos,
- una interacción de IA.

## Estrategia de migración por módulo

La migración se hará de menor riesgo a mayor riesgo:

1. menú,
2. reservas,
3. pedidos y cocina,
4. dashboard,
5. auth real y RLS serio.

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
