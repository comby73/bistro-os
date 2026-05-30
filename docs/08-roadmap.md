# 08 — Roadmap

## Hecho — Gestión de carta (mayo 2026)

- ✅ `/menu` como gestor real: crear/editar/precio/categoría/estación/disponibilidad/destacado.
- ✅ Baja lógica (`status='archived'`), nunca DELETE físico.
- ✅ Persistencia en Supabase (repository + server actions) con fallback localStorage.
- ✅ `/menu`, `/orders`, `/carta/[slug]` con fuente única (sin doble verdad).
- ✅ Upload real de imágenes a Supabase Storage (bucket `menu-images`).
- ✅ Permisos server-side: owner/admin.

## Pendiente / roadmap de carta

- Rol `chef` (jefe de cocina) con subset: descripción, imagen, disponibilidad, destacado.
- Reactivación de productos archivados desde la UI.
- Promover `image_url`/`storage_path` de `metadata` a columnas reales (ALTER en schema.sql).
- Reordenar categorías/productos (drag & drop) y posiciones persistidas.

## Estado actual del MVP (mayo 2026)

- App operativa con roles internos y Supabase Auth real.
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
- Sistema demostrable con Supabase configurado y fallback local para módulos no migrados.

## Fase 3B — Reservas operativas ✅

- Reservas como flujo operativo por restaurante/sucursal.
- Relación con mesas, turnos y estados.
- Lectura operativa para manager y owner.
- Adaptador Supabase con fallback a localStorage.

## Fase 3D — Menú operativo ✅

- `/menu` como carta operativa por rol.
- Disponibilidad compartida entre menú y toma de pedidos.
- Gestión real para owner/admin: crear, editar, archivar, disponibilidad, destacados e imagen.
- Manager en modo supervisión, waiter en modo consulta rápida.

## Fase 4A — Preparación backend ✅

- Esquema SQL alineado con el producto.
- Seed coherente con la demo.
- RLS inicial sin complejidad excesiva.
- Documentación de migración.

## Fase 4B — Menú en Supabase ✅

- Categorías y productos leídos desde Supabase.
- CRUD completo persistido server-side: crear, editar, archivar, disponibilidad y destacado.
- Upload de imágenes a Supabase Storage (`menu-images`).
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

- Supabase Auth y resolución de perfil/rol ya están activos.
- Pendiente: endurecer RLS por tenant y sucursal para escrituras.
- Pendiente: definir políticas por rol en DB además de los guards server-side.

## Nota — Contexto multi-restaurante (hecho)

Se agregó una capa de Restaurant Context (`src/features/restaurants/`). Hoy:

- 3 restaurantes con sucursal, menú y reservas propias.
- Login real; las cookies guardan restaurante, sucursal, perfil y rol resueltos desde Supabase.
- `menu`, `reservations`, `orders`, `kitchen` y `dashboard` filtran por `restaurant_id`
  cuando hay sesión activa; sin sesión, fallback a mostrar todo.

Pendiente para la fase 4F:

- Aplicar las propuestas `ALTER TABLE restaurants` (branding) comentadas en `schema.sql`.
- Filtrar por tenant también en RLS, no solo en el cliente.

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
