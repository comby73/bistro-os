import { describe, expect, it } from "vitest";
import {
  filterMenuItems,
  getMenuSummary,
  groupMenuItemsByCategory
} from "../src/features/menu/calculations";
import { menuCategories, menuItems } from "../src/features/menu/mock-data";

describe("menu calculations", () => {
  it("resume disponibilidad y destacados", () => {
    const summary = getMenuSummary(menuItems);

    expect(summary.total).toBe(4);
    expect(summary.available).toBe(4);
    expect(summary.unavailable).toBe(0);
    expect(summary.featured).toBe(2);
  });

  it("filtra productos por categoría y búsqueda", () => {
    expect(filterMenuItems(menuItems, { categoryId: "cat-2", query: "" })).toHaveLength(2);
    expect(filterMenuItems(menuItems, { categoryId: "", query: "negroni" })).toHaveLength(1);
  });

  it("agrupa productos visibles por categoría", () => {
    const grouped = groupMenuItemsByCategory(menuCategories, [menuItems[0], menuItems[3]]);

    expect(grouped.map((category) => category.id)).toEqual(["cat-1", "cat-3"]);
    expect(grouped[0]?.items).toHaveLength(1);
  });
});
