import { menuCategories, menuItems as seedMenuItems } from "./mock-data";
import type { MenuCategory, MenuItem, MenuSummary } from "./types";

export function getInitialMenuItems(): MenuItem[] {
  return sortMenuItems(seedMenuItems);
}

export function sortMenuItems(items: MenuItem[]): MenuItem[] {
  const categoryOrder = new Map(menuCategories.map((category, index) => [category.id, index]));

  return [...items].sort((left, right) => {
    const leftCategory = categoryOrder.get(left.category_id) ?? Number.MAX_SAFE_INTEGER;
    const rightCategory = categoryOrder.get(right.category_id) ?? Number.MAX_SAFE_INTEGER;

    if (leftCategory !== rightCategory) {
      return leftCategory - rightCategory;
    }

    return left.name.localeCompare(right.name, "es");
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
  return categories
    .map((category) => ({
      ...category,
      items: items.filter((item) => item.category_id === category.id)
    }))
    .filter((category) => category.items.length > 0);
}
