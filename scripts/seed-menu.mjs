/**
 * Seed de menú → Supabase (fuente de verdad).
 * Lee el catálogo compartido src/features/menu/catalog.json.
 *
 * Idempotente: usa UUIDs deterministas (upsert por id). Re-ejecutable sin duplicar.
 * Archiva en Supabase los items/categorías que ya no están en el catálogo.
 *
 * Uso:  node scripts/seed-menu.mjs   (o  npm run seed:menu)
 * Requiere .env.local con NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { createHash } from "crypto";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// --- env (sin imprimir secretos) ---
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

// --- UUID determinista (v5-like sobre sha1) → idempotencia ---
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

const catId  = (restaurantId, categorySlug) => uuidFromString(`cat:${restaurantId}:${categorySlug}`);
const itemId = (legacyId) => uuidFromString(`item:${legacyId}`);

// --- catálogo compartido ---
const catalog = JSON.parse(
  readFileSync(join(ROOT, "src/features/menu/catalog.json"), "utf-8")
);
const branchOf = (restaurantId) => catalog.branchIds[restaurantId] ?? null;

async function main() {
  console.log("🌱 Seed de menú → Supabase\n");

  const restaurantIds = [...new Set(catalog.items.map((i) => i.restaurant_id))];

  // 1) CATEGORÍAS por restaurante (5 por cada uno) ----------------------------
  const categoryRows = [];
  for (const restaurantId of restaurantIds) {
    for (const cat of catalog.categories) {
      categoryRows.push({
        id: catId(restaurantId, cat.id),
        restaurant_id: restaurantId,
        branch_id: branchOf(restaurantId),
        name: cat.name,
        position: cat.position ?? 0,
        status: "active",
        metadata: { source: "seed-menu", slug: cat.id },
      });
    }
  }
  {
    const { error } = await sb.from("menu_categories").upsert(categoryRows, { onConflict: "id" });
    if (error) { console.error("❌ menu_categories:", error.message); process.exit(1); }
    console.log(`✅ menu_categories: ${categoryRows.length} filas`);
  }

  // 2) ITEMS ------------------------------------------------------------------
  const itemRows = catalog.items.map((it) => {
    const metadata = { source: "seed-menu", legacy_id: it.id };
    if (it.image_url) metadata.image_url = it.image_url;
    return {
      id: itemId(it.id),
      restaurant_id: it.restaurant_id,
      branch_id: branchOf(it.restaurant_id),
      category_id: catId(it.restaurant_id, it.category_id),
      name: it.name,
      description: it.description ?? null,
      base_price: it.price,            // price (mock) → base_price (columna real)
      station: it.station,
      available: it.available !== false,
      featured: it.featured === true,
      status: "active",
      metadata,
    };
  });
  {
    const { error } = await sb.from("menu_items").upsert(itemRows, { onConflict: "id" });
    if (error) { console.error("❌ menu_items:", error.message); process.exit(1); }
    console.log(`✅ menu_items: ${itemRows.length} filas`);
  }

  // 3) ARCHIVAR lo que ya no está en el catálogo ------------------------------
  const keepCategoryIds = new Set(categoryRows.map((c) => c.id));
  const keepItemIds = new Set(itemRows.map((i) => i.id));

  const { data: existingCats } = await sb.from("menu_categories").select("id, status");
  const staleCats = (existingCats ?? []).filter((c) => !keepCategoryIds.has(c.id) && c.status !== "inactive");
  if (staleCats.length) {
    await sb.from("menu_categories").update({ status: "inactive" }).in("id", staleCats.map((c) => c.id));
    console.log(`🗄️  menu_categories archivadas: ${staleCats.length}`);
  }

  const { data: existingItems } = await sb.from("menu_items").select("id, status");
  const staleItems = (existingItems ?? []).filter((i) => !keepItemIds.has(i.id) && i.status !== "archived");
  if (staleItems.length) {
    await sb.from("menu_items").update({ status: "archived", available: false }).in("id", staleItems.map((i) => i.id));
    console.log(`🗄️  menu_items archivados: ${staleItems.length}`);
  }

  // 4) VALIDACIÓN -------------------------------------------------------------
  console.log("\n📊 Items activos por restaurante:");
  for (const rid of restaurantIds) {
    const { count } = await sb
      .from("menu_items")
      .select("*", { count: "exact", head: true })
      .eq("restaurant_id", rid)
      .eq("status", "active");
    console.log(`   ${rid} → ${count} items`);
  }

  console.log("\n🎉 Seed de menú completo.");
}

main().catch((e) => { console.error(e); process.exit(1); });
