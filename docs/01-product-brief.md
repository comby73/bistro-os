# 01 — Product Brief

## Nombre

Bistró OS

## Definición actual

SaaS operativo multi-restaurante para restaurantes que centraliza roles internos, pedidos, cocina, reservas, carta, ventas/caja simulada y automatizaciones futuras.

## Cambio de foco

El proyecto ya no se posiciona principalmente como landing comercial.  
La prioridad actual es demostrar un sistema interno defendible, modular, navegable por roles reales y conectado a Supabase en los dominios ya migrados.

## Problema

Muchos restaurantes de gama media-alta operan con información dispersa:

- reservas en WhatsApp,
- pedidos verbales o en papel,
- cocina desacoplada del salón,
- cierres operativos manuales,
- poca visibilidad por rol.

## Solución

Una app interna con funcionamiento por rol que conecta:

- acceso real por perfil,
- dashboard contextual,
- pedidos,
- cocina,
- reservas,
- carta administrable,
- ventas y caja simulada.

## Roles objetivo

- Dueño
- Administrador
- Jefe de sala
- Mozo
- Cocina

## Valor principal

Demostrar que Bistró OS puede funcionar como sistema operativo de restaurante con autenticación y datos reales donde importa, manteniendo demo local para los módulos aún no migrados.

## Alcance actual

- Supabase Auth real y control de acceso por rol.
- AppShell interno.
- Flujo operativo inicial Mozo → Pedido → Cocina.
- Menú/carta con CRUD real, baja lógica y Storage de imágenes.
- Reservas persistidas por restaurante/sucursal.
- Ventas y caja simulada sin facturación fiscal real.
- n8n preparado como capa opcional posterior.
