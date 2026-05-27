import { AppShell } from "@/components/layout/AppShell";
import { menuCategories, menuItems } from "@/features/menu/mock-data";

export default function MenuPage() {
  return (
    <AppShell currentPath="/menu">
      <section>
        <div className="mb-10">
          <p className="eyebrow mb-3">Menú</p>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
            Carta digital editable.
          </h2>
        </div>

        <div className="space-y-8">
          {menuCategories.map((category) => (
            <section key={category.id}>
              <h3 className="mb-4 text-xl font-semibold text-gold">{category.name}</h3>
              <div className="grid gap-4 lg:grid-cols-3">
                {menuItems
                  .filter((item) => item.category_id === category.id)
                  .map((item) => (
                    <article key={item.id} className="card-premium p-6">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="font-semibold">{item.name}</h4>
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
    </AppShell>
  );
}
