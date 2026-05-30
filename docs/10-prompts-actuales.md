# 10 - Prompts actuales del proyecto

## Objetivo

Este documento reúne los prompts y templates definidos en Bistró OS hasta esta etapa, para que se puedan revisar, reutilizar y extender sin tener que recorrer toda la carpeta `/prompts`.

> **Bitácora de desarrollo:** el historial cronológico de los prompts que fueron
> construyendo el sistema (multi-restaurante, Supabase, carta administrable) está en
> [`11-historial-prompts.md`](./11-historial-prompts.md).

## Estado actual

- Los prompts ya están documentados.
- La app demo actual no depende de la IA para operar los flujos core.
- Su uso previsto es asistivo: clasificar, resumir, detectar alertas o ayudar en automatizaciones futuras.
- La lógica crítica sigue estando en código, validaciones y permisos.

## Prompt base de sistema

### 1. Contexto general Bistró OS

Archivo: `prompts/system/bistro-os-context.md`

Función:

- Define qué es Bistró OS.
- Fija el tipo de restaurante objetivo.
- Marca el tono del producto.
- Establece principios de uso de IA dentro del sistema.

Puntos clave:

- SaaS para restaurantes de gama media-alta en LATAM.
- Unifica reservas, pedidos, cocina, ventas y automatizaciones.
- La IA asiste, no reemplaza decisiones críticas.
- La experiencia debe ser premium, clara y sobria.

## Agentes documentados

### 2. Agente comercial

Archivo: `prompts/agents/agente-comercial.md`

Objetivo:

- Clasificar leads que llegan desde la landing.
- Recomendar el plan y la próxima acción comercial.

Evalúa:

- cantidad de mesas,
- ciudad,
- tipo de restaurante,
- plan de interés,
- urgencia,
- potencial de facturación,
- posible operación multi-sucursal.

Salida esperada:

```json
{
  "lead_score": "low | medium | high",
  "recommended_plan": "Starter | Pro | Enterprise",
  "reason": "",
  "next_action": ""
}
```

Uso previsto:

- formulario demo,
- clasificación futura en n8n,
- priorización comercial.

### 3. Agente de reservas por WhatsApp

Archivo: `prompts/agents/whatsapp-reservas.md`

Objetivo:

- Responder consultas por WhatsApp.
- Tomar reservas.
- Escalar a humano cuando haya ambigüedad o riesgo.

Reglas importantes:

- confirmar fecha, hora, cantidad de personas y nombre,
- no prometer disponibilidad sin consulta real,
- mantener tono elegante, claro y cálido,
- registrar pedidos especiales,
- ofrecer alternativas si hay conflicto,
- no inventar horarios, precios ni disponibilidad.

Salida esperada:

```json
{
  "intent": "reservation_request | menu_question | cancellation | human_support",
  "customer_name": "",
  "date": "",
  "time": "",
  "party_size": 0,
  "notes": "",
  "requires_human": false
}
```

Uso previsto:

- automatización de reservas,
- intake desde WhatsApp,
- derivación controlada a staff humano.

Referencia actual:

- `workflows/n8n/reservation-flow.json` apunta a este prompt.

### 4. Agente de resumen operativo

Archivo: `prompts/agents/resumen-operativo.md`

Objetivo:

- Generar un resumen diario para dueño o manager.

Debe incluir:

- ventas del día,
- ticket promedio,
- platos más pedidos,
- reservas confirmadas y canceladas,
- alertas operativas,
- recomendaciones accionables.

Formato esperado:

1. Resumen ejecutivo.
2. Alertas relevantes.
3. Tres acciones recomendadas.

Uso previsto:

- dashboard ejecutivo,
- cierre de turno,
- reportes diarios o envío por automatización.

### 5. Agente de cocina

Archivo: `prompts/agents/agente-cocina.md`

Objetivo:

- Detectar pedidos demorados.
- Priorizar comandas.
- Sugerir acciones operativas al equipo.

Límites:

- no modifica pedidos,
- no cancela tickets,
- solo sugiere prioridades,
- alerta por umbral de tiempo,
- separa observaciones por estación.

