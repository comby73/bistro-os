import type { MenuItem } from "@/features/menu/types";
import type { Reservation } from "@/features/reservations/types";
import type { Branch, DemoUser, Restaurant } from "./types";

export const demoRestaurants: Restaurant[] = [
  {
    id: "rest-bistro",
    name: "Bistró Palermo",
    slug: "bistro-palermo",
    description:
      "Cocina de autor en el corazón de Palermo. Producto de estación, brasa y coctelería.",
    brand_color: "#E8B863"
  },
  {
    id: "rest-casa-norte",
    name: "Casa Norte",
    slug: "casa-norte",
    description:
      "Sabores del norte argentino en Recoleta. Empanadas, locro y platos de olla.",
    brand_color: "#4A9B7F"
  },
  {
    id: "rest-mesa-dorada",
    name: "La Mesa Dorada",
    slug: "la-mesa-dorada",
    description:
      "Parrilla clásica de San Telmo. Cortes premium, achuras y vinos de guarda.",
    brand_color: "#C0732A"
  }
];

export const demoBranches: Branch[] = [
  {
    id: "branch-bistro-1",
    restaurant_id: "rest-bistro",
    name: "Palermo Hollywood",
    address: "Honduras 5500, Palermo, CABA"
  },
  {
    id: "branch-casa-1",
    restaurant_id: "rest-casa-norte",
    name: "Recoleta",
    address: "Av. Callao 1200, Recoleta, CABA"
  },
  {
    id: "branch-mesa-1",
    restaurant_id: "rest-mesa-dorada",
    name: "San Telmo",
    address: "Defensa 800, San Telmo, CABA"
  }
];

export const demoMenuItems: MenuItem[] = [
  // Bistró Palermo
  {
    id: "rest-bistro-item-1",
    restaurant_id: "rest-bistro",
    category_id: "cat-1",
    name: "Tartar de atún rojo",
    description: "Palta cremosa, sésamo tostado y soja cítrica.",
    price: 28,
    station: "cold",
    available: true,
    featured: true
  },
  {
    id: "rest-bistro-item-2",
    restaurant_id: "rest-bistro",
    category_id: "cat-2",
    name: "Risotto de hongos",
    description: "Arroz cremoso, parmesano añejo y aceite de trufa.",
    price: 24,
    station: "hot",
    available: true,
    featured: false
  },
  {
    id: "rest-bistro-item-3",
    restaurant_id: "rest-bistro",
    category_id: "cat-2",
    name: "Cordero patagónico",
    description: "Cocción lenta, puré ahumado y jugo reducido.",
    price: 38,
    station: "grill",
    available: true,
    featured: true
  },
  {
    id: "rest-bistro-item-4",
    restaurant_id: "rest-bistro",
    category_id: "cat-3",
    name: "Negroni de la casa",
    description: "Gin artesanal, bitter, vermut rojo y twist de naranja.",
    price: 12,
    station: "bar",
    available: true,
    featured: false
  },
  // Casa Norte
  {
    id: "rest-casa-norte-item-1",
    restaurant_id: "rest-casa-norte",
    category_id: "cat-1",
    name: "Empanadas salteñas",
    description: "Carne cortada a cuchillo, papa y comino. Docena.",
    price: 18,
    station: "hot",
    available: true,
    featured: true
  },
  {
    id: "rest-casa-norte-item-2",
    restaurant_id: "rest-casa-norte",
    category_id: "cat-2",
    name: "Locro norteño",
    description: "Maíz, zapallo, carne y chorizo. Cocción de 6 horas.",
    price: 22,
    station: "hot",
    available: true,
    featured: true
  },
  {
    id: "rest-casa-norte-item-3",
    restaurant_id: "rest-casa-norte",
    category_id: "cat-2",
    name: "Tamales de cabra",
    description: "Hoja de chala, relleno especiado y salsa picante.",
    price: 20,
    station: "hot",
    available: true,
    featured: false
  },
  {
    id: "rest-casa-norte-item-4",
    restaurant_id: "rest-casa-norte",
    category_id: "cat-3",
    name: "Torrontés salteño",
    description: "Copa de vino blanco aromático de altura.",
    price: 9,
    station: "bar",
    available: true,
    featured: false
  },
  // La Mesa Dorada
  {
    id: "rest-mesa-dorada-item-1",
    restaurant_id: "rest-mesa-dorada",
    category_id: "cat-1",
    name: "Provoleta a la parrilla",
    description: "Provolone fundido, orégano y aceite de oliva.",
    price: 16,
    station: "grill",
    available: true,
    featured: true
  },
  {
    id: "rest-mesa-dorada-item-2",
    restaurant_id: "rest-mesa-dorada",
    category_id: "cat-2",
    name: "Bife de chorizo",
    description: "400g a la brasa, sal gruesa y chimichurri de la casa.",
    price: 34,
    station: "grill",
    available: true,
    featured: true
  },
  {
    id: "rest-mesa-dorada-item-3",
    restaurant_id: "rest-mesa-dorada",
    category_id: "cat-2",
    name: "Mollejas crocantes",
    description: "Achuras doradas al punto con limón.",
    price: 21,
    station: "grill",
    available: true,
    featured: false
  },
  {
    id: "rest-mesa-dorada-item-4",
    restaurant_id: "rest-mesa-dorada",
    category_id: "cat-3",
    name: "Malbec de guarda",
    description: "Copa de tinto de alta gama, crianza en roble.",
    price: 11,
    station: "bar",
    available: true,
    featured: false
  }
];

