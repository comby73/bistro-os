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
- Supabase preparado para Fase 4
- n8n opcional/no bloqueante
- Datos mock/localStorage mientras no haya backend real

## Estado actual

Implementado:

- Landing pública
- /login con selector de rol demo
- AppShell interno
- navegación por rol
- control de acceso por rol
- /dashboard
- /orders
- /reservations
- /kitchen
- /menu
- /sales como módulo de Ventas y caja operativo simulado
- tests de roles y cálculos de ventas

Pendiente:

- Fase 3A: flujo Mozo → Pedido → Cocina
- Fase 3B: reservas operativas
- Fase 4: Supabase real
- Fase 5: n8n opcional
- Fase 6: documentación final y defensa

## Reglas estrictas

- No tocar la base interna de n8n.
- No editar SQLite de n8n.
- No importar workflows automáticamente.
- No conectar Supabase sin autorización.
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
- Supabase será la persistencia real futura.
- La app debe poder demostrarse sin servicios externos.
