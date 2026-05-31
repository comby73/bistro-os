# 04 — Automatizaciones n8n

## Decisión vigente

- n8n es una integración externa opcional.
- Bistró OS no depende de n8n para funcionar.
- Ningún flujo principal de la app debe romperse si n8n está apagado.
- La automatización actual documentada es la del formulario `/demo`.

## Qué significa “opcional/no bloqueante”

1. La app valida y resuelve la acción principal por su cuenta.
2. Si existe webhook configurado, intenta notificar a n8n.
3. Si el webhook falta o falla, la app sigue respondiendo éxito funcional.
4. Para dominios migrados a Supabase, la persistencia debe ocurrir antes de automatizar.

## Caso implementado hoy: lead comercial

`submitLead()`:

- valida con Zod,
- llama a `notifyLeadAutomation()`,
- devuelve `automationStatus`,
- no rompe el submit del formulario si n8n falla.

## Contrato de resultado

```json
{ "status": "skipped", "reason": "N8N_LEAD_WEBHOOK_URL is not configured." }
```

```json
{ "status": "sent" }
```

```json
{ "status": "failed", "reason": "n8n webhook responded with HTTP 500." }
```

## Alcance actual de n8n

Hoy n8n **no** participa en:

- pedidos,
- cocina,
- ventas y caja,
- reservas operativas,
- autenticación,
- navegación por rol.

## Alcance futuro posible

- notificaciones internas,
- clasificación de leads,
- resúmenes automáticos,
- envío de resumen financiero diario,
- eventos posteriores a persistencia real,
- integraciones de backoffice.

## Roadmap

| Fase | Estado | Descripción |
|---|---|---|
| Fase 2B | ✅ Actual | Lead demo con automatización opcional |
| Fase 4 | Parcial ✅ | Supabase activo para auth, menú y reservas; pedidos/cocina pendientes |
| Fase 5 | Pendiente | Reintroducir automatizaciones n8n como capa secundaria |

## Regla arquitectónica

Si una funcionalidad depende críticamente de existir para que el restaurante opere, no debe vivir solo en n8n.