export const demoReservations: Reservation[] = [
  // Bistró Palermo
  {
    id: "rest-bistro-res-1",
    restaurant_id: "rest-bistro",
    branch_id: "branch-bistro-1",
    customer_name: "Mariana López",
    contact_phone: "+54 9 11 4567 8899",
    date: new Date().toISOString().slice(0, 10),
    time: "21:00",
    party_size: 4,
    status: "pending",
    table_assigned: "Mesa 8",
    notes: "Aniversario."
  },
  {
    id: "rest-bistro-res-2",
    restaurant_id: "rest-bistro",
    branch_id: "branch-bistro-1",
    customer_name: "Diego Ferrer",
    contact_phone: "+54 9 11 3344 9922",
    date: new Date().toISOString().slice(0, 10),
    time: "22:00",
    party_size: 2,
    status: "confirmed",
    table_assigned: "Mesa 2"
  },
  {
    id: "rest-bistro-res-3",
    restaurant_id: "rest-bistro",
    branch_id: "branch-bistro-1",
    customer_name: "Valeria Costa",
    contact_phone: "+54 9 11 6677 1100",
    date: new Date().toISOString().slice(0, 10),
    time: "20:30",
    party_size: 6,
    status: "seated",
    table_assigned: "Mesa 12"
  },
  // Casa Norte
  {
    id: "rest-casa-norte-res-1",
    restaurant_id: "rest-casa-norte",
    branch_id: "branch-casa-1",
    customer_name: "Tomás Quiroga",
    contact_phone: "+54 9 11 2211 4433",
    date: new Date().toISOString().slice(0, 10),
    time: "13:00",
    party_size: 5,
    status: "confirmed",
    table_assigned: "Mesa 4"
  },
  {
    id: "rest-casa-norte-res-2",
    restaurant_id: "rest-casa-norte",
    branch_id: "branch-casa-1",
    customer_name: "Lucía Paredes",
    contact_phone: "+54 9 11 8899 1122",
    date: new Date().toISOString().slice(0, 10),
    time: "14:30",
    party_size: 3,
    status: "pending"
  },
  {
    id: "rest-casa-norte-res-3",
    restaurant_id: "rest-casa-norte",
    branch_id: "branch-casa-1",
    customer_name: "Hernán Ríos",
    contact_phone: "+54 9 11 5566 7788",
    date: new Date().toISOString().slice(0, 10),
    time: "21:30",
    party_size: 8,
    status: "seated",
    table_assigned: "Salón privado"
  },
  // La Mesa Dorada
  {
    id: "rest-mesa-dorada-res-1",
    restaurant_id: "rest-mesa-dorada",
    branch_id: "branch-mesa-1",
    customer_name: "Sofía Méndez",
    contact_phone: "+54 9 11 9900 3322",
    date: new Date().toISOString().slice(0, 10),
    time: "22:30",
    party_size: 2,
    status: "confirmed",
    table_assigned: "Mesa 5"
  },
  {
    id: "rest-mesa-dorada-res-2",
    restaurant_id: "rest-mesa-dorada",
    branch_id: "branch-mesa-1",
    customer_name: "Bruno Carrizo",
    contact_phone: "+54 9 11 4411 9988",
    date: new Date().toISOString().slice(0, 10),
    time: "20:00",
    party_size: 4,
    status: "pending",
    notes: "Mesa cerca de la parrilla."
  },
  {
    id: "rest-mesa-dorada-res-3",
    restaurant_id: "rest-mesa-dorada",
    branch_id: "branch-mesa-1",
    customer_name: "Carla Bustos",
    contact_phone: "+54 9 11 7733 6655",
    date: new Date().toISOString().slice(0, 10),
    time: "21:15",
    party_size: 6,
    status: "completed",
    table_assigned: "Mesa 10"
  }
];

