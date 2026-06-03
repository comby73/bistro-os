# Instrucciones para Claude Code / OpenClaude

## Rol

Actuá como Senior Product Designer + Front-end Architect + Full-stack Developer.

## Proyecto

Bistró OS es un SaaS operativo multi-restaurante para restaurantes, con foco en flujo interno, no en la landing.

## Estado real (junio 2026)

- Roles implementados: `owner`, `admin`, `manager`, `waiter`, `kitchen`.
- `AppShell` interno con navegación por rol y contexto de restaurante/sucursal.
  - Sidebar tiene `overflow-y-auto` y `h-screen sticky` → scroll con mouse wheel correcto.
  - Sección "🌐 Sitio público" en sidebar muestra URLs públicas con botón copiar.
- `/login` con Supabase Auth real (email + password).
- Módulos activos: dashboard, pedidos, cocina, reservas, menú/carta, ventas/caja, finanzas, usuarios, sucursales y restaurantes.
- `/sales` no es facturación fiscal real.
- `/finances` es Análisis financiero demo: ventas, pagos, costos, inventario, mesas, gastos, nómina y exportación Excel.
- Los importes visibles se muestran en pesos argentinos con tasa demo fija `1 USD = $1430 ARS`.
- Supabase es persistencia activa para auth, restaurantes, sucursales, perfiles/roles, menú y reservas.
- Pedidos y cocina siguen en demo-store/localStorage hasta Fase 4D.
- n8n es opcional y no debe bloquear flujos.
- Vercel corre Linux; no agregar bindings nativos Windows como dependencia directa.

## Canales de reserva

| Canal | Graba en Supabase | source en metadata |
|---|---|---|
| Formulario `/reservar/[slug]` | Sí, vía Server Action con service_role | `web_form` |
| Telegram bot (n8n) | Sí, vía HTTP POST de n8n | `telegram_audio` / `telegram_text` |
| Staff manual (`/reservations`) | Sí, vía server action | `demo` |

## IDs canónicos de restaurantes

**SIEMPRE usar estos IDs** en formularios, seeds y workflows externos:

| Restaurante | restaurant_id | branch_id |
|---|---|---|
| Bistró Palermo | `00000000-0000-0000-0000-000000000001` | `00000000-0000-0000-0000-000000000010` |
| Casa Norte | `00000000-0000-0000-0000-000000000002` | `00000000-0000-0000-0000-000000000020` |
| La Mesa Dorada | `00000000-0000-0000-0000-000000000003` | `00000000-0000-0000-0000-000000000030` |

> `seed_restaurants_demo.sql` crea un set `111.../222.../333...` para testing de n8n con mesas.
> No usar esos IDs en el código de la app; solo sirven para el workflow Telegram mientras se
> unifican completamente.

## Stack

- Next.js App Router
- TypeScript estricto
- Tailwind CSS
- Supabase real conectado para auth, tenant, menú y reservas
- n8n como integración opcional (Telegram bot `1Twr5DBBHwtIrjy9`)
- Prompts/agentes documentados en `/prompts`

## Rutas clave

| Ruta | Tipo | Notas |
|---|---|---|
| `/reservar/[slug]` | Pública sin login | Server action con service_role. IDs: `000...001/002/003` |
| `/carta/[slug]` | Pública sin login | Botón "Reservar mesa" apunta a `/reservar/[slug]` |
| `/reservations` | Privada (staff) | Auto-refresh 30s con `router.refresh()` + botón manual |
| `/users` | Privada (owner) | `currentPath="/users"` necesario en AppShell para guard de rol |

## Reglas obligatorias

1. No crear componentes gigantes.
2. No mezclar UI, lógica de negocio y acceso a datos.
3. Usar `src/features` para reglas de negocio, tipos, stores y validaciones.
4. Usar `src/components` para UI reutilizable.
5. Usar Supabase para dominios ya migrados; mantener fallback local/demo donde corresponda.
6. No inventar credenciales.
7. No exponer service role keys en cliente. `createServerSupabaseClient()` es **solo server-side**.
8. Mantener estética dark/champagne.
9. Documentar decisiones relevantes en `/docs`.
10. Tratar n8n como integración externa opcional.
11. No presentar `/sales` como módulo fiscal real.
12. **Siempre usar los IDs canónicos `000...` para restaurantes** — nunca los IDs del seed_demo.
13. Al actualizar `metadata` en Supabase, siempre hacer merge (`{...prevMeta, ...nuevoCampo}`) para no pisar campos existentes.

