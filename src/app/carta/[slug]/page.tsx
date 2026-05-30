import { notFound } from "next/navigation";
import { RESTAURANT_IDS } from "@/features/menu/mock-data";
import { getMenuCatalogForRestaurant } from "@/features/menu/repository";
import { CartaView } from "@/components/carta/CartaView";
import { demoRestaurants } from "@/features/restaurants/mock-data";
import { getRestaurantByIdFromDb } from "@/features/restaurants/db";

// Mapeo slug → restaurantId (Supabase UUID)
const SLUG_TO_ID: Record<string, string> = {
  "bistro-palermo":  RESTAURANT_IDS.bistro,
  "casa-norte":      RESTAURANT_IDS.casaNorte,
  "la-mesa-dorada":  RESTAURANT_IDS.mesa,
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurantId = SLUG_TO_ID[slug];
  const restaurant = demoRestaurants.find(
    (r) => r.slug === slug || r.id === restaurantId
  );
  return {
    title: restaurant ? `Carta · ${restaurant.name}` : "Carta",
    description: restaurant?.description ?? "Menú del día",
  };
}

export default async function CartaSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurantId = SLUG_TO_ID[slug];

  if (!restaurantId) notFound();

  // Fuente única: el mismo repository que usa /menu interno.
  // Lee Supabase si está configurado; cae a mock filtrado en dev.
  const [catalog, restaurant] = await Promise.all([
    getMenuCatalogForRestaurant(restaurantId),
    getRestaurantByIdFromDb(restaurantId),
  ]);

  const items = catalog.items.filter((item) => item.available);

  return (
    <CartaView
      categories={catalog.categories}
      items={items}
      restaurantName={restaurant?.name}
      restaurantSlug={slug}
      brandColor={restaurant?.brand_color}
      heroImages={restaurant?.hero_images}
    />
  );
}
