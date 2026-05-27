# 02 — Arquitectura

## Stack

- Next.js + TypeScript para frontend/app.
- Tailwind CSS para UI.
- Supabase PostgreSQL para datos.
- n8n como integración opcional para workflows externos.
- LLM como capa asistiva documentada.

## Principios

1. Modularidad.
2. Separación UI / negocio / datos.
3. Datos mock hasta integración real.
4. Variables de entorno para credenciales.
5. Integraciones externas no bloqueantes.
6. Prompts centralizados.
7. Testing básico de validaciones.

## Capas

```txt
Landing / App UI
→ Features modules
→ Validations / actions
→ Supabase
→ Integraciones opcionales (n8n)
→ Agentes IA
```

## Integraciones

- La app debe operar aunque n8n no esté disponible o no esté configurado.
- Las Server Actions validan y resuelven la solicitud principal antes de depender de automatizaciones externas.
- En una fase futura, Supabase será la capa durable y n8n actuará como consumidor secundario para automatizaciones.

## Módulos

- leads
- restaurants
- reservations
- orders
- menu
- kitchen
- analytics
- ai
