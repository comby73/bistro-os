import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center pt-20">
        <section className="card-premium mx-6 w-full max-w-md p-8">
          <p className="eyebrow mb-4">Acceso</p>
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">Ingresar a Bistró OS</h1>
          <p className="mt-4 text-sm leading-7 text-paper/60">
            Placeholder de autenticación. En la versión real se conecta con Supabase Auth.
          </p>
          <div className="mt-8 space-y-4">
            <input className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm outline-none focus:border-gold/70" placeholder="email@restaurante.com" />
            <input className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm outline-none focus:border-gold/70" placeholder="Contraseña" type="password" />
            <button className="btn-gold w-full">Ingresar</button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
