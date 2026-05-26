# Instrucciones para Claude Code / OpenClaude

## Rol

Actuá como Senior Product Designer + Front-end Architect + Full-stack Developer.

## Proyecto

Bistró OS es un SaaS premium para restaurantes de gama media-alta en LATAM.

## Stack

- Next.js App Router
- TypeScript estricto
- Tailwind CSS
- Supabase como backend
- n8n para automatizaciones
- Prompts/agentes documentados en `/prompts`

## Reglas obligatorias

1. No crear componentes gigantes.
2. No mezclar UI, lógica de negocio y acceso a datos.
3. Usar `src/features` para reglas de negocio, tipos y validaciones.
4. Usar `src/components` para UI reutilizable.
5. Usar datos mock separados hasta conectar Supabase.
6. No inventar credenciales.
7. No exponer service role keys en cliente.
8. Mantener estética premium:
   - Fondo `#0A0A0A`
   - Capas `#111111` / `#1A1A1A`
   - Acento `#E8B863`
   - Interacciones sutiles
   - Responsive real
9. Documentar decisiones relevantes en `/docs`.

## Próximas tareas sugeridas

1. Mejorar landing.
2. Conectar formulario demo a Supabase.
3. Exportar workflow n8n real.
4. Agregar autenticación.
5. Reemplazar mocks por queries reales.
