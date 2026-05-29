# 09 — Supabase migration plan

## Objetivo

Conectar Supabase de forma gradual sin romper la demo actual basada en `localStorage`.

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

**Qué cubre:** leer categorías y productos desde Supabase, persistir `available` y `featured`, que `/orders` consuma el mismo catálogo resuelto.

**Cómo está implementado:** `repository.ts` decide entre `local` y `supabase`. Si faltan variables de entorno el sistema sigue en modo local. Con variables completas, `/menu` lee desde Supabase y persiste cambios server-side. `/orders` reutiliza ese catálogo sin migrar todavía su propio dominio.

**Verificación:** `menu_items` en Supabase responde con 4 registros (HTTP 200).

---

## Fase 4C — Conectar `reservations` ✅ COMPLETADA

**Qué cubre:** persistir reservas, cambios de estado y asignación de mesa, manteniendo filtros y UX actual.

**Cómo está implementado:** mismo patrón que 4B. `repository.ts` decide entre `local` y `supabase`. Lectura remota desde tabla `reservations`. Escrituras vía server actions. Store local como capa de resiliencia. Mesa asignada persistida en `metadata.table_assigned_label` hasta tener gestión real de mesas.

**Verificación:** `reservations` en Supabase responde HTTP 200 (tabla vacía, esperando datos operativos reales).

---

## Fase 4D — Conectar `orders` y `kitchen` (PENDIENTE)

**Qué cubre:** persistir pedidos reales, items de pedido, transición de estados y registro de `kitchen_events`.

**Riesgo:** es el corazón operativo. Si se implementa mal, la demo pierde coherencia entre salón y cocina. Migrar escritura primero, luego lectura compartida en cocina, luego eventos.

**Bloqueante actual:** la tabla `placed_orders` no existe todavía en Supabase. Requiere migración SQL antes de conectar el adaptador.

---

## Fase 4E — Conectar `dashboard` (PENDIENTE)

Depende de tener ya conectados: `menu` ✅, `reservations` ✅, `orders` ⏳, `kitchen` ⏳ y al menos parte de `sales` ⏳.

---

## Fase 4F — Auth real y RLS serio (PENDIENTE)

**Qué cubre:** vincular `profiles.auth_user_id` con Supabase Auth, activar acceso por tenant, aislar por restaurante y sucursal, definir políticas RLS por rol (owner, admin, manager, waiter, kitchen).

**Por qué va al final:** primero conviene estabilizar el modelo y las escrituras. Recién después tiene sentido cerrar el perímetro de seguridad real.

---

## Fuera de este plan inmediato

- n8n como capa crítica,
- facturación fiscal real,
- pagos reales,
- stock/costeo,
- delivery,
- multi-sucursal avanzada con reglas complejas.
