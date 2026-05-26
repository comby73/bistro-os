# Bistró OS

**Bistró OS** es un prototipo SaaS para restaurantes de gama media-alta en LATAM.  
Centraliza reservas, pedidos, cocina, ventas y automatizaciones con IA en una plataforma modular.

## Objetivo del proyecto

Construir un proyecto final profesional aplicando Vibe Coding:

- Landing comercial premium.
- Captura de leads para demo.
- Dashboard operativo MVP.
- Módulos de reservas, pedidos, menú y cocina.
- Base de datos Supabase preparada.
- Workflows n8n documentados.
- Prompts/agentes IA centralizados.
- Testing básico.
- Documentación técnica y comercial.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- n8n
- OpenAI/LLM como capa asistiva
- Vitest para pruebas básicas

## Instalación

```bash
npm install
npm run dev
```

Luego abrir:

```txt
http://localhost:3000
```

## Variables de entorno

Copiar `.env.example` a `.env.local` y completar:

```bash
cp .env.example .env.local
```

## Rutas principales

| Ruta | Descripción |
|---|---|
| `/` | Landing comercial |
| `/demo` | Formulario de solicitud de demo |
| `/dashboard` | Panel operativo MVP |
| `/reservations` | Gestión de reservas |
| `/orders` | Gestión de pedidos |
| `/kitchen` | Panel de cocina tipo KDS |
| `/menu` | Menú digital/admin básico |

## Estado actual

Este scaffold está preparado para trabajar en Claude Code/OpenClaude.  
La integración real con Supabase, n8n y WhatsApp queda preparada por documentación, schema y placeholders seguros.

## Decisión de arquitectura

El proyecto se organiza por módulos funcionales en `src/features` y componentes visuales reutilizables en `src/components`.  
Esto evita componentes gigantes, reduce acoplamiento y facilita escalar el MVP.
