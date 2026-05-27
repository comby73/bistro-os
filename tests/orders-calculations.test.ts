import { describe, expect, it } from "vitest";
import {
  buildOrderFromInput,
  getNextOrderStatus,
  getOrderTotal,
  groupOrdersByStatus
} from "../src/features/orders/calculations";
import { orders } from "../src/features/orders/mock-data";

describe("orders calculations", () => {
  it("crea un pedido nuevo en estado received con estaciones del menú", () => {
    const order = buildOrderFromInput({
      table: "Mesa 9",
      waiter_name: "Mozo",
      notes: "Sin sal",
      items: [{ menu_item_id: "item-2", quantity: 2 }]
    });

    expect(order.status).toBe("received");
    expect(order.items[0]).toMatchObject({
      menu_item_id: "item-2",
      name: "Risotto de hongos",
      quantity: 2,
      station: "hot",
      unit_price: 24
    });
  });

  it("respeta la estación del catálogo recibido sin depender de ids hardcodeados", () => {
    const order = buildOrderFromInput(
      {
        table: "Mesa 4",
        waiter_name: "Mozo",
        items: [{ menu_item_id: "remote-item", quantity: 1 }]
      },
      [
        {
          id: "remote-item",
          category_id: "remote-cat",
          name: "Spritz especial",
          description: "Cítrico",
          price: 18,
          station: "bar",
          available: true,
          featured: false
        }
      ]
    );

    expect(order.items[0]?.station).toBe("bar");
  });

  it("calcula transiciones de estado y agrupación de cocina", () => {
    expect(getNextOrderStatus("received")).toBe("preparing");
    expect(getNextOrderStatus("preparing")).toBe("ready");
    expect(getNextOrderStatus("ready")).toBe("delivered");
    expect(getNextOrderStatus("delivered")).toBeNull();

    const grouped = groupOrdersByStatus(orders);
    expect(grouped.received).toHaveLength(1);
    expect(grouped.preparing).toHaveLength(1);
    expect(grouped.ready).toHaveLength(0);
  });

  it("totaliza el pedido según cantidad y precio unitario", () => {
    expect(getOrderTotal(orders[0])).toBe(80);
    expect(getOrderTotal(orders[1])).toBe(100);
  });
});
