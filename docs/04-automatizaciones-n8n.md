# 04 — Automatizaciones n8n

## Decisión vigente

- n8n es una integración externa opcional.
- Bistró OS no depende de n8n para funcionar.
- Ningún flujo principal de la app debe romperse si n8n está apagado.
- Las automatizaciones activas usan **n8n Cloud** (`omargonzalez.app.n8n.cloud`).

---

## Caso 1 — Lead comercial (`/demo`)

`submitLead()` en `src/features/leads/actions.ts`:
1. Valida con Zod.
2. Si `N8N_LEAD_WEBHOOK_URL` está configurada, hace POST al webhook.
3. n8n clasifica el lead (bajo / medio / alto) y responde 200.
4. Si n8n falla o no está configurado, la app sigue respondiendo éxito funcional.

**Workflow:** `Bistró OS — Lead Capture`
**Ruta webhook (test):** `http://localhost:5678/webhook-test/bistro-lead`

---

## Caso 2 — Reservas por Telegram (Audio + Texto)

### Arquitectura

```
Cliente → Telegram Bot
  → n8n Telegram Trigger (download: true)
      ├─ [Es audio?] TRUE
      │    → Preparar Binario   ($binary.voice → $binary.data)
      │    → Transcribir Audio  (OpenAI Whisper, español)
      │    → Normalizar         (input_type: 'audio')
      │
      └─ [Es audio?] FALSE
           → Normalizar Texto   (input_type: 'text')
  
  [Fan-in] → Parsear Mensaje    (extrae restaurante, fecha, hora, personas, nombre)
           → [Datos completos?]
               TRUE  → Buscar Restaurante (Supabase)
                     → Buscar Sucursal
                     → Buscar Mesas disponibles
                     → Verificar Conflictos de horario
                     → Preparar Reserva (asignar mesa o pending)
                     → Insertar en reservations
                     → Insertar en events (source: 'n8n')
                     → Confirmar por Telegram
               FALSE → Responder "necesito más datos"
```

Bistró OS ve la reserva en `/reservations` porque lee directamente de Supabase — **sin cambios en el código de la app**.

### Workflow en n8n Cloud

| Campo | Valor |
|---|---|
| Nombre | `Bistró OS — Telegram Audio Reservation` |
| ID | `1Twr5DBBHwtIrjy9` |
| Nodos | 21 |
| Estado | Borrador (activar tras configurar credenciales) |
| URL | `https://omargonzalez.app.n8n.cloud/workflow/1Twr5DBBHwtIrjy9` |

### Credenciales necesarias en n8n

| Nombre en n8n | Tipo | Qué guarda |
|---|---|---|
| `Bistró Telegram Bot` | Telegram API | Token del bot de @BotFather |
| `OpenAI Bistró` | OpenAI API | API key de OpenAI (para Whisper) |

### Variables n8n (Settings → Variables)

