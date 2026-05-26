import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/orders",
  "/reservations",
  "/kitchen",
  "/menu"
];

/**
 * Proxy de protección de rutas (reemplaza middleware.ts, deprecado en Next.js 16).
 *
 * En modo demo académico (DEMO_AUTH_BYPASS=true en .env.local) todas las
 * rutas son accesibles sin login. Esto permite navegar el prototipo sin
 * implementar Supabase Auth todavía.
 *
 * Para activar autenticación real en Fase 2:
 * 1. Quitar DEMO_AUTH_BYPASS del .env.local (o setear a false).
 * 2. Descomentar la validación de sesión Supabase más abajo.
 * 3. Instalar @supabase/ssr y crear el helper de sesión server-side.
 */
export function proxy(request: NextRequest) {
  if (process.env.DEMO_AUTH_BYPASS === "true") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (!isProtected) return NextResponse.next();

  // TODO Fase 2 — validar sesión Supabase:
  // const sessionCookie = request.cookies.get("sb-access-token");
  // if (!sessionCookie) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/orders/:path*",
    "/reservations/:path*",
    "/kitchen/:path*",
    "/menu/:path*"
  ]
};
