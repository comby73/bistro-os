import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DemoLeadForm } from "@/components/landing/DemoLeadForm";

export default function DemoPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <section className="bistro-container py-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="eyebrow mb-4">Solicitud de demo</p>
              <h1 className="max-w-xl text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
                Veamos si Bistró OS encaja con tu operación.
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-7 text-paper/62">
                Este formulario representa el flujo de captura de leads. En producción,
                se conecta a Supabase, dispara n8n y clasifica el lead con IA.
              </p>
            </div>
            <DemoLeadForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
