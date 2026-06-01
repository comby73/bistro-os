import { notFound } from "next/navigation";
import { ReservaForm } from "./ReservaForm";

// Datos por restaurante: nombre, color, IDs de Supabase (seed_restaurants_demo.sql)
const RESTAURANTS: Record<string, {
  name: string;
  description: string;
  brand_color: string;
  slug: string;
  restaurant_id: string;
  branch_id: string;
}> = {
  "bistro-palermo": {
    name: "Bistró Palermo",
    description: "Cocina de autor en el corazón de Palermo. Producto de estación, brasa y coctelería.",
    brand_color: "#E8B863",
    slug: "bistro-palermo",
    restaurant_id: "11111111-0000-0000-0000-000000000001",
    branch_id: "11111111-0000-0000-0000-000000000010",
  },
  "casa-norte": {
    name: "Casa Norte",
    description: "Sabores del norte argentino en Recoleta. Empanadas, locro y platos de olla.",
    brand_color: "#4A9B7F",
    slug: "casa-norte",
    restaurant_id: "22222222-0000-0000-0000-000000000001",
    branch_id: "22222222-0000-0000-0000-000000000010",
  },
  "la-mesa-dorada": {
    name: "La Mesa Dorada",
    description: "Parrilla clásica de San Telmo. Cortes premium, achuras y vinos de guarda.",
    brand_color: "#C0732A",
    slug: "la-mesa-dorada",
    restaurant_id: "33333333-0000-0000-0000-000000000001",
    branch_id: "33333333-0000-0000-0000-000000000010",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurant = RESTAURANTS[slug];
  if (!restaurant) return { title: "Reservas" };
  return {
    title: `Reservar en ${restaurant.name}`,
    description: `Hacé tu reserva en ${restaurant.name}. ${restaurant.description}`,
  };
}

export default async function ReservarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurant = RESTAURANTS[slug];

  if (!restaurant) notFound();

  return <ReservaForm restaurant={restaurant} />;
}
