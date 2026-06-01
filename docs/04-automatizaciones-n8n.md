# 04 — Automatizaciones n8n

## Decisión vigente

- n8n es una integración **externa y opcional**. Bistró OS no depende de él para funcionar.
- Ningún flujo principal de la app se rompe si n8n está apagado.
- En el código de Bistró OS, la única integración directa es `/demo` → `N8N_LEAD_WEBHOOK_URL`.
- Los flujos de Telegram/reservas son blueprints en n8n Cloud; no forman parte del runtime de
  Next.js ni bloquean Vercel.

---

## Caso 1 — Lead comercial (`/demo`)

`submitLead()` en `src/features/leads/actions.ts`:
1. Valida con Zod.
2. Si `N8N_LEAD_WEBHOOK_URL` está configurada, hace POST al webhook.
3. n8n clasifica el lead (bajo / medio / alto) y responde 200.
4. Si n8n falla o no está configurado, la app responde éxito funcional igual.

**Workflow:** `Bistró OS — Lead Capture`  
**Webhook test:** `http://localhost:5678/webhook-test/bistro-lead`

---

## Caso 2 — Reservas por Telegram (Audio + Texto)

### Qué hace

El cliente manda un audio o texto al bot de Telegram. n8n transcribe (si es audio), extrae
los datos de reserva en conversación natural, busca una mesa disponible en Supabase y confirma
por Telegram. Bistró OS ve la reserva en `/reservations` porque lee de Supabase directamente —
**sin cambios en el código de la app**.

### Arquitectura de nodos (25 nodos)

```
[Telegram Message] Trigger — escucha mensajes del bot
  │
  ▼
[Es audio?] IF: !!message.voice || !!message.audio
  │
  ├─ TRUE (rama audio)
  │   → [Extraer File ID]      Code: extrae voice.file_id del mensaje
  │   → [Obtener Ruta Archivo] HTTP GET api.telegram.org/bot{TOKEN}/getFile
  │   → [Descargar Audio]      HTTP GET api.telegram.org/file/bot{TOKEN}/{file_path}
  │   → [Preparar Binario]     Code: normaliza binary a campo 'data'
  │   → [Transcribir Audio]    OpenAI Whisper (español, temperature: 0)
  │   → [Normalizar Transcripcion] Code: extrae texto + contexto Telegram
  │
  └─ FALSE (rama texto)
      → [Normalizar Texto]     Code: extrae message.text + contexto Telegram

[FAN-IN] → [Estado y Parseo]   Code: máquina de estado conversacional
                               - Carga estado por telegram_chat_id ($getWorkflowStaticData)
                               - Parsea restaurante, fecha, hora, personas, nombre, teléfono
                               - Acumula datos entre turnos (expira en 30 min)
                               - Detecta qué dato falta y genera pregunta conversacional
  │
  ▼
[Conversacion Completa?] IF: is_complete === true
  │
  ├─ FALSE → [Responder Pregunta] Telegram send: pregunta el dato faltante (terminal)
  │
  └─ TRUE
      → [Buscar Restaurante]     HTTP GET Supabase (filtra por name ilike + source=seed_demo)
      → [Procesar Restaurante]   Code: extrae restaurant_id, carta_url
      → [Restaurante encontrado?] IF
          │
          ├─ FALSE → [Restaurante no encontrado] Telegram send (terminal)
          │
          └─ TRUE
              → [Buscar Sucursal]       HTTP GET Supabase
              → [Procesar Sucursal]     Code: extrae branch_id
              → [Buscar Mesas]          HTTP GET Supabase (capacity >= party_size, alwaysOutputData)
              → [Verificar Conflictos]  HTTP GET Supabase (misma fecha+hora, alwaysOutputData)
              → [Preparar Reserva]      Code: asigna mesa (confirmed) o sin mesa (pending),
                                              arma mensaje con carta_url
              → [Insertar Reserva]      HTTP POST Supabase /reservations
              → [Registrar Evento]      HTTP POST Supabase /events (source: 'n8n')
              → [Limpiar Estado]        Code: borra estado del chat en staticData
              → [Confirmar por Telegram] Telegram send: confirmación con carta
```

### Flujo conversacional

