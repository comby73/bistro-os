import { describe, expect, it } from "vitest";
import {
  getLocalMenuCatalogResult,
  resolveMenuDataSource
} from "../src/features/menu/repository";
import { menuCategories } from "../src/features/menu/mock-data";

describe("menu repository", () => {
  it("mantiene fallback local cuando faltan variables de Supabase", () => {
    expect(
      resolveMenuDataSource({
        NEXT_PUBLIC_SUPABASE_URL: "",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
        SUPABASE_SERVICE_ROLE_KEY: ""
      })
    ).toBe("local");
  });

  it("solo activa modo supabase cuando la configuración está completa", () => {
    expect(
      resolveMenuDataSource({
        NEXT_PUBLIC_SUPABASE_URL: "https://demo.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
        SUPABASE_SERVICE_ROLE_KEY: ""
      })
    ).toBe("local");

    expect(
      resolveMenuDataSource({
        NEXT_PUBLIC_SUPABASE_URL: "https://demo.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
        SUPABASE_SERVICE_ROLE_KEY: "service"
      })
    ).toBe("supabase");
  });

  it("expone un catálogo local utilizable sin credenciales", () => {
    const catalog = getLocalMenuCatalogResult();

    expect(catalog.dataSource).toBe("local");
    // El número de categorías refleja el catálogo real — no hardcodeado
    expect(catalog.categories).toHaveLength(menuCategories.length);
    expect(catalog.categories.length).toBeGreaterThan(0);
    expect(catalog.items.every((item) => typeof item.station === "string")).toBe(true);
    expect(catalog.items.length).toBeGreaterThan(0);
  });
});
