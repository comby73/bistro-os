import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { menuCategories, menuItems } from "@/features/menu/mock-data";

export default function MenuPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <section className="bistro-container py-12">
          <div className="mb-10">
            <p className="eyebrow mb-3">Menú QR</p>
            <h1 className="text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
              Carta digital editable.
            </h1>
          </div>

          <div className="space-y-8">
            {menuCategories.map((category) => (
              <section key={category.id}>
                <h2 className="mb-4 text-xl font-semibold text-gold">{category.name}</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  {menuItems
                    .filter((item) => item.category_id === category.id)
                    .map((item) => (
                      <article key={item.id} className="card-premium p-6">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-semibold">{item.name}</h3>
                          <span className="text-gold">USD {item.price}</span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-paper/60">{item.description}</p>
                      </article>
                    ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
