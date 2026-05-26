# 02 — Arquitectura

## Stack

- Next.js + TypeScript para frontend/app.
- Tailwind CSS para UI.
- Supabase PostgreSQL para datos.
- n8n para workflows.
- LLM como capa asistiva documentada.

## Principios

1. Modularidad.
2. Separación UI / negocio / datos.
3. Datos mock hasta integración real.
4. Variables de entorno para credenciales.
5. Prompts centralizados.
6. Testing básico de validaciones.

## Capas

```txt
Landing / App UI
→ Features modules
→ Validations / actions
→ Supabase
→ n8n workflows
→ Agentes IA
```

## Módulos

- leads
- restaurants
- reservations
- orders
- menu
- kitchen
- analytics
- ai
