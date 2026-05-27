import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="bistro-container py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center">
              <BrandLogo size="md" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-paper/60">
              Sistema operativo para restaurantes modernos: pedidos, reservas, cocina,
              ventas y automatizaciones en una plataforma modular.
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow mb-4">Producto</p>
            <ul className="space-y-3 text-sm text-paper/65">
              <li><Link href="/dashboard" className="hover:text-gold">Dashboard</Link></li>
              <li><Link href="/reservations" className="hover:text-gold">Reservas</Link></li>
              <li><Link href="/orders" className="hover:text-gold">Pedidos</Link></li>
              <li><Link href="/kitchen" className="hover:text-gold">Cocina</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow mb-4">Recursos</p>
            <ul className="space-y-3 text-sm text-paper/65">
              <li><Link href="/demo" className="hover:text-gold">Ver demo</Link></li>
              <li><a href="#pricing" className="hover:text-gold">Precios</a></li>
              <li><a href="#faq" className="hover:text-gold">FAQ</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow mb-4">Contacto</p>
            <p className="text-sm leading-6 text-paper/60">
              Para el prototipo académico, los formularios funcionan con mocks seguros.
              La integración real se activa con Supabase y n8n.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-mute md:flex-row md:justify-between">
          <span>© 2026 Bistró OS. Prototipo académico/comercial.</span>
          <span>Hecho para demostrar arquitectura, producto y Vibe Coding.</span>
        </div>
      </div>
    </footer>
  );
}
