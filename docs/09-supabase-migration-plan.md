# 09 — Supabase migration plan

## Menú — migrado a Supabase (mayo 2026)

Estado: **completo**. El menú es el primer módulo con escritura real end-to-end.

- **Lectura:** `getMenuCatalogForRestaurant(restaurantId)` (repository) → `menu_categories` +
  `menu_items` filtrados por restaurante y `status='active'`. Fallback a `catalog.json`.
- **Escritura:** server actions (`features/menu/actions.ts`) → `createMenuItem` /
  `updateMenuItem` / `archiveMenuItem` / `setMenuItemImage`. Validan rol (owner/admin) y
  ownership por `restaurant_id` (no se confía en el cliente).
- **Seeds:** `scripts/seed-menu.mjs` (idempotente, UUID deterministas, archiva lo obsoleto).
- **Storage:** bucket `menu-images` (público). Upload vía `uploadMenuImageAction`.
- **Pendiente:** promover `image_url`/`storage_path` de `metadata` a columnas (ALTER listo
  en `schema.sql`); RLS por tenant para escritura (hoy vía service role server-side).

Próximos módulos a migrar con el mismo patrón: pedidos (`placed_orders`) y cocina
(`kitchen_events`).

## Objetivo

Conectar Supabase de forma gradual sin romper la demo actual ni los fallbacks locales.

La meta no es "migrar todo" de una vez.  
La meta es sustituir stores locales por persistencia real módulo por módulo.

## Criterios de la migración

- no tocar UI antes de tiempo,
- no mezclar varios dominios críticos en la misma fase,
- mantener el sistema demostrable aun si una fase queda a mitad de camino,
- preservar compatibilidad con el modelo operativo ya validado.

---

## Fase 4A — Preparación de backend ✅ COMPLETADA

Incluye:

- esquema SQL alineado con el producto actual,
- seed coherente con la demo,
- RLS inicial sin complejidad excesiva,
- documentación de migración.

No incluye:

- auth real,
- sincronización tiempo real.

---

## Fase 4B — Conectar `menu` ✅ COMPLETADA

**Qué cubre:** leer categorías y productos desde Supabase, crear/editar/archivar productos, persistir `available` y `featured`, subir imágenes a Storage y hacer que `/orders` y `/carta/[slug]` consuman el mismo catálogo resuelto.

**Cómo está implementado:** `repository.ts` decide entre `local` y `supabase`. Si faltan variables de entorno el sistema sigue en modo local. Con variables completas, `/menu` lee desde Supabase y persiste cambios server-side. `/orders` reutiliza ese catálogo sin migrar todavía su propio dominio.

**Verificación:** `scripts/seed-menu.mjs` deja 42 items activos repartidos 18/13/11 y 15 categorías activas (5 por restaurante). CRUD y upload verificados contra Supabase real.

---

## Fase 4C — Conectar `reservations` ✅ COMPLETADA

**Qué cubre:** persistir reservas, cambios de estado y asignación de mesa, manteniendo filtros y UX actual.

**Cómo está implementado:** mismo patrón que 4B. `repository.ts` decide entre `local` y `supabase`. Lectura remota desde tabla `reservations`. Escrituras vía server actions. Store local como capa de resiliencia. Mesa asignada persistida en `metadata.table_assigned_label` hasta tener gestión real de mesas.

**Verificación:** `scripts/seed-reservations.mjs` deja reservas por los 3 restaurantes; `/reservations` filtra por restaurante/sucursal activos.

---

## Fase 4D — Conectar `orders` y `kitchen` (PENDIENTE)

**Qué cubre:** persistir pedidos reales, items de pedido, transición de estados y registro de `kitchen_events`.

**Riesgo:** es el corazón operativo. Si se implementa mal, la demo pierde coherencia entre salón y cocina. Migrar escritura primero, luego lectura compartida en cocina, luego eventos.

**Estado actual:** las tablas `placed_orders`, `order_items` y `kitchen_events` ya están modeladas en `supabase/schema.sql`, pero el código todavía usa demo-store/localStorage. El trabajo pendiente es el adaptador de lectura/escritura y la migración gradual de UX.

---

## Fase 4E — Conectar `dashboard` (PENDIENTE)

Depende de tener ya conectados: `menu` ✅, `reservations` ✅, `orders` ⏳, `kitchen` ⏳ y al menos parte de `sales` ⏳.

---

## Fase 4G — Conectar análisis financiero (PENDIENTE)

**Estado actual:** `/finances` ya existe como tablero demo con gráficos, tabla de ventas,
exportación Excel, medios de pago, costos por producto, faltantes de insumos, mesas, gastos
y empleados.

**Qué falta:** persistir esas fuentes en Supabase y derivarlas de módulos reales:
`placed_orders`, `order_items`, `sales_payments`, `cash_closings`, inventario y nómina.

---

## Fase 4F — RLS serio por tenant/rol (PENDIENTE)

**Qué cubre:** fortalecer acceso por tenant, aislar por restaurante y sucursal desde RLS, y definir políticas por rol (owner, admin, manager, waiter, kitchen) además de los guards server-side actuales.

**Estado actual:** Supabase Auth ya funciona y la app resuelve perfil/rol/restaurante. Las escrituras críticas de menú usan service role server-side con validación de cookies y ownership; falta llevar ese aislamiento a políticas DB completas.

---

## Fuera de este plan inmediato

- n8n como capa crítica,
- facturación fiscal real,
- pagos reales,
- stock/costeo,
- delivery,
- multi-sucursal avanzada con reglas complejas.
