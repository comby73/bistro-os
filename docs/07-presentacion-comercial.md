# 07 — Presentación comercial

## Pitch corto

Bistró OS evolucionó de una idea comercial a una demo funcional de sistema operativo para restaurantes.  
Hoy permite mostrar cómo distintos roles trabajan dentro de una misma aplicación multi-restaurante:
dueño, administrador, jefe de sala, mozo y cocina.

## Qué se puede demostrar hoy

- login real con Supabase Auth,
- portada pública simplificada con video de fondo (`public/Bistro.mp4`),
- selección de restaurante/sucursal según rol,
- navegación interna contextual,
- dashboard por perfil,
- flujo operativo Mozo → Pedido → Cocina,
- reservas persistidas por restaurante/sucursal,
- carta pública y menú interno con la misma fuente de datos,
- gestión real de carta desde `/menu` (crear, editar, archivar, imágenes),
- ventas y caja simulada,
- análisis financiero demo con gráficos, tabla exportable, formas de pago, costos, faltantes, mesas, gastos y sueldos,
- automatización comercial opcional.

## Aclaración importante sobre `/sales`

El módulo **Ventas y caja**:

- muestra ventas del día,
- medios de pago,
- pendientes de cobro,
- propinas estimadas,
- cierre de caja simulado.

No implementa facturación fiscal real ni integración homologada.

El módulo **Análisis financiero** amplía la demo para el dueño: análisis visual de ventas, pagos,
márgenes, inventario, mesas, gastos y empleados. Es operativo/demostrativo, no contabilidad
fiscal ni liquidación real de sueldos.

## Propuesta de valor actual

La landing pública queda como entrada simple y visual; el peso de la demo está en el sistema interno.
Más que una landing, Bistró OS hoy demuestra arquitectura y flujo operativo defendible:

- una sola app interna,
- módulos separados,
- permisos por rol,
- persistencia real en Supabase donde ya aporta valor,
- automatizaciones desacopladas.

## Roadmap narrable en demo

1. Fases 3A/3B: flujo operativo y reservas.
2. Fases 4A/4C: Supabase real para auth, tenant, menú y reservas.
3. Gestión de carta: CRUD + Storage de imágenes.
4. Fase 4D: persistir pedidos y cocina.
5. Fase 5: automatización n8n opcional.

## Evolución profesional del producto

Bistró OS puede explicarse como una evolución progresiva desde una demo operativa hacia un sistema de gestión gastronómica más profesional:

- **Etapa actual**: MVP funcional multi-restaurante con auth real, menú/reservas en Supabase, pedidos/cocina demo, ventas/caja simulada y análisis financiero demo.
- **Etapa transaccional**: persistencia real en Supabase para pedidos, kitchen tickets y caja.
- **Etapa de integración**: APIs internas y webhooks opcionales para automatizaciones o terceros.
- **Etapa BOH avanzada**: stock, recetas, costeo y alertas operativas.

Este camino permite defender que el producto ya tiene una base arquitectónica consistente, aunque todavía no implemente:

- facturación fiscal real,
- pagos externos reales,
- delivery,
- inventario y costeo productivo.
