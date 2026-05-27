# 08 — Roadmap

## Estado actual del MVP

- App operativa con roles demo.
- `AppShell` interno y navegación contextual.
- `/orders` con modo servicio para mozo.
- `/kitchen` con tablero KDS simple.
- `/reservations` como módulo operativo con persistencia demo local.
- `/menu` con datos mock.
- `/sales` como ventas y caja operativa simulada.
- `localStorage` como persistencia temporal de demo.
- n8n opcional y no bloqueante.
- Supabase todavía no conectado a la operación real.

## Fase 3A — Flujo operativo

- Consolidar Mozo → Pedido → Cocina.
- Ajustar UX de servicio y KDS.
- Mejorar visibilidad de tiempos y estados.
- Mantener todo demostrable sin backend externo.

## Fase 3B — Reservas operativas

- Convertir reservas en flujo operativo local.
- Relacionar reservas con mesas, turnos y estados.
- Mejorar la lectura operativa para manager y owner.
- Mantener localStorage hasta Fase 4.

## Fase 4 — Supabase real

- Reemplazar `localStorage` por persistencia real.
- Persistir perfiles, pedidos, items, reservas y kitchen flow.
- Preparar modelo relacional para caja operativa.
- Mantener `/sales` como caja y ventas, no como facturación fiscal homologada.

## Fase 5 — Automatización n8n opcional

- Reintroducir n8n como capa externa secundaria.
- Consumir eventos ya persistidos.
- Agregar webhooks opcionales para notificaciones y resúmenes.
- No convertir n8n en dependencia crítica.

## Fase 6 — Evolución profesional y defensa

- Afinar documentación final.
- Consolidar narrativa FOH / BOH.
- Presentar modelo relacional futuro.
- Explicar APIs y webhooks futuros.
- Defender stock/costeo como roadmap, no como parte cerrada del MVP actual.

## Roadmap posterior sugerido

- Stock e ingredientes.
- Recetas y costeo.
- Caja multi-turno.
- APIs internas públicas.
- Webhooks de eventos operativos.
- Multi-sucursal.

## Límites explícitos del estado actual

- Sin Supabase real en producción demo.
- Sin n8n conectado al núcleo operativo.
- Sin facturación fiscal real.
- Sin pagos reales.
- Sin delivery.