El bot pide los datos que faltan de a uno, en orden:
1. Restaurante → 2. Personas → 3. Fecha → 4. Hora → 5. Nombre → 6. Teléfono

```
Usuario: "Quiero reservar"
Bot: "Para cual restaurante? (1. Bistro Palermo / 2. Casa Norte / 3. La Mesa Dorada)"
Usuario: "Casa Norte"
Bot: "Para cuantas personas seria la reserva?"
Usuario: "4"
Bot: "Para que dia?"
Usuario: "mañana"
Bot: "A que hora?"
...
Bot: "Perfecto, Omar 👋 Tu reserva quedo confirmada en Casa Norte. 📋 Ver la carta: ..."
```

Comandos especiales: `/start`, `/reset` limpian el estado y muestran bienvenida.  
Formato rápido: `/reservar casa-norte | Nombre | 2026-06-02 | 21:30 | 4 | Telefono`

### Reconocimiento de restaurantes

El slug map acepta variantes normales y errores comunes de Whisper:

| El usuario dice / Whisper transcribe | Restaurante |
|---|---|
| `bistro-palermo`, `bistro palermo`, `bistro`, `palermo` | Bistro Palermo |
| `vistro`, `vistropalermo`, `vistropalearme` (Whisper errors) | Bistro Palermo |
| `casa-norte`, `casa norte`, `casa`, `norte` | Casa Norte |
| `la-mesa-dorada`, `la mesa dorada`, `mesa dorada`, `dorada` | La Mesa Dorada |
| `1`, `2`, `3` | opción de lista |

### Workflow en n8n Cloud

| Campo | Valor |
|---|---|
| Nombre | `Bistró OS — Telegram Audio Reservation` |
| ID | `1Twr5DBBHwtIrjy9` |
| Nodos | 25 |
| URL | `https://omargonzalez.app.n8n.cloud/workflow/1Twr5DBBHwtIrjy9` |
| App desplegada | `https://bistro-os-phi.vercel.app` |

### Credenciales en n8n

| Nombre | Tipo | Contenido |
|---|---|---|
| `Bistró Telegram Bot` | Telegram API | Token del bot (@BotFather) |
| `OpenAI Bistró` | OpenAI API | API key para Whisper |

### Claves Supabase en nodos HTTP

El plan de n8n en uso no soporta Variables. Las claves van directamente en los headers de
cada nodo HTTP Request (`apikey` + `Authorization: Bearer ...`). No se exponen en Bistró OS
ni en Vercel.

Los nodos que usan Supabase directamente son:
`Buscar Restaurante`, `Buscar Sucursal`, `Buscar Mesas`, `Verificar Conflictos`,
`Insertar Reserva`, `Registrar Evento`.

Los nodos `Obtener Ruta Archivo` y `Descargar Audio` usan el token de Telegram hardcodeado
en la URL (`https://api.telegram.org/bot{TOKEN}/...`).

### Datos base en Supabase

Para que las reservas creadas por n8n sean visibles en Bistró OS, el workflow debe escribir
contra los IDs del seed principal del producto:

| Restaurante | restaurant_id | branch_id |
|---|---|---|
| Bistró Palermo | `00000000-0000-0000-0000-000000000001` | `00000000-0000-0000-0000-000000000010` |
| Casa Norte | `00000000-0000-0000-0000-000000000002` | `00000000-0000-0000-0000-000000000020` |
| La Mesa Dorada | `00000000-0000-0000-0000-000000000003` | `00000000-0000-0000-0000-000000000030` |

Estos IDs los crean `scripts/seed-supabase.mjs`, `scripts/seed-menu.mjs` y
`scripts/seed-reservations.mjs` (los scripts principales del producto).

> **Nota:** `supabase/seed_restaurants_demo.sql` creó un set alternativo de IDs
> (`11111111-...`, `22222222-...`, `33333333-...`) con tablas de restaurante para testing
> de n8n. No mezclar con el seed principal. Para producción, actualizar el workflow para
> que use los IDs `000...`.

### Metadata en `reservations`

```json
{
  "source": "telegram_audio",
  "telegram_chat_id": "7741637079",
  "telegram_username": "usuario",
  "raw_message": "[audio]",
  "transcription": "Quiero reservar en Casa Norte para 4 personas...",
  "assigned_table_label": "Mesa 3"
}
```

