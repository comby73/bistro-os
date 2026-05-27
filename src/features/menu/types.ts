export interface MenuCategory {
  id: string;
  name: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  featured: boolean;
}

export interface MenuSummary {
  total: number;
  available: number;
  unavailable: number;
  featured: number;
}
