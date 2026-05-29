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
    // Usa un ítem del catálogo real (risotto de hongos patagónicos)
    const order = buildOrderFromInput({
      table: "Mesa 9",
      waiter_name: "Mozo",
      notes: "Sin sal",
      items: [{ menu_item_id: "item-pri-1", quantity: 2 }]
    });

    expect(order.status).toBe("received");
    expect(order.items[0]).toMatchObject({
      menu_item_id: "item-pri-1",
      name: "Risotto de hongos patagónicos",
      quantity: 2,
      station: "hot",
      unit_price: 26
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
          restaurant_id: "rest-bistro",
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

  it("calcula transiciones de estado y agrupación por estado", () => {
    expect(getNextOrderStatus("received")).toBe("preparing");
    expect(getNextOrderStatus("preparing")).toBe("ready");
    expect(getNextOrderStatus("ready")).toBe("delivered");
    expect(getNextOrderStatus("delivered")).toBeNull();

    // groupOrdersByStatus solo agrupa received | preparing | ready (sin delivered)
    const grouped = groupOrdersByStatus(orders);
    expect(grouped.received).toHaveLength(1);
    expect(grouped.preparing).toHaveLength(1);
    expect(grouped.ready).toHaveLength(0);
  });

  it("totaliza el pedido según cantidad y precio unitario", () => {
    // ORD-1042: burrata(22×1) + risotto(26×2) + limonada(8×2) = 22+52+16 = 90
    expect(getOrderTotal(orders[0])).toBe(90);
    // ORD-1043: ojo de bife(42×2) + entraña(34×1) + mocktail(10×2) = 84+34+20 = 138
    expect(getOrderTotal(orders[1])).toBe(138);
    // ORD-1044: croquetas(19×2) + salmón(32×1) + tiramisú(14×2) + espresso(5×2) = 38+32+28+10 = 108
    expect(getOrderTotal(orders[2])).toBe(108);
  });
});
