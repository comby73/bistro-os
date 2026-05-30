import { describe, expect, it } from "vitest";
import {
  applyArchiveItem,
  applyCreateItem,
  applyUpdateItem,
  visibleItems
} from "../src/features/menu/demo-store";
import { buildOrderFromInput } from "../src/features/orders/calculations";
import type { MenuCatalog, MenuItemInput } from "../src/features/menu/types";

const RID = "00000000-0000-0000-0000-000000000001";

function baseCatalog(): MenuCatalog {
  return {
    categories: [{ id: "cat-entradas", name: "Entradas", position: 1 }],
    items: [
      {
        id: "item-existente",
        restaurant_id: RID,
        category_id: "cat-entradas",
        name: "Burrata",
        description: "Cremosa",
        price: 22,
        station: "cold",
        available: true,
        featured: true,
        status: "active"
      }
    ]
  };
}

const newInput: MenuItemInput = {
  name: "Provoleta",
  description: "Fundida a la parrilla",
  price: 17,
  category_id: "cat-entradas",
  station: "grill",
  available: true,
  featured: false
};

describe("gestión de carta — fallback local", () => {
  it("crea un producto nuevo en el catálogo", () => {
    const next = applyCreateItem(baseCatalog(), newInput, RID, "item-nuevo");
    const created = next.items.find((i) => i.id === "item-nuevo");

    expect(next.items).toHaveLength(2);
    expect(created).toMatchObject({
      name: "Provoleta",
      price: 17,
      restaurant_id: RID,
      category_id: "cat-entradas",
      station: "grill",
      status: "active"
    });
  });

  it("edita nombre, precio y categoría de un producto existente", () => {
    const next = applyUpdateItem(baseCatalog(), "item-existente", {
      name: "Burrata premium",
      price: 26,
      category_id: "cat-entradas"
    });
    const edited = next.items.find((i) => i.id === "item-existente");

    expect(edited?.name).toBe("Burrata premium");
    expect(edited?.price).toBe(26);
  });

  it("baja lógica: archivar marca status='archived' y available=false (no borra)", () => {
    const next = applyArchiveItem(baseCatalog(), "item-existente");
    const archived = next.items.find((i) => i.id === "item-existente");

    expect(next.items).toHaveLength(1); // sigue existiendo físicamente
    expect(archived?.status).toBe("archived");
    expect(archived?.available).toBe(false);
  });

  it("un producto archivado NO aparece en la carta pública (visibleItems lo oculta)", () => {
    const archivedCatalog = applyArchiveItem(baseCatalog(), "item-existente");
    expect(visibleItems(archivedCatalog.items)).toHaveLength(0);
  });

  it("available=false NO oculta el producto (sigue visible como no disponible)", () => {
    const next = applyUpdateItem(baseCatalog(), "item-existente", { available: false });
    const visible = visibleItems(next.items);

    expect(visible).toHaveLength(1);
    expect(visible[0].available).toBe(false);
    expect(visible[0].status).toBe("active");
  });

  it("no permite IDs duplicados al crear (usa el id provisto)", () => {
    let catalog = baseCatalog();
    catalog = applyCreateItem(catalog, newInput, RID, "item-a");
    catalog = applyCreateItem(catalog, { ...newInput, name: "Otro" }, RID, "item-b");
    const ids = catalog.items.map((i) => i.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain("item-a");
    expect(ids).toContain("item-b");
  });

  it("/orders usa el catálogo actualizado: un producto recién creado es ordenable", () => {
    const catalog = applyCreateItem(baseCatalog(), newInput, RID, "item-nuevo");

    const order = buildOrderFromInput(
      { table: "Mesa 1", waiter_name: "Mozo", items: [{ menu_item_id: "item-nuevo", quantity: 2 }] },
      catalog.items
    );

    expect(order.items[0]).toMatchObject({
      menu_item_id: "item-nuevo",
      name: "Provoleta",
      station: "grill",
      unit_price: 17,
      quantity: 2
    });
  });
});
