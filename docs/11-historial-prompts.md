# 11 — Historial de prompts de desarrollo

## Objetivo

Registro cronológico de los requerimientos (prompts) que fueron guiando la evolución
de Bistró OS desde la landing hacia el SaaS multi-restaurante con carta administrable.
Sirve para trazar decisiones, defender el proyecto y reconstruir el contexto sin releer
todo el código.

> Distinto de `10-prompts-actuales.md` (prompts de agentes IA del producto).
> Esto es la bitácora de los pedidos de **construcción** del sistema.

Período: mayo 2026.

---

## 1. Arquitectura multi-restaurante + Supabase Auth real

**Pedido:** evolucionar a multi-restaurante; conectar a Supabase real en vez de mock;
login real con usuario y contraseña que detecte el restaurante y el rol.

**Resultado:**
- Seed de 3 restaurantes, 3 sucursales, perfiles y `role_assignments` (`scripts/seed-supabase.mjs`).
- Usuarios en Supabase Auth (`scripts/create-auth-users.mjs`).
- Login email + contraseña (`features/auth/login-action.ts`, `components/auth/LoginForm.tsx`).
- Capa `features/restaurants/db.ts` (lee Supabase, fallback mock).

## 2. Usuario genérico de acceso rápido

**Pedido:** un usuario único para probar todo.

**Resultado:** `demo@bistro-os.com` / `demo1234` (dueño de los 3 restaurantes) + panel de
accesos rápidos en el login. Más tarde se unifica la contraseña de todos a `demo1234`.

## 3. Permisos y derivación por rol/sucursal

**Pedido:** que el ingreso habilite funciones según rol; que el dueño con varias sucursales
elija, y los roles operativos entren directo.

**Resultado:**
- `/select-branch` (selector agrupado por restaurante vía `role_assignments`).
- Flujo inteligente: owner/admin con 1 sucursal → directo; con varias → selector;
  manager/waiter/kitchen → directo a su sucursal.
- Nombre del usuario en el sidebar (`PROFILE_NAME_COOKIE`).

## 4. Imágenes por restaurante (carrusel + carta)

**Pedido:** carrusel del restaurante con `restaurant-hero1/2/3`; que cada restaurante
muestre sus propias imágenes y no se mezclen.

**Resultado:**
- `HeroCarousel` busca `/{slug}-heroN.jpg`; sin imágenes propias → degradado (no mezcla).
- `PublicityBanner` con `localStorage` por restaurante.
- Nombres de archivos de platos y heroes documentados.

## 5. Gestión de restaurantes + Finanzas

**Pedido:** que el dueño vea y administre todos sus restaurantes (alta/baja) y un dashboard
de recaudación por restaurante y consolidado.

**Resultado:**
- `/restaurants` (alta/baja, asigna `role_assignment` al dueño).
- `/finances` (recaudación por restaurante + totales consolidados).
- `/branches` (alta/baja de sucursales).

## 6. Fix de test crítico (auth-roles)

**Pedido:** `tests/auth-roles.test.ts` esperaba `navigation` length 6 (frágil) tras crecer
el menú del owner; validar comportamiento real sin números rígidos.

**Resultado:** test reescrito con `toContain`/invariantes (toda ruta de `navigation` está en
`allowedRoutes`) + cobertura de `isValidRoleId` y rutas nuevas. 51 tests verde.

## 7. Menú real + limpieza de hardcode

**Pedido:** cargar la carta real (entradas/principales/parrilla/bebidas/postres) y sacar
datos inventados de los componentes.

**Resultado:** catálogo real en `features/menu/mock-data.ts`; pedidos demo referenciando los
IDs nuevos; tests de cálculos ajustados a datos derivados (no hardcode).

## 8. Carta pública + QR por restaurante

**Pedido:** que cada restaurante tenga su carta y su QR propio.

**Resultado:** ruta dinámica `/carta/[slug]` (`bistro-palermo`, `casa-norte`,
`la-mesa-dorada`); `QRPanel` genera la URL por slug; hero con nombre y color de marca.

