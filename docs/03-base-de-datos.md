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

## Modelo relacional futuro

Tomando como referencia sistemas profesionales de gestión gastronómica, el modelo futuro debería cubrir al menos cuatro grupos de entidades:

### 1. Operación FOH

- `profiles`
- `employees`
- `restaurant_tables`
- `reservations`
- `placed_orders` o `orders`
- `order_items`
- `payments`

### 2. Operación BOH

- `kitchen_tickets`
- `ticket_events`
- `menu_categories`
- `menu_items`
- `menu_item_modifiers`

### 3. Caja y ventas operativas

- `sales`
- `sale_payments`
- `cash_sessions`
- `cash_movements`

### 4. Administración futura

- `ingredients`
- `recipe_ingredients`
- `inventory_movements`
- `supplier_prices`
- `events`

## Consideraciones de diseño

- El pedido es la entidad transaccional central.
- `order_items` debe desacoplarse del menú publicado para conservar precio histórico y notas del cliente.
- Caja y ventas operativas deben modelarse aparte del pedido para permitir múltiples medios de pago y arqueos.
- Cocina puede persistir tickets propios o derivar vistas desde `orders` + `order_items` según complejidad futura.
- Para evitar ambigüedades SQL, una tabla futura puede llamarse `placed_orders` en vez de `order` si el equipo prefiere evitar palabras reservadas.

## APIs y eventos futuros

Cuando Supabase entre en Fase 4, este modelo debería soportar:

- lectura/escritura de pedidos,
- actualización de estados de cocina,
- cierres de caja,
- disponibilidad de menú,
- webhooks opcionales para eventos operativos.

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

Stock y costeo quedan deliberadamente como roadmap posterior; no forman parte del MVP actual con mocks/localStorage.
