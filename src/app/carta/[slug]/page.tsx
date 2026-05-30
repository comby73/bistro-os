import { notFound } from "next/navigation";
import { menuCategories, menuItems, RESTAURANT_IDS } from "@/features/menu/mock-data";
import { CartaView } from "@/components/carta/CartaView";
import { demoRestaurants } from "@/features/restaurants/mock-data";

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

  const restaurant = demoRestaurants.find((r) => r.slug === slug);
  const items = menuItems.filter((i) => i.available && i.restaurant_id === restaurantId);

  return (
    <CartaView
      categories={menuCategories}
      items={items}
      restaurantName={restaurant?.name}
      restaurantSlug={slug}
      brandColor={restaurant?.brand_color}
    />
  );
}
