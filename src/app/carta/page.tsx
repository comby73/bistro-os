import { menuCategories, menuItems } from "@/features/menu/mock-data";
import { CartaView } from "@/components/carta/CartaView";

export const metadata = {
  title: "Carta · Bistró",
  description: "Menú del día — Bistró Cuisine & Ambiance"
};

export default function CartaPage() {
  const availableItems = menuItems.filter((i) => i.available);
  return <CartaView categories={menuCategories} items={availableItems} />;
}
