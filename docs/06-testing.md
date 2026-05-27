# 06 — Testing

## Estrategia actual

La demo valida calidad con:

- tests de validación,
- tests de componentes básicos,
- tests de configuración de roles,
- tests de cálculos operativos,
- margen para iterar UX sin romper la lógica base ya cubierta.

## Cobertura relevante hoy

- esquema de leads,
- esquema de reservas,
- esquema de pedidos,
- formulario demo,
- badges de reservas,
- cálculos de reservas desacoplados de la UI,
- cálculos de dashboard derivados de stores demo,
- cálculos de menú para disponibilidad, filtros y agrupación,
- permisos por rol,
- cálculos de ventas,
- cálculos de pedidos.

## Comandos de calidad

```bash
npm run lint
npm test
npm run build
```

## Qué garantizan hoy

- que los contratos básicos de datos no se rompan,
- que los roles mantengan sus permisos esperados,
- que `/menu` conserve su lectura operativa por rol y sus cálculos base,
- que `/sales` conserve sus cálculos mock,
- que el flujo operativo siga compilando y pasando tipado.

## Qué falta en fases futuras

- tests del store demo de pedidos/cocina,
- tests de integración de rutas por rol,
- tests E2E de flujo operativo,
- tests sobre persistencia real con Supabase.