| Variable | Valor |
|---|---|
| `SUPABASE_URL` | `https://xxxxxxxxxxxx.supabase.co` (sin `/rest/v1`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key de Supabase (nunca anon key) |

> **Por qué service_role:** el workflow es un backend privado. Con service_role se bypasea RLS y n8n puede insertar reservas sin políticas adicionales.
> **Por qué no en Bistró OS:** ni el token de Telegram ni las claves de Supabase service_role viven en el frontend ni en variables de Vercel.

### Datos base en Supabase

Correr `supabase/seed_restaurants_demo.sql` en el SQL Editor de Supabase.
Crea 3 restaurantes + sucursales + mesas con IDs fijos:

| Restaurante | restaurant_id | branch_id |
|---|---|---|
| Bistro Palermo | `11111111-0000-0000-0000-000000000001` | `11111111-0000-0000-0000-000000000010` |
| Casa Norte | `22222222-0000-0000-0000-000000000001` | `22222222-0000-0000-0000-000000000010` |
| La Mesa Dorada | `33333333-0000-0000-0000-000000000001` | `33333333-0000-0000-0000-000000000010` |

### Cómo probar — Audio

1. Activar el workflow en n8n (toggle ON).
2. Abrir el bot de Telegram.
3. Mandar un mensaje de voz diciendo:

> *"Hola, quiero reservar en Casa Norte para 4 personas mañana a las 21:30. Soy Omar González. Mi teléfono es 1155555555."*

4. n8n transcribe el audio, extrae los datos, busca la mesa y responde.
5. Verificar en Supabase:
```sql
SELECT customer_name, reservation_date, status, metadata->>'source'
FROM reservations
ORDER BY created_at DESC LIMIT 5;
```
6. Abrir Bistró OS `/reservations` — la reserva aparece automáticamente.

### Cómo probar — Texto (fallback)

Enviar al bot de Telegram el comando:
```
/reservar casa-norte | Omar González | 2026-06-02 | 21:30 | 4 | 1155555555 | omar@email.com
```

También acepta lenguaje natural:
```
Quiero reservar en Bistro Palermo para 2 personas el 2026-06-05 a las 20:00. Soy Ana Pérez.
```

### Restaurantes aceptados

| Input del usuario | Nombre en Supabase |
|---|---|
| `bistro-palermo`, `bistro palermo` | `Bistro Palermo` |
| `casa-norte`, `casa norte` | `Casa Norte` |
| `la-mesa-dorada`, `la mesa dorada` | `La Mesa Dorada` |

### Metadata guardada en `reservations.metadata`

```json
{
  "source": "telegram_audio",
  "telegram_chat_id": "123456789",
  "telegram_username": "omaruser",
  "raw_message": "[audio]",
  "transcription": "Quiero reservar en Casa Norte...",
  "assigned_table_label": "Mesa 3"
}
```

Para reservas por texto: `"source": "telegram_text"`.

### Evento en `events`

```json
{
  "source": "n8n",
  "event_type": "reservation.created_from_telegram",
  "payload": {
    "status": "confirmed",
    "source_type": "telegram_audio",
    "telegram_chat_id": "..."
  }
}
```

---

## Regla arquitectónica

> Si una funcionalidad depende críticamente de existir para que el restaurante opere, no debe vivir solo en n8n.

Las reservas por Telegram son un **canal adicional**, no el canal principal. El equipo siempre puede crear reservas directamente en Bistró OS.

---

## Riesgos

| Riesgo | Severidad | Mitigación |
|---|---|---|
| `download: true` en Trigger no descarga voz en todas las versiones de n8n | Media | `Preparar Binario` intenta `voice`, `audio`, `data`; lanza error claro si falla |
| Whisper transcribe mal el nombre del restaurante | Media | Regex fuzzy + NAMES map; fallback a `/reservar` por texto |
| `restaurants` sin columna `slug` → búsqueda por `name=ilike` | Baja | Funcional; agregar slug es mejora futura |
| `SUPABASE_SERVICE_ROLE_KEY` en n8n Variables (no credential) | Media | Es backend privado; documentar que no debe usarse en anon flow |
| Bot de Telegram público: cualquiera puede mandar mensajes | Media | Para demo OK; en producción agregar `chatIds` allowlist en el Trigger |
| OpenAI Whisper tiene costo por audio | Baja | ~$0.006/min; irrelevante para demo |

---

## Roadmap

- [ ] Agregar `slug` column en `restaurants` (SQL comentado en `schema.sql`)
- [ ] Allowlist de `chatIds` en el Trigger para limitar el bot a usuarios conocidos
- [ ] Webhook inverso: cuando el equipo cancela una reserva en Bistró OS → notificar al cliente por Telegram
- [ ] Manejo de `video_note` (notas de video circulares de Telegram) además de `voice`
- [ ] Confirmación de disponibilidad por horario real (hoy verifica solo date+time exacto, no rango)
- [ ] Rate limiting para evitar spam al bot

---

## Workflows en n8n Cloud

| Nombre | ID | Estado | Descripción |
|---|---|---|---|
| Bistró OS — Lead Capture | *(local)* | Inactivo | Lead comercial del form /demo |
| Bistró OS — Reservation Notifier | `4ivEAcJ4kSNrv1bF` | Borrador | Webhook → Telegram (primer prototipo) |
| Bistró OS — Telegram Reservation Intake | `V7iYbrPIkbWYmqCa` | Borrador | Solo texto (reemplazado por Audio) |
| Bistró OS — Telegram Audio Reservation | `1Twr5DBBHwtIrjy9` | **Activo (configurar)** | Audio + texto, flujo completo |
