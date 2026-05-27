import { menuCategories as seedMenuCategories, menuItems as seedMenuItems } from "./mock-data";
import type { MenuCatalog, MenuCategory, MenuItem, MenuSummary } from "./types";

export function sortMenuCategories(categories: MenuCategory[]): MenuCategory[] {
  return [...categories].sort((left, right) => {
    const leftPosition = left.position ?? Number.MAX_SAFE_INTEGER;
    const rightPosition = right.position ?? Number.MAX_SAFE_INTEGER;

    if (leftPosition !== rightPosition) {
      return leftPosition - rightPosition;
    }

    return left.name.localeCompare(right.name, "es");
  });
}

export function sortMenuItems(
  items: MenuItem[],
  categories: MenuCategory[] = seedMenuCategories
): MenuItem[] {
  const categoryOrder = new Map(
    sortMenuCategories(categories).map((category, index) => [category.id, index])
  );

  return [...items].sort((left, right) => {
    const leftCategory = categoryOrder.get(left.category_id) ?? Number.MAX_SAFE_INTEGER;
    const rightCategory = categoryOrder.get(right.category_id) ?? Number.MAX_SAFE_INTEGER;

    if (leftCategory !== rightCategory) {
      return leftCategory - rightCategory;
    }

    return left.name.localeCompare(right.name, "es");
  });
}

export function normalizeMenuCatalog(catalog: MenuCatalog): MenuCatalog {
  const categories = sortMenuCategories(catalog.categories);
  const items = sortMenuItems(catalog.items, categories);

  return {
    categories,
    items
  };
}

export function getInitialMenuCatalog(): MenuCatalog {
  return normalizeMenuCatalog({
    categories: seedMenuCategories,
    items: seedMenuItems
  });
}

export function getMenuSummary(items: MenuItem[]): MenuSummary {
  return items.reduce<MenuSummary>(
    (summary, item) => ({
      total: summary.total + 1,
      available: summary.available + (item.available ? 1 : 0),
      unavailable: summary.unavailable + (item.available ? 0 : 1),
      featured: summary.featured + (item.featured ? 1 : 0)
    }),
    {
      total: 0,
      available: 0,
      unavailable: 0,
      featured: 0
    }
  );
}

export function filterMenuItems(
  items: MenuItem[],
  {
    categoryId,
    query
  }: {
    categoryId: string;
    query: string;
  }
): MenuItem[] {
  const normalizedQuery = query.trim().toLowerCase();

  return items.filter((item) => {
    const matchesCategory = !categoryId || item.category_id === categoryId;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.description.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });
}

export function groupMenuItemsByCategory(
  categories: MenuCategory[],
  items: MenuItem[]
): Array<MenuCategory & { items: MenuItem[] }> {
  return sortMenuCategories(categories)
    .map((category) => ({
      ...category,
      items: items.filter((item) => item.category_id === category.id)
    }))
    .filter((category) => category.items.length > 0);
}
