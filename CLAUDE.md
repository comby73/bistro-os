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

## Próximas tareas sugeridas

1. Consolidar flujo operativo Mozo → Pedido → Cocina.
2. Mejorar reservas operativas.
3. Conectar persistencia real con Supabase.
4. Reintroducir automatizaciones opcionales con n8n.
5. Preparar demo y defensa final.
