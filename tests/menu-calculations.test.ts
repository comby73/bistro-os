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

    // Totales derivados del catálogo real — no hardcodeamos un número fijo
    expect(summary.total).toBe(menuItems.length);
    expect(summary.available).toBe(menuItems.filter((i) => i.available).length);
    expect(summary.unavailable).toBe(menuItems.filter((i) => !i.available).length);
    expect(summary.featured).toBe(menuItems.filter((i) => i.featured).length);
    // Postcondición mínima: siempre hay al menos un destacado y un disponible
    expect(summary.featured).toBeGreaterThan(0);
    expect(summary.available).toBeGreaterThan(0);
  });

  it("filtra productos por categoría y búsqueda", () => {
    const principales = filterMenuItems(menuItems, { categoryId: "cat-principales", query: "" });
    const parrilla    = filterMenuItems(menuItems, { categoryId: "cat-parrilla",    query: "" });
    const entradas    = filterMenuItems(menuItems, { categoryId: "cat-entradas",    query: "" });
    const tiramisú    = filterMenuItems(menuItems, { categoryId: "",                query: "tiramisú" });

    expect(principales.length).toBeGreaterThan(0);
    expect(parrilla.length).toBeGreaterThan(0);
    expect(entradas.length).toBeGreaterThan(0);
    expect(tiramisú).toHaveLength(1);
    // Cada ítem filtrado pertenece a la categoría correcta
    for (const item of principales) expect(item.category_id).toBe("cat-principales");
    for (const item of parrilla)    expect(item.category_id).toBe("cat-parrilla");
  });

  it("agrupa productos visibles por categoría", () => {
    // Tomamos un ítem de entradas y uno de bebidas para probar el agrupador
    const entrada = menuItems.find((i) => i.category_id === "cat-entradas")!;
    const bebida  = menuItems.find((i) => i.category_id === "cat-bebidas")!;
    const grouped = groupMenuItemsByCategory(menuCategories, [entrada, bebida]);

    const ids = grouped.map((c) => c.id);
    expect(ids).toContain("cat-entradas");
    expect(ids).toContain("cat-bebidas");
    // No debe incluir categorías sin ítems
    expect(ids).not.toContain("cat-principales");
    expect(grouped.find((c) => c.id === "cat-entradas")?.items).toHaveLength(1);
  });
});
