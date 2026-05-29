/**
 * Seed script — bistro-os demo data
 * Run once: node scripts/seed-supabase.mjs
 *
 * Seeds:
 *  • 3 restaurants  (metadata: slug, description, brand_color)
 *  • 3 branches
 *  • 12 profiles    (metadata: demo_role, avatar_color, avatar_initials)
 *  • 12 role_assignments
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Manual .env.local parse (no dotenv dependency needed)
const envContent = readFileSync(".env.local", "utf-8");
for (const line of envContent.split("\n")) {
  const [key, ...rest] = line.split("=");
  if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// ─── RESTAURANTS ───────────────────────────────────────────────────────────
const restaurants = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Bistró Palermo",
    legal_name: "Bistró Palermo SRL",
    email: "demo@bistro-os.com",
    phone: "+54 11 5555 0101",
    city: "Buenos Aires",
    country: "Argentina",
    plan: "Pro",
    status: "active",
    metadata: {
      source: "seed",
      slug: "bistro-palermo",
      description: "Cocina de autor en el corazón de Palermo. Producto de estación, brasa y coctelería.",
      brand_color: "#E8B863"
    }
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Casa Norte",
    legal_name: "Casa Norte SRL",
    email: "info@casanorte.com",
    phone: "+54 11 5555 0202",
    city: "Buenos Aires",
    country: "Argentina",
    plan: "Pro",
    status: "active",
    metadata: {
      source: "seed",
      slug: "casa-norte",
      description: "Sabores del norte argentino en Recoleta. Empanadas, locro y platos de olla.",
      brand_color: "#4A9B7F"
    }
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "La Mesa Dorada",
    legal_name: "La Mesa Dorada SRL",
    email: "info@lamesadorada.com",
    phone: "+54 11 5555 0303",
    city: "Buenos Aires",
    country: "Argentina",
    plan: "Pro",
    status: "active",
    metadata: {
      source: "seed",
      slug: "la-mesa-dorada",
      description: "Parrilla clásica de San Telmo. Cortes premium, achuras y vinos de guarda.",
      brand_color: "#C0732A"
    }
  }
];

// ─── BRANCHES ───────────────────────────────────────────────────────────────
const branches = [
  {
    id: "00000000-0000-0000-0000-000000000010",
    restaurant_id: "00000000-0000-0000-0000-000000000001",
    name: "Palermo Hollywood",
    address: "Honduras 5500, Palermo, CABA",
    city: "Buenos Aires",
    phone: "+54 11 5555 0101",
    timezone: "America/Argentina/Buenos_Aires",
    status: "active",
    metadata: { source: "seed" }
  },
  {
    id: "00000000-0000-0000-0000-000000000020",
    restaurant_id: "00000000-0000-0000-0000-000000000002",
    name: "Recoleta",
    address: "Av. Callao 1200, Recoleta, CABA",
    city: "Buenos Aires",
    phone: "+54 11 5555 0202",
    timezone: "America/Argentina/Buenos_Aires",
    status: "active",
    metadata: { source: "seed" }
  },
  {
    id: "00000000-0000-0000-0000-000000000030",
    restaurant_id: "00000000-0000-0000-0000-000000000003",
    name: "San Telmo",
    address: "Defensa 800, San Telmo, CABA",
    city: "Buenos Aires",
    phone: "+54 11 5555 0303",
    timezone: "America/Argentina/Buenos_Aires",
    status: "active",
    metadata: { source: "seed" }
  }
];

// ─── PROFILES ───────────────────────────────────────────────────────────────
const profiles = [
  // Bistró Palermo
  { id: "00000000-0000-0000-0000-000000000101", restaurant_id: "00000000-0000-0000-0000-000000000001", branch_id: "00000000-0000-0000-0000-000000000010", full_name: "Valentina Ruiz",   email: "owner@bistro-os.com",   phone: "+54 11 5555 1001", status: "active", metadata: { demo_role: "owner",   avatar_color: "#E8B863", avatar_initials: "VR", title: "Dueña" } },
  { id: "00000000-0000-0000-0000-000000000102", restaurant_id: "00000000-0000-0000-0000-000000000001", branch_id: "00000000-0000-0000-0000-000000000010", full_name: "Martín López",    email: "admin@bistro-os.com",   phone: "+54 11 5555 1002", status: "active", metadata: { demo_role: "admin",   avatar_color: "#b8966a", avatar_initials: "ML", title: "Administrador" } },
  { id: "00000000-0000-0000-0000-000000000103", restaurant_id: "00000000-0000-0000-0000-000000000001", branch_id: "00000000-0000-0000-0000-000000000010", full_name: "Sofía Torres",    email: "manager@bistro-os.com", phone: "+54 11 5555 1003", status: "active", metadata: { demo_role: "manager", avatar_color: "#9a7d55", avatar_initials: "ST", title: "Jefa de sala" } },
  { id: "00000000-0000-0000-0000-000000000104", restaurant_id: "00000000-0000-0000-0000-000000000001", branch_id: "00000000-0000-0000-0000-000000000010", full_name: "Carlos Díaz",     email: "waiter@bistro-os.com",  phone: "+54 11 5555 1004", status: "active", metadata: { demo_role: "waiter",  avatar_color: "#c9a165", avatar_initials: "CD", title: "Mozo" } },
  { id: "00000000-0000-0000-0000-000000000105", restaurant_id: "00000000-0000-0000-0000-000000000001", branch_id: "00000000-0000-0000-0000-000000000010", full_name: "Lucas Herrera",   email: "kitchen@bistro-os.com", phone: "+54 11 5555 1005", status: "active", metadata: { demo_role: "kitchen", avatar_color: "#6b5740", avatar_initials: "LH", title: "Cocinero" } },

  // Casa Norte
  { id: "00000000-0000-0000-0000-000000000111", restaurant_id: "00000000-0000-0000-0000-000000000002", branch_id: "00000000-0000-0000-0000-000000000020", full_name: "Roberto Sosa",     email: "owner@casanorte.com",   phone: "+54 11 5555 2001", status: "active", metadata: { demo_role: "owner",   avatar_color: "#4A9B7F", avatar_initials: "RS", title: "Dueño" } },
  { id: "00000000-0000-0000-0000-000000000112", restaurant_id: "00000000-0000-0000-0000-000000000002", branch_id: "00000000-0000-0000-0000-000000000020", full_name: "Jimena Aguirre",   email: "admin@casanorte.com",   phone: "+54 11 5555 2002", status: "active", metadata: { demo_role: "admin",   avatar_color: "#3a7a63", avatar_initials: "JA", title: "Administradora" } },
  { id: "00000000-0000-0000-0000-000000000113", restaurant_id: "00000000-0000-0000-0000-000000000002", branch_id: "00000000-0000-0000-0000-000000000020", full_name: "Pablo Flores",     email: "manager@casanorte.com", phone: "+54 11 5555 2003", status: "active", metadata: { demo_role: "manager", avatar_color: "#2d5e4c", avatar_initials: "PF", title: "Jefe de sala" } },
  { id: "00000000-0000-0000-0000-000000000114", restaurant_id: "00000000-0000-0000-0000-000000000002", branch_id: "00000000-0000-0000-0000-000000000020", full_name: "Ana Belén Castro", email: "waiter@casanorte.com",  phone: "+54 11 5555 2004", status: "active", metadata: { demo_role: "waiter",  avatar_color: "#4A9B7F", avatar_initials: "AC", title: "Moza" } },

  // La Mesa Dorada
  { id: "00000000-0000-0000-0000-000000000121", restaurant_id: "00000000-0000-0000-0000-000000000003", branch_id: "00000000-0000-0000-0000-000000000030", full_name: "Eduardo Gómez",   email: "owner@mesadorada.com",   phone: "+54 11 5555 3001", status: "active", metadata: { demo_role: "owner",   avatar_color: "#C0732A", avatar_initials: "EG", title: "Dueño" } },
  { id: "00000000-0000-0000-0000-000000000122", restaurant_id: "00000000-0000-0000-0000-000000000003", branch_id: "00000000-0000-0000-0000-000000000030", full_name: "Luciana Vera",    email: "admin@mesadorada.com",   phone: "+54 11 5555 3002", status: "active", metadata: { demo_role: "admin",   avatar_color: "#9a5c22", avatar_initials: "LV", title: "Administradora" } },
  { id: "00000000-0000-0000-0000-000000000123", restaurant_id: "00000000-0000-0000-0000-000000000003", branch_id: "00000000-0000-0000-0000-000000000030", full_name: "Nicolás Ortiz",   email: "manager@mesadorada.com", phone: "+54 11 5555 3003", status: "active", metadata: { demo_role: "manager", avatar_color: "#7a4819", avatar_initials: "NO", title: "Jefe de sala" } },
  { id: "00000000-0000-0000-0000-000000000124", restaurant_id: "00000000-0000-0000-0000-000000000003", branch_id: "00000000-0000-0000-0000-000000000030", full_name: "Daniela Ríos",    email: "waiter@mesadorada.com",  phone: "+54 11 5555 3004", status: "active", metadata: { demo_role: "waiter",  avatar_color: "#5c3613", avatar_initials: "DR", title: "Moza" } }
];

// ─── ROLE ASSIGNMENTS ────────────────────────────────────────────────────────
const roleAssignments = profiles.map((p, i) => ({
  id: `00000000-0000-0000-0000-0000000003${String(i + 1).padStart(2, "0")}`,
  restaurant_id: p.restaurant_id,
  branch_id: p.branch_id,
  profile_id: p.id,
  role: p.metadata.demo_role,
  status: "active",
  metadata: { source: "seed" }
}));

async function upsert(table, rows) {
  const { error } = await sb.from(table).upsert(rows, { onConflict: "id", ignoreDuplicates: false });
  if (error) {
    console.error(`❌ ${table}:`, error.message);
  } else {
    console.log(`✅ ${table}: ${rows.length} rows`);
  }
}

async function deleteAndInsert(table, rows) {
  const ids = rows.map(r => r.id);
  // delete by matching profile_id to avoid unique constraint issues
  const profileIds = rows.map(r => r.profile_id);
  await sb.from(table).delete().in("profile_id", profileIds);
  const { error } = await sb.from(table).insert(rows);
  if (error) {
    console.error(`❌ ${table}:`, error.message);
  } else {
    console.log(`✅ ${table}: ${rows.length} rows`);
  }
}

async function main() {
  console.log("🌱 Seeding Supabase...\n");
  await upsert("restaurants", restaurants);
  await upsert("branches", branches);
  await upsert("profiles", profiles);
  await deleteAndInsert("role_assignments", roleAssignments);
  console.log("\n🎉 Done!");
}

main().catch(console.error);
