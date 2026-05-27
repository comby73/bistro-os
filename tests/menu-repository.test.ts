import { describe, expect, it } from "vitest";
import {
  getLocalMenuCatalogResult,
  resolveMenuDataSource
} from "../src/features/menu/repository";

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
    expect(catalog.categories).toHaveLength(3);
    expect(catalog.items.every((item) => typeof item.station === "string")).toBe(true);
  });
});
