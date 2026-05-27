# 03 — Base de datos

## Estado actual

Todavía no hay persistencia real conectada en la app.  
El sistema operativo demo usa:

- mocks en `src/features/*/mock-data.ts`
- `localStorage` para flujos interactivos demo, especialmente pedidos/cocina

## Persistencia futura

La base prevista sigue siendo **Supabase PostgreSQL**.

## Decisión

Supabase sigue siendo adecuado porque aporta:

- base relacional,
- autenticación,
- políticas,
- API y SDK ya alineados con el stack.

## Qué se persistirá primero

En Fase 4, la prioridad probable es:

1. perfiles y roles,
2. pedidos,
3. items de pedido,
4. tickets de cocina,
5. reservas,
6. ventas operativas,
7. eventos/automatizaciones.

## Tablas objetivo

- `profiles`
- `restaurants`
- `branches`
- `menu_categories`
- `menu_items`
- `reservations`
- `orders`
- `order_items`
- `kitchen_tickets`
- `sales`
- `sale_payments`
- `events`
- `leads`
- `ai_interactions`

## Convenciones

- tablas en plural,
- columnas en `snake_case`,
- UUID como `primary key`,
- timestamps `created_at` y `updated_at`,
- `status` para flujos operativos,
- `metadata` JSONB para extensibilidad.

## Nota importante

`/sales` hoy **no representa facturación fiscal real**.  
La futura base de datos almacenará cierres y ventas operativas del sistema, no comprobantes fiscales homologados.
