import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DEMO_ROLE_COOKIE, parseDemoRole } from "@/features/auth/demo-session";
import { getDefaultRouteForRole } from "@/features/auth/roles";

export default async function LoginPage() {
  // Si ya tiene sesión activa, redirigir directo
  const cookieStore = await cookies();
  const currentRole = parseDemoRole(cookieStore.get(DEMO_ROLE_COOKIE)?.value);
  if (currentRole) {
    redirect(getDefaultRouteForRole(currentRole));
  }

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center pt-20">
        <LoginForm />
      </main>
      <Footer />
    </>
  );
}
