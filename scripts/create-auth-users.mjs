/**
 * Crea los usuarios en Supabase Auth y los vincula con los perfiles.
 * Contraseña por defecto: bistro2026
 * Run: node scripts/create-auth-users.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

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

const DEFAULT_PASSWORD = "bistro2026";

// Todos los perfiles con sus emails
const users = [
  // Bistró Palermo
  { id: "00000000-0000-0000-0000-000000000101", email: "owner@bistro-os.com",   name: "Valentina Ruiz" },
  { id: "00000000-0000-0000-0000-000000000102", email: "admin@bistro-os.com",   name: "Martín López" },
  { id: "00000000-0000-0000-0000-000000000103", email: "manager@bistro-os.com", name: "Sofía Torres" },
  { id: "00000000-0000-0000-0000-000000000104", email: "waiter@bistro-os.com",  name: "Carlos Díaz" },
  { id: "00000000-0000-0000-0000-000000000105", email: "kitchen@bistro-os.com", name: "Lucas Herrera" },
  // Casa Norte
  { id: "00000000-0000-0000-0000-000000000111", email: "owner@casanorte.com",   name: "Roberto Sosa" },
  { id: "00000000-0000-0000-0000-000000000112", email: "admin@casanorte.com",   name: "Jimena Aguirre" },
  { id: "00000000-0000-0000-0000-000000000113", email: "manager@casanorte.com", name: "Pablo Flores" },
  { id: "00000000-0000-0000-0000-000000000114", email: "waiter@casanorte.com",  name: "Ana Belén Castro" },
  // La Mesa Dorada
  { id: "00000000-0000-0000-0000-000000000121", email: "owner@mesadorada.com",   name: "Eduardo Gómez" },
  { id: "00000000-0000-0000-0000-000000000122", email: "admin@mesadorada.com",   name: "Luciana Vera" },
  { id: "00000000-0000-0000-0000-000000000123", email: "manager@mesadorada.com", name: "Nicolás Ortiz" },
  { id: "00000000-0000-0000-0000-000000000124", email: "waiter@mesadorada.com",  name: "Daniela Ríos" },
];

async function main() {
  console.log(`🔐 Creando ${users.length} usuarios en Supabase Auth...\n`);

  for (const user of users) {
    // Crear usuario en Auth con el mismo ID que el perfil
    const { data, error } = await sb.auth.admin.createUser({
      email: user.email,
      password: DEFAULT_PASSWORD,
      email_confirm: true,   // no requiere confirmación por email
      user_metadata: { full_name: user.name }
    });

    if (error) {
      if (error.message.includes("already been registered")) {
        console.log(`⚠️  ${user.email} — ya existe, actualizando contraseña...`);
        // Buscar el user_id existente
        const { data: list } = await sb.auth.admin.listUsers();
        const existing = list?.users?.find(u => u.email === user.email);
        if (existing) {
          await sb.auth.admin.updateUserById(existing.id, { password: DEFAULT_PASSWORD });
          // Vincular auth_user_id al perfil
          await sb.from("profiles").update({ auth_user_id: existing.id }).eq("id", user.id);
          console.log(`   ✅ Vinculado: ${user.email} → perfil ${user.id}`);
        }
      } else {
        console.error(`❌ ${user.email}:`, error.message);
      }
      continue;
    }

    // Vincular el auth_user_id al perfil existente
    const authUserId = data.user.id;
    const { error: linkError } = await sb
      .from("profiles")
      .update({ auth_user_id: authUserId })
      .eq("id", user.id);

    if (linkError) {
      console.error(`❌ Vincular perfil ${user.id}:`, linkError.message);
    } else {
      console.log(`✅ ${user.email} → perfil ${user.id}`);
    }
  }

  console.log(`\n🎉 Listo! Contraseña de todos: ${DEFAULT_PASSWORD}`);
  console.log("\nUsuarios de ejemplo:");
  console.log("  owner@bistro-os.com   / bistro2026  (Bistró Palermo - Dueña)");
  console.log("  owner@casanorte.com   / bistro2026  (Casa Norte - Dueño)");
  console.log("  owner@mesadorada.com  / bistro2026  (La Mesa Dorada - Dueño)");
}

main().catch(console.error);
