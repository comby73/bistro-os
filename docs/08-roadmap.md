# 08 — Roadmap

## Estado actual del MVP (mayo 2026)

- App operativa con roles demo.
- `AppShell` interno y navegación contextual por rol.
- `/orders` con modo servicio para mozo.
- `/kitchen` con tablero KDS con columnas color-coded por estado.
- `/reservations` como módulo operativo con adaptador Supabase activo.
- `/menu` como carta operativa con adaptador Supabase activo.
- `/sales` como ventas y caja operativa simulada.
- `/dashboard` alimentado por stores demo de pedidos y reservas.
- **Supabase conectado** para `menu` y `reservations` (Fases 4B y 4C completadas).
- Indicador de conexión Supabase visible en sidebar.
- `localStorage` como persistencia de pedidos y cocina (pendiente Fase 4D).
- n8n opcional y no bloqueante.

## Fase 3A — Flujo operativo ✅

- Consolidado Mozo → Pedido → Cocina.
- KDS con estados color-coded (recibido/preparando/listo).
- Visibilidad de tiempos y estados en tickets.
- Sistema demostrable sin backend externo.

## Fase 3B — Reservas operativas ✅

- Reservas como flujo operativo local.
- Relación con mesas, turnos y estados.
- Lectura operativa para manager y owner.
- Adaptador con fallback a localStorage.

## Fase 3D — Menú operativo ✅

- `/menu` como carta operativa por rol.
- Disponibilidad compartida entre menú y toma de pedidos.
- Edición demo de disponibilidad y destacados para owner/admin.
- Manager en modo supervisión, waiter en modo consulta rápida.

## Fase 4A — Preparación backend ✅

- Esquema SQL alineado con el producto.
- Seed coherente con la demo.
- RLS inicial sin complejidad excesiva.
- Documentación de migración.

## Fase 4B — Menú en Supabase ✅

- Categorías y productos leídos desde Supabase.
- `available` y `featured` persistidos server-side.
- `/orders` consume el mismo catálogo resuelto.
- Fallback a localStorage si las variables no están.

## Fase 4C — Reservas en Supabase ✅

- Lectura del listado desde Supabase.
- Escrituras vía server actions.
- Store local como capa de resiliencia.
- Fallback a localStorage si las variables no están.

## Fase 4D — Conectar `orders` y `kitchen`

- Persistir pedidos reales.
- Persistir items de pedido.
- Persistir transición de estados.
- Registrar `kitchen_events`.

Riesgo: es el corazón operativo. Migrar escritura primero, luego lectura compartida.

## Fase 4E — Dashboard con datos reales

Depende de tener conectados: menu, reservations, orders, kitchen y parte de sales.

## Fase 4F — Auth real y RLS serio

- Vincular `profiles.auth_user_id` con Supabase Auth.
- Activar acceso por tenant y sucursal.
- Definir permisos por rol en RLS.

## Fase 5 — Automatización n8n opcional

- Reintroducir n8n como capa externa secundaria.
- Consumir eventos ya persistidos.
- Webhooks opcionales para notificaciones y resúmenes.
- No convertir n8n en dependencia crítica.

## Fase 6 — Defensa final

- Afinar documentación final.
- Consolidar narrativa FOH / BOH.
- Presentar modelo relacional.
- Defender stock/costeo como roadmap futuro.

## Roadmap posterior sugerido

- Stock e ingredientes.
- Recetas y costeo.
- Caja multi-turno.
- APIs internas públicas.
- Webhooks de eventos operativos.
- Multi-sucursal.

## Límites explícitos del estado actual

- Pedidos y cocina aún en localStorage (Fase 4D pendiente).
- Sin n8n conectado al núcleo operativo.
- Sin facturación fiscal real.
- Sin pagos reales.
- Sin delivery.