Salida esperada:

```json
{
  "alerts": [],
  "priority_tickets": [],
  "summary": "",
  "recommended_actions": []
}
```

Uso previsto:

- tablero de cocina,
- tickets demorados,
- soporte operativo para Fase 3A.

### 6. Agente de análisis de feedback

Archivo: `prompts/agents/analisis-feedback.md`

Objetivo:

- Clasificar comentarios de clientes.
- Detectar problemas repetidos.

Dimensiones:

- sentimiento: `positivo | neutral | crítico`
- categoría: `comida | atención | tiempos | precio | ambiente | reservas | delivery`
- urgencia: `low | medium | high`

Salida esperada:

```json
{
  "sentiment": "positivo | neutral | crítico",
  "category": "comida | atención | tiempos | precio | ambiente | reservas | delivery",
  "urgency": "low | medium | high",
  "summary": "",
  "recommended_action": ""
}
```

Uso previsto:

- consolidado de reseñas,
- alertas para manager,
- mejora continua de operación.

### 7. Agente QA validator

Archivo: `prompts/agents/qa-validator.md`

Objetivo:

- Validar que un flujo cumpla reglas básicas antes de considerarlo aceptable.

Casos a validar:

- email válido,
- reserva con fecha y hora válidas,
- pedido con al menos un item,
- estados permitidos según flujo,
- ausencia de registros incompletos,
- no exposición de credenciales.

Salida esperada:

```json
{
  "is_valid": true,
  "issues": [],
  "risk_level": "low | medium | high",
  "recommendation": ""
}
```

Uso previsto:

- validaciones asistidas,
- chequeos de calidad documental,
- soporte a pruebas o revisión de flujos.

## Templates reutilizables

### 8. Template de clasificación de lead

Archivo: `prompts/templates/lead-classification.md`

Objetivo:

- Estandarizar el input para clasificar leads comerciales.

Incluye:

- restaurante,
- ciudad,
- tipo,
- mesas,
- plan de interés,
- mensaje.

Resultado esperado:

- JSON con score,
- plan recomendado,
- siguiente acción.

### 9. Template de reporte diario

Archivo: `prompts/templates/daily-report.md`

Objetivo:

- Estructurar un resumen operativo diario.

Inputs:

- ventas,
- ticket promedio,
- pedidos,
- reservas,
- feedback,
- incidencias.

Output esperado:

- resumen ejecutivo,
- puntos de atención,
- recomendaciones para el día siguiente.

### 10. Template de copy para landing

Archivo: `prompts/templates/landing-copy.md`

Objetivo:

- Generar copy comercial para la landing de Bistró OS.

Restricciones:

- no usar claims falsos,
- no inventar clientes reales,
- no prometer automatización perfecta,
- explicar límites de la IA.

Uso previsto:

- iteraciones de marketing,
- contenido comercial,
- ajustes de mensaje sin tocar la base del producto.

## Relación con workflows y fases

Hoy estos prompts están documentados y preparados, pero no son dependencia crítica del producto.

Encaje por fase:

- Fase actual: documentación y preparación.
- Fase 3A: posible soporte a cocina y flujo mozo -> pedido -> cocina.
- Fase 3B: soporte a reservas operativas.
- Fase 4: enriquecimiento sobre eventos y datos persistidos en Supabase (menú/reservas ya migrados; pedidos/cocina pendientes).
- Fase 5: integración opcional con n8n.

Referencias directas ya visibles en el repo:

- `workflows/n8n/reservation-flow.json` usa `prompts/agents/whatsapp-reservas.md`
- `workflows/n8n/lead-capture-flow.json` menciona `prompts/agents/agente-comercial.md` para una fase futura con IA

## Resumen corto

Hasta acá, Bistró OS tiene un set de prompts pensado para cinco grandes frentes:

- ventas/comercial,
- reservas,
- cocina,
- reporting operativo,
- análisis/validación.

La línea del proyecto sigue siendo correcta:

- primero producto funcional,
- después persistencia real,
- y recién encima automatizaciones e IA como capa secundaria.
