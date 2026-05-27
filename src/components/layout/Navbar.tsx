import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

const links = [
  { href: "#how", label: "Cómo funciona" },
  { href: "#features", label: "Plataforma" },
  { href: "#testimonials", label: "Clientes" },
  { href: "#pricing", label: "Precios" },
  { href: "#faq", label: "FAQ" }
];

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-ink/80 backdrop-blur-xl">
      <div className="bistro-container flex h-16 items-center justify-between">
        <Link href="/" className="inline-flex items-center">
          <BrandLogo size="sm" priority />
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-paper/75 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-paper">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm text-paper/70 transition hover:text-paper sm:inline">
            Ingresar
          </Link>
          <Link href="/demo" className="btn-gold px-4 py-2 text-xs">
            Probar demo
          </Link>
        </div>
      </div>
    </header>
  );
}
