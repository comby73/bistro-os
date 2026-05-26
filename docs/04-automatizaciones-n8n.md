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