## 9. Menú por restaurante (Casa Norte aparecía vacío)

**Pedido:** Casa Norte no mostraba menú interno.

**Resultado:** `restaurant_id` de todos los items pasado a UUIDs reales; menús propios para
Casa Norte y La Mesa Dorada. (Quedó latente la doble fuente Supabase vs mock — ver #11.)

## 10. Auditoría tipo profesor / CTO

**Pedido:** auditoría dura contra el criterio del profesor (Supabase, restaurant_id, roles,
n8n, Vercel, testing, docs); validar si arrancar en `/login` está bien.

**Resultado (hallazgos clave):**
- `/login` como entrada operativa: correcto (la landing vive en `/`).
- **Bloqueante:** `/menu` (Supabase, 4 items viejos) vs `/carta` (mock, 40 items) → doble verdad.
- README desactualizado; sin URL de Vercel; 2 de 3 workflows n8n eran pseudocódigo.
- Checklist cumple/no-cumple + plan de cierre.

## 11. Bloqueante de datos — Supabase como fuente única

**Pedido:** eliminar la doble fuente de verdad del menú; Supabase principal, mock solo
fallback; seeds idempotentes; reservas y pedidos por restaurante.

**Resultado:**
- `catalog.json` como fuente única (app + seed).
- `getMenuCatalogForRestaurant` usado por `/menu` y `/carta` (mismo repository).
- `scripts/seed-menu.mjs` y `seed-reservations.mjs` idempotentes (UUID deterministas,
  archiva obsoletos). Conteos: menú 18/13/11, categorías 5×3.
- `getReservations` parametrizado por restaurante/sucursal.
- Pedidos demo con UUIDs reales por restaurante.
- README reescrito al estado real.

## 12. Gestión real de carta desde la app (Fases 1 + 2)

**Pedido:** que owner/admin administren la carta desde `/menu` (crear/editar/precio/imagen/
disponibilidad/destacado/baja lógica), con persistencia en Supabase y upload de imágenes a
Storage; sin doble fuente; con tests y docs.

**Resultado:**
- **Fase 1 (CRUD):** `createMenuItem/updateMenuItem/archiveMenuItem` (repository) + server
  actions con guard de rol (owner/admin) y ownership por tenant; drawer `MenuItemEditor` +
  `MenuItemForm`; baja lógica (`status='archived'` + `available=false`, sin DELETE).
- **Fase 2 (Storage):** bucket `menu-images` (público); `uploadMenuImageAction` server-side
  (service role), ruta `restaurants/{rid}/menu/{item_id}/{file}`; URL pública en metadata.
- Fuente única: `/menu`, `/orders`, `/carta/[slug]` leen el mismo repository.
- Tests: `tests/menu-store-crud.test.ts` (7). Total 58 verde. Write path verificado contra
  Supabase real (create → update → archive → upload).
- Decisiones: rol `chef` → roadmap; `image_url`/`storage_path` en `metadata` con `ALTER`
  documentado en `schema.sql` para promover a columnas.

## 13. Consolidación documental post-carta

**Pedido:** actualizar todos los `.md` al estado real después de la gestión de carta,
manteniendo claro dónde vive el historial de prompts.

**Resultado:**
- README, arquitectura, base de datos, roadmap, plan Supabase, presentación e instrucciones
  internas alineadas con Supabase Auth real, menú/reservas en Supabase y pedidos/cocina en demo-store.
- Separación explícita:
  - `10-prompts-actuales.md` = prompts/agentes IA del producto.
  - `11-historial-prompts.md` = bitácora cronológica de prompts de desarrollo.
- Riesgos vigentes documentados: RLS por tenant/rol pendiente, pedidos/cocina pendientes,
  y promoción futura de `image_url`/`storage_path` desde `metadata` a columnas reales.

---

## Cómo mantener este registro

Cada vez que un prompt cambie el alcance del sistema, agregar una entrada nueva con:
**pedido** (resumen), **resultado** (qué se construyó), y **archivos/decisiones** clave.
