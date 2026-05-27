# 02 — Arquitectura

## Stack

- Next.js + TypeScript para app y UI.
- Tailwind CSS para la interfaz.
- `localStorage` + stores demo para persistencia local temporal.
- Supabase PostgreSQL preparado para persistencia real futura.
- n8n como integración opcional para automatizaciones externas.
- LLM como capa asistiva documentada, no crítica.

## Principios

1. Modularidad por dominio.
2. Separación UI / negocio / estado demo / datos futuros.
3. Roles explícitos y navegación contextual.
4. Integraciones externas no bloqueantes.
5. Mocks primero, persistencia real después.
6. Testing básico sobre validaciones y cálculos.

## Capas

```txt
Rutas App Router
→ AppShell y navegación por rol
→ Componentes de UI
→ Features (tipos, cálculos, stores demo, acciones)
→ Persistencia local temporal
→ Supabase futuro
→ Automatizaciones opcionales (n8n)
```

## Modos visuales

- Modo Gestión: `owner`, `admin`, `manager`.
- Modo Servicio: `waiter` en `/orders`.
- Modo Cocina: `kitchen` en `/kitchen`.

La misma lógica de negocio puede renderizar experiencias distintas por rol sin duplicar el store demo.

## Roles implementados

| Rol | Rutas / módulos actuales |
|---|---|
| `owner` | dashboard, sales, orders, reservations, kitchen, menu |
| `admin` | dashboard, sales, orders, reservations, kitchen, menu |
| `manager` | dashboard, sales solo lectura, reservations, orders |
| `waiter` | orders, menu, dashboard contextual |
| `kitchen` | kitchen, dashboard contextual |

## Rutas actuales

- `/`
- `/login`
- `/dashboard`
- `/orders`
- `/kitchen`
- `/reservations`
- `/menu`
- `/sales`
- `/demo`

## Módulos implementados

- `auth`: roles demo, selector y control de acceso.
- `orders`: carga y seguimiento de pedidos.
- `kitchen`: KDS demo y avance de estados.
- `reservations`: reservas mock.
- `menu`: carta digital operativa.
- `sales`: ventas y caja simulada.
- `leads`: formulario comercial con automatización opcional.

## Integraciones

- La app debe operar aunque n8n no exista o falle.
- Supabase todavía no persiste el estado operativo.
- El patrón actual favorece reemplazar stores demo por Supabase en Fase 4 sin rehacer la UI completa.
