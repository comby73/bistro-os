# 04 — Automatizaciones n8n

## Workflow principal: captura de lead

### Caso

Un restaurante solicita una demo desde la landing.

### Flujo

1. Webhook recibe datos.
2. Valida campos críticos.
3. Guarda lead en Supabase.
4. Clasifica lead con IA.
5. Envía notificación interna.
6. Registra evento en `events`.

### Variables necesarias

```env
N8N_LEAD_WEBHOOK_URL=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

## Justificación

El workflow demuestra integración real entre formulario, base de datos, automatización y agente IA sin mezclar esa lógica dentro del frontend.

---

## Arquitectura desde Next.js 16 — Server Action

### Flujo técnico

```
DemoLeadForm.tsx (Client Component)
  └─ llama await submitLead(form)
       │
       │  Next.js RPC boundary ("use server")
       ▼
actions.ts (Server Action — corre en Node.js)
  ├─ Valida con Zod
  ├─ Lee process.env.N8N_LEAD_WEBHOOK_URL  ← solo disponible server-side
  ├─ Si URL existe → POST al webhook de n8n
  └─ Si URL no existe → mock con mensaje de desarrollo
```

### Por qué `"use server"` resuelve el problema

`actions.ts` tiene `"use server"` como primera línea. Esto le indica al bundler de Next.js que todas las funciones exportadas son Server Actions. Cuando `DemoLeadForm` llama `submitLead(form)`, Next.js lo convierte en una llamada RPC transparente: el payload viaja al servidor, la función corre en Node.js, y el resultado serializado vuelve al cliente.

Sin `"use server"`, `submitLead` corría en el browser y `process.env.N8N_LEAD_WEBHOOK_URL` era siempre `undefined` (las variables sin prefijo `NEXT_PUBLIC_` no se exponen al cliente).

### Variables requeridas en `.env.local`

| Variable | Obligatoria | Descripción |
|---|---|---|
| `N8N_LEAD_WEBHOOK_URL` | No (usa mock si falta) | URL del webhook de n8n para captura de leads |
| `DEMO_AUTH_BYPASS` | Sí (demo) | `true` para navegar sin login durante la demo académica |

### Comportamiento por entorno

| Entorno | `N8N_LEAD_WEBHOOK_URL` | Comportamiento |
|---|---|---|
| Desarrollo sin n8n | no definida | Mock: respuesta simulada en 300 ms |
| Desarrollo con n8n local | definida | POST real al webhook |
| Producción | definida | POST real al webhook |
