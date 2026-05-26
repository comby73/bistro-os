# 04 — Automatizaciones n8n

## Workflow principal: captura de lead

### Caso

Un restaurante solicita una demo desde la landing page de Bistró OS.

### Flujo de nodos

```
[Webhook — Recibir Lead]
        │  POST /bistro-lead
        ▼
[Normalize Lead Data]
        │  limpia y tipifica campos
        ▼
[Validate Required Fields]
        │  valida presencia y formato
        ▼
[Classify Lead]
        │  heurística: lead_score, next_action
        ▼
[Respond to Webhook]
           HTTP 200 + JSON de clasificación
```

### Variables necesarias

```env
N8N_LEAD_WEBHOOK_URL=http://localhost:5678/webhook-test/bistro-lead
```

---

## Arquitectura desde Next.js 16 — Server Action

### Flujo técnico

```
DemoLeadForm.tsx (Client Component)
  └─ llama await submitLead(form)
       │
       │  Next.js RPC boundary ("use server")
       ▼
actions.ts (Server Action — corre en Node.js)
  ├─ Valida con Zod
  ├─ Lee process.env.N8N_LEAD_WEBHOOK_URL  ← solo disponible server-side
  ├─ Si URL existe → POST al webhook de n8n
  └─ Si URL no existe → mock con mensaje de desarrollo
```

### Por qué `"use server"` resuelve el problema

`actions.ts` tiene `"use server"` como primera línea. Esto le indica al bundler de Next.js que todas las funciones exportadas son Server Actions. Cuando `DemoLeadForm` llama `submitLead(form)`, Next.js lo convierte en una llamada RPC transparente: el payload viaja al servidor, la función corre en Node.js, y el resultado serializado vuelve al cliente.

Sin `"use server"`, `submitLead` corría en el browser y `process.env.N8N_LEAD_WEBHOOK_URL` era siempre `undefined` (las variables sin prefijo `NEXT_PUBLIC_` no se exponen al cliente).

---

## Guía para crear el workflow en n8n

### 1. Instalar y arrancar n8n

```bash
# Opción A — npx (sin instalación global)
npx n8n

# Opción B — Docker
docker run -it --rm -p 5678:5678 n8nio/n8n
```

Accedé a `http://localhost:5678` y creá una cuenta local (solo para uso local, sin suscripción).

### 2. Importar el workflow

1. En la barra lateral izquierda: **Workflows → Add workflow**.
2. Arriba a la derecha: ícono de tres puntos `···` → **Import from file**.
3. Seleccioná `workflows/n8n/lead-capture-flow.json`.
4. El workflow aparece con 5 nodos conectados en línea.

### 3. Obtener la URL del webhook

Hacé clic en el nodo **"Webhook — Recibir Lead"**. En el panel derecho verás dos URLs:

| Tipo | URL | Cuándo usar |
|---|---|---|
| **Test URL** | `http://localhost:5678/webhook-test/bistro-lead` | Durante desarrollo — el workflow debe estar abierto en pantalla |
| **Production URL** | `http://localhost:5678/webhook/bistro-lead` | Con el workflow activado (toggle verde arriba a la derecha) |

### 4. Configurar `.env.local`

```env
# Desarrollo — usar Test URL mientras se itera el workflow
N8N_LEAD_WEBHOOK_URL=http://localhost:5678/webhook-test/bistro-lead

# Demo académica — sin bloqueo de auth
DEMO_AUTH_BYPASS=true
```

Cuando el workflow esté listo para producción, reemplazar por la Production URL (o la URL del servidor n8n en la nube).

---

## Cómo probar desde localhost

### Setup

```bash
# Terminal 1 — n8n
npx n8n

# Terminal 2 — Next.js
npm run dev
```

### Flujo de prueba

1. En n8n: abrí el workflow importado.
2. En n8n: hacé clic en **"Test workflow"** (botón naranja, esquina inferior derecha). El nodo Webhook queda en escucha.
3. En el browser: andá a `http://localhost:3000/demo`.
4. Completá y enviá el formulario.
5. En n8n: el panel inferior muestra la ejecución paso a paso con los datos de cada nodo.

> **Importante:** con la Test URL, el workflow SOLO escucha mientras "Test workflow" está activo en pantalla. Si cerrás la pantalla, usá la Production URL con el workflow activado.

### Verificar la respuesta

El Server Action de Next.js recibe la respuesta de n8n. Si HTTP 200, el formulario muestra "¡Gracias! Nos ponemos en contacto a la brevedad." Si el webhook no responde o devuelve error, el formulario muestra el mensaje de error correspondiente.

---

## Formato del JSON que Next.js envía a n8n

Payload del `POST` generado por `submitLead()` en `src/features/leads/actions.ts`:

```json
{
  "restaurant_name": "Casa Bistró",
  "owner_name": "Ana Pérez",
  "email": "ana@casabistro.com",
  "whatsapp": "+5491112345678",
  "city": "Buenos Aires",
  "restaurant_type": "Bistró",
  "number_of_tables": 24,
  "plan_interest": "Pro",
  "message": "Quiero ordenar las reservas y ver la cocina en tiempo real."
}
```

Campos obligatorios: `restaurant_name`, `owner_name`, `email`, `whatsapp`, `plan_interest`.  
Campo opcional: `message`.

## Formato del JSON que n8n devuelve a Next.js

Respuesta del nodo **"Respond to Webhook"**:

```json
{
  "received": true,
  "lead_score": "medium",
  "recommended_plan": "Pro",
  "next_action": "schedule_demo"
}
```

| Campo | Valores posibles | Criterio |
|---|---|---|
| `lead_score` | `"low"`, `"medium"`, `"high"` | Enterprise o > 40 mesas → high; Pro o > 15 → medium; resto → low |
| `next_action` | `"send_info"`, `"schedule_demo"`, `"schedule_call"` | Coincide con lead_score |

> Next.js solo verifica `response.ok` (HTTP 2xx). El body de respuesta no es procesado todavía, pero está disponible para Fase 3 (guardar clasificación en Supabase).

---

## Comportamiento por entorno

| Entorno | `N8N_LEAD_WEBHOOK_URL` | Comportamiento |
|---|---|---|
| Desarrollo sin n8n | no definida | Mock: respuesta simulada en 300 ms |
| Desarrollo con n8n local (test) | `webhook-test/bistro-lead` | POST real, workflow visible en pantalla |
| Desarrollo con n8n local (activo) | `webhook/bistro-lead` | POST real, workflow activado |
| Producción | URL de instancia n8n en la nube | POST real en producción |

---

## Roadmap de este workflow

| Fase | Estado | Descripción |
|---|---|---|
| Fase 2B | ✅ Actual | Webhook → Normalizar → Validar → Clasificar heurística → Responder |
| Fase 3 | Pendiente | Agregar nodo Supabase Insert Lead después de Classify Lead |
| Fase 3 | Pendiente | Reemplazar Classify Lead heurístico por llamada a OpenAI (`prompts/agents/agente-comercial.md`) |
| Fase 3 | Pendiente | Agregar Email Notify Sales después de clasificación |
| Fase 3 | Pendiente | Agregar Supabase Insert Event al final del flujo |
