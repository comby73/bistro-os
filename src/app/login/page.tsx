import { cookies } from "next/headers";
import { RoleLoginClient } from "@/components/auth/RoleLoginClient";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DEMO_ROLE_COOKIE, parseDemoRole } from "@/features/auth/demo-session";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const currentRole = parseDemoRole(cookieStore.get(DEMO_ROLE_COOKIE)?.value);

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center pt-20">
        <RoleLoginClient initialRoleId={currentRole} />
      </main>
      <Footer />
    </>
  );
}
