/**
 * Seed de reservas → Supabase.
 * 3 reservas por restaurante con branch_id correcto y estados variados.
 *
 * Idempotente: UUID determinista por (restaurante, índice) + upsert por id.
 *
 * Uso:  node scripts/seed-reservations.mjs   (o  npm run seed:reservations)
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { createHash } from "crypto";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

for (const line of readFileSync(join(ROOT, ".env.local"), "utf-8").split("\n")) {
  const [k, ...v] = line.split("=");
  if (k && v.length) process.env[k.trim()] = v.join("=").trim();
}
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("❌ Faltan variables de Supabase en .env.local");
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

function uuidFromString(input) {
  const h = createHash("sha1").update(input).digest("hex");
  return [
    h.slice(0, 8),
    h.slice(8, 12),
    "5" + h.slice(13, 16),
    ((parseInt(h.slice(16, 18), 16) & 0x3f) | 0x80).toString(16) + h.slice(18, 20),
    h.slice(20, 32),
  ].join("-");
}

function dayOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const RESTAURANTS = [
  { id: "00000000-0000-0000-0000-000000000001", branch: "00000000-0000-0000-0000-000000000010", name: "Bistró Palermo" },
  { id: "00000000-0000-0000-0000-000000000002", branch: "00000000-0000-0000-0000-000000000020", name: "Casa Norte" },
  { id: "00000000-0000-0000-0000-000000000003", branch: "00000000-0000-0000-0000-000000000030", name: "La Mesa Dorada" },
];

// 3 plantillas de reserva por restaurante (estados variados)
const TEMPLATES = [
  { customer_name: "Mariana López",  customer_contact: "+54 9 11 4567 8899", reservation_time: "21:00", party_size: 4, status: "pending",   notes: "Aniversario, mesa tranquila." },
  { customer_name: "Diego Ferrer",   customer_contact: "+54 9 11 3344 9922", reservation_time: "22:00", party_size: 2, status: "confirmed", notes: null },
  { customer_name: "Valeria Costa",  customer_contact: "+54 9 11 6677 1100", reservation_time: "20:30", party_size: 6, status: "seated",    notes: "Llega 15 min tarde." },
];

async function main() {
  console.log("🌱 Seed de reservas → Supabase\n");

  const rows = [];
  for (const r of RESTAURANTS) {
    TEMPLATES.forEach((tpl, idx) => {
      rows.push({
        id: uuidFromString(`res:${r.id}:${idx}`),
        restaurant_id: r.id,
        branch_id: r.branch,
        customer_name: tpl.customer_name,
        customer_contact: tpl.customer_contact,
        reservation_date: dayOffset(0),
        reservation_time: tpl.reservation_time,
        party_size: tpl.party_size,
        status: tpl.status,
        notes: tpl.notes,
        metadata: { source: "seed-reservations" },
      });
    });
  }

  const { error } = await sb.from("reservations").upsert(rows, { onConflict: "id" });
  if (error) { console.error("❌ reservations:", error.message); process.exit(1); }
  console.log(`✅ reservations: ${rows.length} filas upsert`);

  console.log("\n📊 Reservas por restaurante:");
  for (const r of RESTAURANTS) {
    const { count } = await sb
      .from("reservations")
      .select("*", { count: "exact", head: true })
      .eq("restaurant_id", r.id);
    console.log(`   ${r.name.padEnd(16)} → ${count}`);
  }

  console.log("\n🎉 Seed de reservas completo.");
}

main().catch((e) => { console.error(e); process.exit(1); });
