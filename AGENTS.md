# Bistró OS — Codex Project Instructions

## Proyecto

Bistró OS es una aplicación operativa para restaurantes, no solo una landing.
El foco actual es construir una demo funcional con roles internos:

- owner: Dueño
- admin: Administrador
- manager: Jefe de sala
- waiter: Mozo
- kitchen: Cocina

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase real conectado para auth, restaurantes, menú y reservas
- n8n opcional/no bloqueante
- Datos mock/localStorage solo como fallback o para módulos aún no migrados

## Estado actual

Implementado:

- Landing pública
- /login con Supabase Auth real
- AppShell interno
- navegación por rol
- control de acceso por rol
- /dashboard
- /orders
- /reservations
- /kitchen
- /menu con gestión real de carta y Storage
- /sales como módulo de Ventas y caja operativo simulado
- tests de roles y cálculos de ventas

Pendiente:

- Fase 4D: pedidos y cocina en Supabase
- RLS por tenant/rol para escrituras
- Reactivación/reordenamiento de productos de carta
- Fase 5: n8n opcional
- Fase 6: documentación final y defensa

## Reglas estrictas

- No tocar la base interna de n8n.
- No editar SQLite de n8n.
- No importar workflows automáticamente.
- No cambiar conexión Supabase ni RLS sin autorización.
- No conectar n8n sin autorización.
- No agregar dependencias sin preguntar.
- No cambiar la estética general dark/champagne.
- No rehacer la landing salvo pedido explícito.
- Mantener componentes pequeños y modulares.
- Separar lógica de negocio de UI.
- Mantener TypeScript estricto.
- Todo cambio importante debe actualizar documentación.
- Todo cambio debe pasar:
  npm run lint
  npm test
  npm run build

## Decisiones de producto

- /sales representa “Ventas y caja”, no facturación fiscal real.
- n8n es una capa externa opcional y no debe bloquear la app.
- Supabase es persistencia real para auth, tenant, menú y reservas.
- La app debe poder demostrarse sin servicios externos.