export const demoUsers: DemoUser[] = [
  // ── Bistró Palermo ──────────────────────────────────────────
  {
    id: "user-bistro-1",
    name: "Valentina Ruiz",
    title: "Dueña",
    role_id: "owner",
    restaurant_id: "rest-bistro",
    avatar_color: "#E8B863",
    avatar_initials: "VR"
  },
  {
    id: "user-bistro-2",
    name: "Martín López",
    title: "Jefe de sala",
    role_id: "manager",
    restaurant_id: "rest-bistro",
    avatar_color: "#b8966a",
    avatar_initials: "ML"
  },
  {
    id: "user-bistro-3",
    name: "Sofía Torres",
    title: "Moza",
    role_id: "waiter",
    restaurant_id: "rest-bistro",
    avatar_color: "#9a7d55",
    avatar_initials: "ST"
  },
  {
    id: "user-bistro-4",
    name: "Carlos Díaz",
    title: "Cocina",
    role_id: "kitchen",
    restaurant_id: "rest-bistro",
    avatar_color: "#6b5740",
    avatar_initials: "CD"
  },
  // ── Casa Norte ───────────────────────────────────────────────
  {
    id: "user-casa-1",
    name: "Roberto Sosa",
    title: "Administrador",
    role_id: "admin",
    restaurant_id: "rest-casa-norte",
    avatar_color: "#4A9B7F",
    avatar_initials: "RS"
  },
  {
    id: "user-casa-2",
    name: "Jimena Aguirre",
    title: "Jefa de sala",
    role_id: "manager",
    restaurant_id: "rest-casa-norte",
    avatar_color: "#3a7a63",
    avatar_initials: "JA"
  },
  {
    id: "user-casa-3",
    name: "Pablo Flores",
    title: "Mozo",
    role_id: "waiter",
    restaurant_id: "rest-casa-norte",
    avatar_color: "#2d5e4c",
    avatar_initials: "PF"
  },
  {
    id: "user-casa-4",
    name: "Ana Belén Castro",
    title: "Cocina",
    role_id: "kitchen",
    restaurant_id: "rest-casa-norte",
    avatar_color: "#1f4337",
    avatar_initials: "AC"
  },
  // ── La Mesa Dorada ───────────────────────────────────────────
  {
    id: "user-mesa-1",
    name: "Eduardo Gómez",
    title: "Dueño",
    role_id: "owner",
    restaurant_id: "rest-mesa-dorada",
    avatar_color: "#C0732A",
    avatar_initials: "EG"
  },
  {
    id: "user-mesa-2",
    name: "Luciana Vera",
    title: "Administradora",
    role_id: "admin",
    restaurant_id: "rest-mesa-dorada",
    avatar_color: "#9a5c22",
    avatar_initials: "LV"
  },
  {
    id: "user-mesa-3",
    name: "Nicolás Ortiz",
    title: "Jefe de sala",
    role_id: "manager",
    restaurant_id: "rest-mesa-dorada",
    avatar_color: "#7a4819",
    avatar_initials: "NO"
  },
  {
    id: "user-mesa-4",
    name: "Daniela Ríos",
    title: "Moza",
    role_id: "waiter",
    restaurant_id: "rest-mesa-dorada",
    avatar_color: "#5c3613",
    avatar_initials: "DR"
  }
];

export function getDemoUsersForRestaurant(restaurantId: string): DemoUser[] {
  return demoUsers.filter((u) => u.restaurant_id === restaurantId);
}

export function getRestaurantById(restaurantId: string | null | undefined): Restaurant | null {
  if (!restaurantId) return null;
  return demoRestaurants.find((restaurant) => restaurant.id === restaurantId) ?? null;
}

export function getBranchById(branchId: string | null | undefined): Branch | null {
  if (!branchId) return null;
  return demoBranches.find((branch) => branch.id === branchId) ?? null;
}

export function getDefaultBranchForRestaurant(restaurantId: string): Branch | null {
  return demoBranches.find((branch) => branch.restaurant_id === restaurantId) ?? null;
}
