import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Bistró OS — Gestión inteligente para restaurantes",
  description:
    "Sistema SaaS para restaurantes: reservas, pedidos, cocina, ventas y automatizaciones con IA."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
