export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo_url?: string;
  cover_image_url?: string;
  brand_color: string;
  /** Imágenes de cabecera (carrusel) administradas por owner/admin, en Storage. */
  hero_images?: string[];
}

export interface Branch {
  id: string;
  restaurant_id: string;
  name: string;
  address: string;
}

export interface RestaurantSession {
  restaurantId: string;
  branchId: string | null;
}

export interface DemoUser {
  id: string;
  name: string;
  title: string;          // "Dueña", "Jefe de sala", "Mozo"
  role_id: string;        // matches RoleId
  restaurant_id: string;
  avatar_color: string;   // hex for the avatar circle
  avatar_initials: string;
}
