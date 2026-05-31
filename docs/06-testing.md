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
- repositorio de reservas con fallback local validado,
- cálculos de dashboard derivados de stores demo,
- cálculos de menú para disponibilidad, filtros y agrupación,
- **gestión de carta (CRUD) en fallback local** (`tests/menu-store-crud.test.ts`):
  - crear producto nuevo en el catálogo,
  - editar nombre/precio/categoría,
  - baja lógica (`status='archived'` + `available=false`, sin borrado físico),
  - producto archivado oculto en carta pública (`visibleItems`),
  - `available=false` sigue visible como "No disponible",
  - `/orders` usa el catálogo actualizado (producto recién creado es ordenable),
- permisos por rol,
- cálculos de ventas,
- cálculos de pedidos:
  - creación en estado `received`,
  - estaciones tomadas del catálogo recibido,
  - transición `received → preparing → ready → delivered`,
  - agrupación por `received`, `preparing`, `ready` y `delivered`,
  - totales por cantidad y precio unitario.
- **cálculos financieros demo** (`tests/finance-calculations.test.ts`):
  - resumen de ventas/gastos/sueldos,
  - ventas por día,
  - medios de pago,
  - margen por producto,
  - faltantes de inventario,
  - gastos por categoría.

## Comandos de calidad

```bash
npm run lint
npm test
npm run build
```

Última validación reportada para este bloque: `npm run lint` sin errores,
`npm test` con 62 tests verdes y `npm run build` OK.

## Qué garantizan hoy

- que los contratos básicos de datos no se rompan,
- que los roles mantengan sus permisos esperados,
- que `/menu` conserve su lectura operativa por rol y sus cálculos base,
- que `/reservations` mantenga fallback local aunque Supabase no esté configurado,
- que `/sales` conserve sus cálculos mock,
- que pedidos/cocina mantengan contratos de cálculo independientes de la UI,
- que el flujo operativo siga compilando y pasando tipado.

## Qué falta en fases futuras

- tests de las server actions de menú con Supabase (hoy verificadas manualmente:
  create → update → archive → upload contra la DB viva),
- tests automatizados del store demo de pedidos/cocina con `localStorage` por restaurante,
- tests de integración de rutas por rol,
- tests E2E de flujo operativo,
- tests sobre persistencia real con Supabase.
