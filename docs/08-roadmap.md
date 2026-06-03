# 08 — Roadmap

## ✅ Completado — Gestión de carta (mayo 2026)

- ✅ `/menu` como gestor real: crear/editar/precio/categoría/estación/disponibilidad/destacado.
- ✅ Baja lógica (`status='archived'`), nunca DELETE físico.
- ✅ Persistencia en Supabase (repository + server actions) con fallback localStorage.
- ✅ `/menu`, `/orders`, `/carta/[slug]` con fuente única.
- ✅ Upload real de imágenes a Supabase Storage (bucket `menu-images`).
- ✅ Permisos server-side: owner/admin.

## ✅ Completado — Reservas multi-canal (junio 2026)

- ✅ Formulario público `/reservar/[slug]` — sin login, graba directo a Supabase.
- ✅ Auto-refresh 30 segundos en `/reservations` + botón "Actualizar" manual.
- ✅ Bot Telegram vía n8n (`1Twr5DBBHwtIrjy9`) con audio + texto conversacional.
- ✅ Todos los canales usan los mismos IDs canónicos (`000...`) → visible al dueño.
- ✅ Carta pública con botón "Reservar mesa" en hero y footer.
- ✅ URLs públicas en sidebar con botón "Copiar" por restaurante.
- ✅ `v_branch_capacity` y `available_tables_for_reservation()` en Supabase.
- ✅ RLS abierto para reservas, eventos, mesas, restaurantes y sucursales.

## ✅ Completado — Fixes Fase 1 feedback profesor (junio 2026)

- ✅ Sidebar scroll con mouse wheel (`overflow-y-auto` + `h-screen sticky`).
- ✅ Dashboard: texto "Received" → "Recibidos" (idioma consistente).
- ✅ Dashboard: tipografía ajustada (`text-5xl lg` en vez de `text-6xl`) — mejor en tablets.
- ✅ `currentPath="/users"` en UsersPage — guard de rol correcto.
- ✅ `updateReservationTable`: merge de metadata existente (no pisa `source` ni otros campos).
- ✅ IDs reservas unificados: `/reservar/[slug]` usa `000...` (mismo que panel interno).

## Estado del MVP (junio 2026)

| Módulo | Estado | Persistencia |
|---|---|---|
| Auth + roles | ✅ Operativo | Supabase Auth |
| Menú / carta | ✅ Operativo | Supabase |
| Reservas web | ✅ Operativo | Supabase |
| Reservas Telegram | ✅ Operativo (n8n) | Supabase |
| Reservas manual | ✅ Operativo | Supabase |
| Sucursales | ✅ Operativo | Supabase |
| Usuarios | ✅ Operativo | Supabase Auth |
| Pedidos / cocina | ⚠️ Demo operativo | localStorage |
| Dashboard | ⚠️ Demo | localStorage + Supabase parcial |
| Ventas / caja | ⚠️ Simulado | mock-data |
| Finanzas | ⚠️ Demo analítica | mock-data determinístico |
| Capacidad mesas | ✅ Vista SQL | Supabase |
| Sitio público | ✅ Operativo | — |

## Pendiente — Fase 2 (siguiente prioridad)

### 2.1 Ventas conectada a datos reales
- Derivar resumen de `useDemoOrders` (pedidos del demo-store) en vez de `mock-data` estático.
- `/sales` mostraría ventas del día basadas en pedidos reales del restaurante activo.
- Archivos: `features/sales/calculations.ts`, `sales/page.tsx`.
- Complejidad: MEDIA.

### 2.2 WhatsApp — módulo "integración futura" profesional
- Eliminar cualquier referencia a WhatsApp como feature activo si no existe.
- Agregar sección en la app: "Canales adicionales" con WhatsApp documentado como próximo canal.
- Documentar arquitectura: webhook entrante → n8n/Make → Supabase → app.
- No simular mensajes ni mostrar números falsos.
- Complejidad: BAJA.

### 2.3 Facturación simulada + ARCA futura
- Generar "comprobante interno" al cerrar caja (PDF simple con datos del turno).
- Sección informativa sobre integración ARCA: qué se necesita, qué NO hacer.
- No hardcodear CUIT, certificados ni tokens fiscales.
- Complejidad: MEDIA.

### 2.4 Espaciados y QR
- Ajustar padding superior de algunas páginas donde el contenido "empieza muy arriba".
- Corregir texto en QRPanel ("funciona sin internet" es incorrecto, el QR apunta a una URL web).
- Complejidad: BAJA.

## Pendiente — Fase 3 (datos reales)

### 3.1 Persistir pedidos en Supabase (Fase 4D)
- `placed_orders`, `order_items` → insertar desde el demo-store.
- `kitchen_events` → registrar transiciones de estado.
- Riesgo: es el corazón operativo. Migrar escritura primero, luego lectura compartida.

### 3.2 Dashboard financiero con datos reales (Fase 4G)
- Conectar `/finances` a `placed_orders`, `sales_payments`, `cash_closings`.
- Persistir inventario/insumos y alertas de faltantes.
- Mantener exportación Excel como salida operativa.

### 3.3 RLS por tenant y rol (Fase 4F)
- Supabase Auth ya activo.
- Pendiente: endurecer políticas con `auth.uid()` + `profiles` + `role_assignments`.
- Pendiente: aislar escrituras por tenant en DB además de guards server-side.

## Pendiente — Fase 4 (producto profesional)

### 4.1 Workflow Telegram: migrar a IDs `000...`
- Actualizar `Buscar Restaurante` en n8n para no filtrar por `source=seed_demo`.
- Usar slugs como filtro: `metadata->>slug=eq.{restaurant_slug}`.
- Asegurar que `carta_url` esté en metadata de restaurantes `000...`.

### 4.2 Refresco automático de usuarios
- Después de crear un usuario, la lista se actualiza sin recarga manual.
- Usar `router.refresh()` desde `CreateUserForm.tsx`.

### 4.3 Deuda técnica menor
- Fijar versiones en `package.json` (actualmente usa `"latest"` en deps de producción).
- Eliminar `features/kitchen/mock-data.ts` (código muerto, nunca se importa).
- Agregar `"engines": { "node": ">=20" }` en `package.json`.

## Roadmap posterior sugerido

- Stock e ingredientes.
- Recetas y costeo.
- Caja multi-turno.
- Análisis financiero real con gastos, nómina e inventario persistidos.
- Multi-sucursal completo.
- Delivery / integración Rappi / PedidosYa.
- Pagos reales (Mercado Pago, Stripe).
- ARCA (facturación fiscal) como integración oficial.

## Límites explícitos del estado actual

- Pedidos y cocina en localStorage (Fase 4D pendiente).
- Ventas/caja simuladas — no conectan con pedidos reales todavía.
- n8n workflow Telegram usa IDs `111...` (seed_demo) — pendiente migrar a `000...`.
- Sin facturación fiscal real.
- Sin pagos reales.
- Sin delivery.
- RLS en Supabase es permisivo (demo) — Fase 4F endurecerá con auth.uid() por tenant.
