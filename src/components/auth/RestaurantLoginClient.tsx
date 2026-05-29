import { selectRestaurantAction } from "@/features/restaurants/actions";
import type { Branch, Restaurant } from "@/features/restaurants/types";

interface RestaurantLoginClientProps {
  items: { restaurant: Restaurant; branch: Branch | null }[];
}

export function RestaurantLoginClient({ items }: RestaurantLoginClientProps) {
  return (
    <section className="card-premium mx-6 w-full max-w-5xl p-8 md:p-10">
      <div className="mb-8">
        <p className="eyebrow mb-4">Acceso demo · Paso 1 de 2</p>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
          Elegí el restaurante.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-paper/60">
          Cada restaurante demo tiene su propia carta, reservas y operación. La
          selección se guarda en una cookie simple, sin autenticación real.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map(({ restaurant, branch }) => (
          <form key={restaurant.id} action={selectRestaurantAction}>
            <input type="hidden" name="restaurantId" value={restaurant.id} />
            {branch && <input type="hidden" name="branchId" value={branch.id} />}
            <button
              type="submit"
              className="flex h-full w-full flex-col rounded-3xl border border-line bg-layer1/70 p-5 text-left transition hover:border-gold/50 hover:bg-layer1"
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-lg font-bold"
                style={{
                  backgroundColor: `${restaurant.brand_color}22`,
                  color: restaurant.brand_color
                }}
              >
                {restaurant.name.charAt(0)}
              </span>
              <p
                className="mt-4 text-lg font-semibold"
                style={{ color: restaurant.brand_color }}
              >
                {restaurant.name}
              </p>
              <p className="mt-2 text-sm leading-6 text-paper/60">
                {restaurant.description}
              </p>
              {branch && (
                <p className="mt-4 text-xs uppercase tracking-[0.18em] text-paper/45">
                  {branch.name}
                </p>
              )}
            </button>
          </form>
        ))}
      </div>
    </section>
  );
}