## Supabase — convenciones

- `createBrowserSupabaseClient()` → solo para componentes cliente de lectura pública.
- `createServerSupabaseClient()` → server components, server actions, API routes. Usa service_role.
- RLS: todas las tablas tienen RLS habilitado. Las políticas están en `supabase/policies.sql`.
  - Lectura pública: `menu_categories`, `menu_items` (active/available).
  - Escritura y lectura para app: `reservations`, `events`, `restaurant_tables`, `restaurants`, `branches` — policies abiertas (demo); Fase 4F endurecerá con auth.uid().
- Vista `v_branch_capacity`: capacidad total y disponible por sucursal.
- Función `available_tables_for_reservation(branch_id, date, time, party_size)`: mesas libres.
- Ambas creadas en `supabase/migration_capacity.sql`.

## Sistema de imágenes

### Banner de publicidad del restaurante
- Componente: `src/components/dashboard/PublicityBanner.tsx`
- Solo visible para roles `owner` y `admin` en el dashboard.
- Se guarda en `localStorage` con clave `bistro_publicity_banner` (base64).

### Fotos de platos en el menú
- Tipo: `MenuItem.image_url?: string` en `src/features/menu/types.ts`.
- Upload real al bucket público `menu-images`, ruta `restaurants/{restaurant_id}/menu/{item_id}/{file}`.

## Diseño y estética

### Paleta y tipografía
- Dark theme con acentos dorados: `gold:#E8B863`, `goldhi:#F2D69B`, `golddim:#8A6B36`.
- Fuente base: 15px / line-height 1.6. Textos secundarios mínimo `text-paper/65`.
- Evitar opacidades menores a `/60` para texto legible.

### Clases de sistema (globals.css)
- `.card-animated` — entrada con fade-up (0.4s ease).
- `.glow-gold` — pulso dorado para highlights.
- `.card-premium` — glass morphism + hover con `-translate-y-[1px]` y shadow dorado.

### Navegación (AppShell)
- El sidebar agrupa por secciones: General, Operación, Caja y análisis, Administración.
- Sidebar tiene `overflow-y-auto` en el contenedor interior y `h-screen sticky` en el `aside` — scrollea con mouse wheel correctamente.
- Sección "Sitio público" al final de la nav con links a `/reservar/[slug]` y `/carta/[slug]`.

### Dashboard
- Texto en español consistente (no "Received", sino "Recibidos").
- Título principal: `text-3xl md:text-4xl lg:text-5xl` (no `md:text-6xl` — rompe en tablets).
- `space-y-8` entre secciones principales.

## Próximas tareas sugeridas

1. Conectar ventas (`/sales`) con pedidos reales del demo-store.
2. Persistir pedidos y cocina en Supabase (`placed_orders`, `order_items`, `kitchen_events`).
3. Completar RLS por tenant/rol para escrituras (Fase 4F).
4. WhatsApp: módulo de "integración futura" documentado profesionalmente.
5. Facturación: simulado con comprobante interno + ARCA como integración futura.
6. Refresco automático de lista de usuarios después de crear uno.
7. Fijar versiones en `package.json` (actualmente usa `"latest"` en deps de producción).
8. Eliminar `features/kitchen/mock-data.ts` (código muerto, no se usa).
9. Actualizar workflow n8n para usar IDs `000...` en vez de `111...` del seed_demo.

## Deploy / dependencias nativas

`@vitejs/plugin-react` puede traer `rolldown` y bindings por plataforma. Mantener
`@rolldown/binding-win32-x64-msvc` fuera de `dependencies/devDependencies`.

Install Command recomendado en Vercel:
```bash
npm install --omit=optional --no-audit --no-fund
```

URL pública: https://bistro-os-phi.vercel.app
