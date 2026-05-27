# 09 — Supabase migration plan

## Objetivo

Conectar Supabase de forma gradual sin romper la demo actual basada en `localStorage`.

La meta no es “migrar todo” de una vez.  
La meta es sustituir stores locales por persistencia real módulo por módulo.

## Criterios de la migración

- no tocar UI antes de tiempo,
- no mezclar varios dominios críticos en la misma fase,
- mantener el sistema demostrable aun si una fase queda a mitad de camino,
- preservar compatibilidad con el modelo operativo ya validado.

## Fase 4A — Preparación de backend

Incluye:

- esquema SQL alineado con el producto actual,
- seed coherente con la demo,
- RLS inicial sin complejidad excesiva,
- documentación de migración.

No incluye:

- conexión de componentes a Supabase,
- reemplazo de `localStorage`,
- auth real,
- sincronización tiempo real.

## Fase 4B — Conectar solo `menu`

### Alcance

- leer categorías desde Supabase,
- leer productos desde Supabase,
- persistir `available` y `featured`,
- mantener `/orders` consumiendo la misma fuente.

### Estado actual de implementación

Fase 4B quedó preparada con un adaptador reversible:

- `repository.ts` decide entre `local` y `supabase`,
- si faltan variables, el sistema sigue en modo local,
- si la configuración está completa, `/menu` puede leer desde Supabase y persistir cambios de forma server-side,
- `/orders` reutiliza ese catálogo resuelto sin migrar todavía su propio dominio.

### Motivo

`menu` es el módulo menos riesgoso para abrir la migración:

- tiene pocas mutaciones,
- no implica coordinación temporal compleja,
- impacta de forma positiva a `/orders`.

### Estrategia técnica

- crear adaptador `menu repository`,
- mantener fallback temporal a mock/localStorage si fuera necesario,
- no tocar el diseño de `/menu`.
- copiar el catálogo remoto a la store local para no romper la demo ni la consulta en otras pantallas.

## Fase 4C — Conectar `reservations`

### Alcance

- persistir reservas,
- persistir cambios de estado,
- persistir asignación de mesa,
- mantener filtros y UX actual.

### Estado actual de implementación

Fase 4C quedó preparada con un adaptador equivalente al de `menu`:

- `repository.ts` decide entre `local` y `supabase`,
- si faltan variables, `/reservations` sigue operando con `localStorage`,
- si la configuración está completa, la lectura del listado viene desde Supabase,
- las escrituras remotas se hacen vía server actions,
- la store local sigue existiendo como capa de resiliencia y demostración.

### Riesgos

- normalización de fecha/hora,
- relación futura con mesas y turnos,
- necesidad de ordenar bien por sucursal.

## Fase 4D — Conectar `orders` y `kitchen`

### Alcance

- persistir pedidos reales,
- persistir items de pedido,
- persistir transición de estados,
- registrar `kitchen_events`.

### Riesgo principal

Es el corazón operativo del sistema.  
Si esta fase se implementa mal, la demo puede perder coherencia entre salón y cocina.

### Recomendación

- migrar primero escritura de pedidos,
- luego lectura compartida en cocina,
- luego eventos o timeline de cocina.

## Fase 4E — Conectar `dashboard`

### Alcance

- reemplazar métricas derivadas de stores demo por consultas reales,
- mantener cálculos reutilizables,
- no duplicar reglas de negocio entre frontend y SQL.

### Dependencias

Depende de tener ya conectados:

- `menu`,
- `reservations`,
- `orders`,
- `kitchen`,
- y al menos parte de `sales`.

## Fase 4F — Auth real y RLS serio

### Alcance

- vincular `profiles.auth_user_id` con Supabase Auth,
- activar acceso por tenant,
- aislar por restaurante y sucursal,
- definir permisos por rol:
  - owner
  - admin
  - manager
  - waiter
  - kitchen

### Por qué va al final

Primero conviene estabilizar el modelo y las escrituras.  
Recién después tiene sentido cerrar el perímetro de seguridad real.

## Fuera de este plan inmediato

- n8n como capa crítica,
- facturación fiscal real,
- pagos reales,
- stock/costeo,
- delivery,
- multi-sucursal avanzada con reglas complejas.
