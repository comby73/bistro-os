# Bistró OS

**Bistró OS** es una demo funcional de aplicación operativa para restaurantes.  
El foco actual ya no es la landing comercial, sino el sistema interno: roles demo, pedidos, cocina, reservas, menú, dashboard y ventas/caja simulada.

## Qué es ahora

- App interna para operación de restaurante.
- Navegación y acceso por rol demo.
- Módulos funcionales conectados entre sí con datos mock.
- Modos visuales diferenciados para gestión, servicio y cocina.
- Integraciones reales todavía desacopladas:
  - Supabase queda preparado como persistencia futura.
  - n8n queda como automatización opcional y no bloqueante.

## Roles demo

| Rol | Qué puede hacer hoy |
|---|---|
| `owner` | Ver dashboard, ventas/caja, pedidos, reservas, cocina y menú |
| `admin` | Ver dashboard, ventas/caja, pedidos, reservas, cocina y menú |
| `manager` | Ver dashboard, ventas/caja en solo lectura, pedidos, reservas y menú en supervisión |
| `waiter` | Usar `/orders` en modo servicio y consultar `/menu` en formato rápido |
| `kitchen` | Usar `/kitchen` como KDS con tickets grandes y acciones de avance |

## Rutas principales

| Ruta | Estado |
|---|---|
| `/` | Landing existente, no prioritaria |
| `/login` | Selector de rol demo |
| `/dashboard` | Vista interna adaptada por rol |
| `/orders` | Pedidos activos + creación de pedido demo |
| `/kitchen` | KDS demo con avance de estados |
| `/reservations` | Gestión operativa de reservas con store demo |
| `/menu` | Carta operativa con disponibilidad persistida en demo |
| `/sales` | Ventas y caja simulada |
| `/demo` | Formulario comercial / lead demo |

## Módulos implementados

- Sistema de roles demo.
- `AppShell` interno con navegación por rol.
- Dashboard contextual por rol.
- Dashboard vivo derivado de pedidos, reservas y ventas simuladas.
- Pedidos.
- Cocina.
- Reservas.
- Reservas operativas con filtros y estados.
- Menú operativo con disponibilidad y destacados persistidos en `localStorage`.
- Ventas y caja simulada.
- Captura de leads demo con automatización opcional.

## Estado de integraciones

- **Supabase**: todavía no conectado como persistencia real.
- **n8n**: integración opcional/no bloqueante.
- **Facturación fiscal**: no implementada. `/sales` representa solo facturación operativa simulada.

## Estado de backend

- La app sigue usando `mock-data` + `localStorage`.
- `supabase/schema.sql` ya modela el backend futuro de forma más completa.
- La migración real a Supabase será incremental por módulo, no un reemplazo total de una vez.
- Fase 4B deja `menu` preparado para leer/escribir en Supabase solo si las variables están completas; si no, el fallback local sigue siendo el comportamiento por defecto.

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

Abrir:

```txt
http://localhost:3000
```

Para entrar al sistema interno:

```txt
http://localhost:3000/login
```

## Variables de entorno

Copiar `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Valores importantes hoy:

- `DEMO_AUTH_BYPASS=true` para navegar la demo sin auth real.
- `N8N_LEAD_WEBHOOK_URL` es opcional.
- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` habilitan lectura pública potencial.
- `SUPABASE_SERVICE_ROLE_KEY` se usa solo server-side para activar la escritura segura del módulo `menu`.

## Validación de calidad

```bash
npm run lint
npm test
npm run build
```

## Roadmap inmediato

1. Fase 3A: flujo Mozo → Pedido → Cocina.
2. Fase 3B: reservas operativas.
3. Fase 4: Supabase real.
4. Fase 5: automatización n8n opcional.
5. Fase 6: preparación de defensa/presentación.