`source` puede ser `telegram_audio` o `telegram_text`.

### Evento en `events`

```json
{
  "source": "n8n",
  "event_type": "reservation.created_from_telegram",
  "payload": {
    "status": "confirmed",
    "source_type": "telegram_audio",
    "telegram_chat_id": "7741637079"
  }
}
```

### Carta pública incluida en confirmación

El mensaje de confirmación incluye el link a la carta del restaurante:

```
Perfecto, Omar 👋

Tu reserva quedo confirmada en Casa Norte.

📅 Dia: 2026-06-02
🕘 Hora: 21:30
👥 Personas: 4
🍽️ Mesa: Mesa 3

Te esperamos.

📋 Ver la carta: https://bistro-os-phi.vercel.app/carta/casa-norte
```

El URL se obtiene de `metadata.carta_url` del restaurante en Supabase.
Si no existe, se construye como `{APP_URL}/carta/{slug}`.

### Cómo probar

**Paso 1** — Verificar que el workflow esté activo en n8n Cloud.

**Paso 2** — Enviar `/reset` al bot para limpiar estado anterior.

**Paso 3A — Audio:**
> *"Quiero reservar en Casa Norte para 4 personas mañana a las 21:30.
> Soy Omar González. Mi teléfono es 1155555555."*

**Paso 3B — Texto natural:**
```
Quiero reservar en Bistro Palermo para 2 personas el 2026-06-05 a las 20:00. Soy Ana Pérez.
```

**Paso 3C — Comando rápido:**
```
/reservar casa-norte | Omar González | 2026-06-02 | 21:30 | 4 | 1155555555
```

**Paso 4** — Verificar reserva en Supabase:
```sql
SELECT customer_name, reservation_date, reservation_time, party_size,
       status, metadata->>'source', metadata->>'assigned_table_label'
FROM reservations
ORDER BY created_at DESC
LIMIT 5;
```

**Paso 5** — Bistró OS → `/reservations` → la reserva aparece automáticamente.

---

## Regla arquitectónica

> Si una funcionalidad es crítica para que el restaurante opere, no debe vivir solo en n8n.

Las reservas por Telegram son un canal adicional. El equipo siempre puede crear reservas
directamente en Bistró OS.

---

## Bugs corregidos (2026-06-01)

### Bug 1 — `customer_contact` NULL bloqueaba el INSERT (CRÍTICO)

**Síntoma:** el bot confirmaba por Telegram pero la reserva nunca aparecía en Supabase.

**Causa:** la tabla `reservations` tiene `customer_contact text NOT NULL`. El nodo
`Estado y Parseo` guarda el teléfono como `customer_phone`, pero `Preparar Reserva`
pasaba `ctx.customer_contact` (siempre `undefined`) al payload. Supabase rechazaba el
INSERT con violación NOT NULL. El nodo tenía `neverError: true` → error silenciado →
Telegram enviaba la confirmación igual, pero la fila nunca se creaba.

**Fix aplicado en `Preparar Reserva`:**
```js
// antes (roto):
customer_contact: ctx.customer_contact,

// ahora (correcto):
var customerContact = ctx.customer_phone || ctx.customer_contact || ctx.customer_email || '';
// ...
customer_contact: customerContact,
```

### Bug 2 — Mesas no se leían (siempre `status='pending'`)

**Causa:** n8n desempaqueta arrays de Supabase en items individuales. El código hacía
`$('Buscar Mesas').first().json` que devuelve un objeto suelto, no un array.
`Array.isArray()` → false → `tables = []` → nunca se asignaba mesa → siempre `pending`.

**Fix aplicado en `Preparar Reserva`:**
```js
// antes (roto):
const tablesRaw = $('Buscar Mesas').first().json;
const tables = Array.isArray(tablesRaw) ? tablesRaw : [];

// ahora (correcto):
const tablesAll = $('Buscar Mesas').all();
const tables = tablesAll.map(i => i.json).filter(t => t && t.id);
```

Ambos fixes se aplicaron directamente al workflow activo `1Twr5DBBHwtIrjy9` vía n8n MCP.

---

