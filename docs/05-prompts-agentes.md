# 05 — Prompts y agentes

## Objetivo

Centralizar la lógica asistiva futura del producto sin volver crítica a la IA para operar.

## Principio

Los agentes no reemplazan validaciones, permisos ni estados del sistema.  
Primero manda el código; después la IA puede enriquecer, resumir o clasificar.

## Agentes previstos

- WhatsApp Reservas
- Resumen Operativo
- Análisis de Feedback
- Agente Comercial
- QA Validator
- Agente Cocina

## Estado actual

Los prompts están documentados, pero la app operativa actual todavía no depende de ellos para:

- crear pedidos,
- mover estados de cocina,
- navegar por rol,
- consultar ventas/caja,
- operar reservas.

La bitácora de prompts de **desarrollo del sistema** está separada en
[`11-historial-prompts.md`](./11-historial-prompts.md). Este archivo mantiene solo los
prompts/agentes que podrían usarse como capa asistiva del producto.

## Uso futuro más probable

- clasificación de leads,
- resúmenes de turno,
- ayuda operativa para dueño/manager,
- análisis de feedback,
- asistentes sobre eventos persistidos en Supabase.
