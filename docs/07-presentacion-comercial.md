# 07 — Presentación comercial

## Pitch corto

Bistró OS evolucionó de una idea comercial a una demo funcional de sistema operativo para restaurantes.  
Hoy permite mostrar cómo distintos roles trabajan dentro de una misma aplicación: dueño, administrador, jefe de sala, mozo y cocina.

## Qué se puede demostrar hoy

- acceso por rol demo,
- navegación interna contextual,
- dashboard por perfil,
- flujo operativo Mozo → Pedido → Cocina,
- reservas mock,
- menú operativo,
- ventas y caja simulada,
- automatización comercial opcional.

## Aclaración importante sobre `/sales`

El módulo **Ventas y caja**:

- muestra ventas del día,
- medios de pago,
- pendientes de cobro,
- propinas estimadas,
- cierre de caja simulado.

No implementa facturación fiscal real ni integración homologada.

## Propuesta de valor actual

Más que una landing, Bistró OS hoy demuestra arquitectura y flujo operativo defendible:

- una sola app interna,
- módulos separados,
- permisos por rol,
- preparación para persistencia real,
- automatizaciones desacopladas.

## Roadmap narrable en demo

1. Fase 3A: flujo Mozo → Pedido → Cocina.
2. Fase 3B: reservas operativas.
3. Fase 4: Supabase real.
4. Fase 5: automatización n8n opcional.
5. Fase 6: defensa y presentación final.

## Evolución profesional del producto

Bistró OS puede explicarse como una evolución progresiva desde una demo operativa hacia un sistema de gestión gastronómica más profesional:

- **Etapa actual**: MVP funcional con roles, pedidos, cocina, reservas, menú y ventas/caja simulada.
- **Etapa transaccional**: persistencia real en Supabase para pedidos, reservas, kitchen tickets y caja.
- **Etapa de integración**: APIs internas y webhooks opcionales para automatizaciones o terceros.
- **Etapa BOH avanzada**: stock, recetas, costeo y alertas operativas.

Este camino permite defender que el producto ya tiene una base arquitectónica consistente, aunque todavía no implemente:

- facturación fiscal real,
- pagos externos reales,
- delivery,
- inventario y costeo productivo.
