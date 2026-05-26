# 03 — Base de datos

## Motor

Supabase PostgreSQL.

## Decisión

Supabase es adecuado porque ofrece base relacional, API REST automática, autenticación y políticas de seguridad.

## Convenciones

- Tablas en plural.
- Columnas en snake_case.
- UUID como primary key.
- created_at y updated_at.
- status para flujos.
- metadata JSONB para extensibilidad.

## Tablas

- leads
- restaurants
- branches
- profiles
- menu_categories
- menu_items
- reservations
- orders
- order_items
- kitchen_tickets
- feedback
- ai_interactions
- events

Ver SQL en `/supabase/schema.sql`.