## Capacidad de mesas en Supabase

La tabla `restaurant_tables` ya tenía `capacity` por mesa. Se agregó en
`supabase/migration_capacity.sql`:

### Vista `v_branch_capacity`
Muestra la capacidad total y disponible de cada sucursal, con desglose por área.

```sql
SELECT restaurant_name, branch_name, total_tables, total_seats,
       available_tables, available_seats
FROM v_branch_capacity
ORDER BY restaurant_name;
```

### Función `available_tables_for_reservation()`
Devuelve mesas libres para una fecha + hora + cantidad de personas, excluyendo
las ya reservadas en ese mismo slot.

```sql
-- Uso directo en SQL:
SELECT * FROM available_tables_for_reservation(
  '22222222-0000-0000-0000-000000000010', -- branch_id Casa Norte
  '2026-06-05',
  '21:00:00',
  4
);
```

```
-- Uso desde n8n (HTTP POST a Supabase RPC):
POST /rest/v1/rpc/available_tables_for_reservation
Body: { "p_branch_id": "...", "p_date": "2026-06-05",
        "p_time": "21:00:00", "p_party_size": 4 }
```

El nodo `Buscar Mesas` del workflow actual usa la query REST directa sobre
`restaurant_tables`. Migrar a esta función RPC es el paso recomendado para
consolidar la lógica de disponibilidad en un solo lugar.

---

## Riesgos

| Riesgo | Severidad | Mitigación |
|---|---|---|
| Whisper distorsiona nombre del restaurante ("vistropalearme") | Media | Slug map con variantes fonéticas + fallback a `/reservar` por texto |
| `download: true` no descarga voz en n8n Cloud | Alta | Solución actual: Extraer File ID → getFile API → HTTP download explícito |
| Bot Telegram público: cualquiera puede mandar mensajes | Media | Demo OK; producción: agregar `chatIds` allowlist en el Trigger |
| Token Telegram hardcodeado en URLs de nodos HTTP | Media | Aceptable en n8n Cloud (entorno privado); mover a credential cuando n8n mejore soporte |
| IDs de restaurante del seed demo ≠ IDs del seed principal | Alta | Pendiente: migrar workflow a IDs `000...001/002/003` del seed principal |
| n8n static data tiene race condition en ejecuciones simultáneas | Baja | Aceptable para demo; en producción usar Supabase como store de estado |
| OpenAI Whisper tiene costo por audio | Baja | ~$0.006/min; irrelevante para demo |

---

## Roadmap

- [x] Corregir bug `customer_contact` NULL → INSERT bloqueado silenciosamente
- [x] Corregir lectura de mesas con `.all()` en vez de `.first()`
- [x] Agregar vista `v_branch_capacity` y función `available_tables_for_reservation()`
- [ ] Migrar nodo `Buscar Mesas` a usar RPC `available_tables_for_reservation()`
- [ ] Migrar IDs de restaurante en el workflow a los del seed principal del producto
- [ ] Mover token Telegram de URL hardcodeada a mecanismo de credential en n8n
- [ ] Allowlist de `chatIds` en el Trigger para limitar el bot a usuarios conocidos
- [ ] Webhook inverso: cancelación en Bistró OS → notificación Telegram al cliente
- [ ] Soporte `video_note` (notas de video circulares de Telegram)
- [ ] Rate limiting para prevenir spam
- [ ] Disponibilidad por rango de tiempo (hoy verifica solo date+time exacto)
- [ ] Memoria de cliente: recordar nombre/teléfono para reservas repetidas

---

## Workflows en n8n Cloud

| Nombre | ID | Estado | Descripción |
|---|---|---|---|
| Bistró OS — Lead Capture | *(local)* | Inactivo | Lead comercial del form /demo |
| Bistró OS — Reservation Notifier | `4ivEAcJ4kSNrv1bF` | Borrador | Webhook → Telegram (prototipo inicial) |
| Bistró OS — Telegram Reservation Intake | `V7iYbrPIkbWYmqCa` | Borrador | Solo texto (reemplazado) |
| **Bistró OS — Telegram Audio Reservation** | **`1Twr5DBBHwtIrjy9`** | **Activo** | Audio + texto, conversacional, 25 nodos |
