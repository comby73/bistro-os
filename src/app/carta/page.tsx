import { redirect } from "next/navigation";

// /carta sin slug → redirige a Bistró Palermo por defecto
export default function CartaPage() {
  redirect("/carta/bistro-palermo");
}
