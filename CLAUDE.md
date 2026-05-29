# Instrucciones para Claude Code / OpenClaude

## Rol

Actuá como Senior Product Designer + Front-end Architect + Full-stack Developer.

## Proyecto

Bistró OS es una aplicación operativa demo para restaurantes con foco en flujo interno, no en la landing.

## Estado real

- Roles demo implementados: `owner`, `admin`, `manager`, `waiter`, `kitchen`.
- `AppShell` interno con navegación por rol.
- `/login` como selector de rol demo.
- Módulos activos: dashboard, pedidos, cocina, reservas, menú y ventas/caja simulada.
- `/sales` no es facturación fiscal real.
- Supabase todavía no es la persistencia activa.
- n8n es opcional y no debe bloquear flujos.

## Stack

- Next.js App Router
- TypeScript estricto
- Tailwind CSS
- Supabase preparado para una fase futura
- n8n como integración opcional
- Prompts/agentes documentados en `/prompts`

## Reglas obligatorias

1. No crear componentes gigantes.
2. No mezclar UI, lógica de negocio y acceso a datos.
3. Usar `src/features` para reglas de negocio, tipos, stores y validaciones.
4. Usar `src/components` para UI reutilizable.
5. Usar datos mock y `localStorage` hasta conectar Supabase.
6. No inventar credenciales.
7. No exponer service role keys en cliente.
8. Mantener estética dark/champagne.
9. Documentar decisiones relevantes en `/docs`.
10. Tratar n8n como integración externa opcional.
11. No presentar `/sales` como módulo fiscal real.

## Sistema de imágenes (localStorage, sin servidor)

### Banner de publicidad del restaurante
- Componente: `src/components/dashboard/PublicityBanner.tsx`
- Solo visible para roles `owner` y `admin` en el dashboard.
- El dueño arrastra una imagen sobre el banner o hace clic para seleccionarla.
- Se guarda en `localStorage` con clave `bistro_publicity_banner` (base64).
- Sin imagen: muestra gradiente animado con texto "Cuisine & Ambiance".
- Para imagen fija desde código: copiar a `public/restaurant-hero.jpg` y pasar `defaultUrl` al componente.

### Fotos de platos en el menú
- Tipo: `MenuItem.image_url?: string` en `src/features/menu/types.ts`.
- Componente: `src/components/menu/MenuItemCard.tsx` — zona de imagen en la parte superior de cada card.
- Con `canEdit=true` (owner/admin): arrastrás o hacés clic sobre la zona de imagen para cambiarla.
- Se guarda en `localStorage` con clave `bistro_menu_img_{item.id}` (base64).
- Para imagen fija desde código: definir `image_url: "/menu/nombre.jpg"` en `mock-data.ts` y copiar la foto a `public/menu/`.

## Diseño y estética

### Paleta y tipografía
- Dark theme con acentos dorados: `gold:#E8B863`, `goldhi:#F2D69B`, `golddim:#8A6B36`.
- Fuente base: 15px / line-height 1.6. Textos secundarios mínimo `text-paper/65`.
- Evitar opacidades menores a `/60` para texto legible. Textos de eyebrow: `text-[12px]`.

### Clases de sistema (globals.css)
- `.card-animated` — entrada con fade-up (0.4s ease).
- `.glow-gold` — pulso dorado para highlights.
- `.card-premium` — glass morphism + hover con `-translate-y-[1px]` y shadow dorado.

### Navegación (AppShell)
- Cada ítem tiene ícono Lucide: Dashboard→`LayoutDashboard`, Ventas→`TrendingUp`, Pedidos→`ClipboardList`, Reservas→`CalendarDays`, Cocina→`ChefHat`, Menú→`BookOpen`.
- El card de rol activo usa gradiente `from-gold/8 via-ink/60`.

### Reservas (ReservationCard)
- Borde del card varía por estado: amber=pending, emerald=confirmed, sky=seated.
- Indicador de punto de color a la izquierda del nombre del cliente.
- Íconos: `Clock`, `Users`, `Phone`, `MapPin`.

### MetricCard (dashboard)
- Número en `text-[2.6rem] font-bold`.
- Barra inferior animada que se expande en hover (500ms transition).

## Próximas tareas sugeridas

1. Consolidar flujo operativo Mozo → Pedido → Cocina.
2. Conectar persistencia real con Supabase (imágenes migrar de localStorage a Supabase Storage).
3. Reintroducir automatizaciones opcionales con n8n.
4. Preparar demo y defensa final.
5. Vista de reservas en formato timeline/calendario.
