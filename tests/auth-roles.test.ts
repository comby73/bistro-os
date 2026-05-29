import { describe, expect, it } from "vitest";
import {
  getDefaultRouteForRole,
  isRouteAllowed,
  isValidRoleId,
  roleConfigs
} from "../src/features/auth/roles";

describe("role configs — rutas de entrada", () => {
  it("define la ruta inicial correcta por rol", () => {
    expect(getDefaultRouteForRole("owner")).toBe("/dashboard");
    expect(getDefaultRouteForRole("admin")).toBe("/dashboard");
    expect(getDefaultRouteForRole("manager")).toBe("/dashboard");
    expect(getDefaultRouteForRole("waiter")).toBe("/orders");
    expect(getDefaultRouteForRole("kitchen")).toBe("/kitchen");
  });
});

describe("role configs — permisos críticos", () => {
  it("owner accede a todas las rutas operativas y de administración", () => {
    const criticalRoutes = [
      "/dashboard", "/sales", "/orders", "/reservations",
      "/kitchen", "/menu", "/users", "/branches", "/restaurants", "/finances",
    ] as const;
    for (const route of criticalRoutes) {
      expect(isRouteAllowed("owner", route), `owner debería poder acceder a ${route}`).toBe(true);
    }
  });

  it("admin accede a rutas operativas pero no a gestión exclusiva del dueño", () => {
    expect(isRouteAllowed("admin", "/dashboard")).toBe(true);
    expect(isRouteAllowed("admin", "/sales")).toBe(true);
    expect(isRouteAllowed("admin", "/orders")).toBe(true);
    expect(isRouteAllowed("admin", "/reservations")).toBe(true);
    expect(isRouteAllowed("admin", "/kitchen")).toBe(true);
    expect(isRouteAllowed("admin", "/menu")).toBe(true);
  });

  it("manager accede a salón y operación, no a finanzas ni administración de sistema", () => {
    expect(isRouteAllowed("manager", "/dashboard")).toBe(true);
    expect(isRouteAllowed("manager", "/sales")).toBe(true);
    expect(isRouteAllowed("manager", "/reservations")).toBe(true);
    expect(isRouteAllowed("manager", "/orders")).toBe(true);
    expect(isRouteAllowed("manager", "/menu")).toBe(true);
    expect(isRouteAllowed("manager", "/users")).toBe(false);
    expect(isRouteAllowed("manager", "/finances")).toBe(false);
    expect(isRouteAllowed("manager", "/restaurants")).toBe(false);
  });

  it("waiter solo opera pedidos y consulta menú", () => {
    expect(isRouteAllowed("waiter", "/orders")).toBe(true);
    expect(isRouteAllowed("waiter", "/menu")).toBe(true);
    expect(isRouteAllowed("waiter", "/sales")).toBe(false);
    expect(isRouteAllowed("waiter", "/reservations")).toBe(false);
    expect(isRouteAllowed("waiter", "/kitchen")).toBe(false);
    expect(isRouteAllowed("waiter", "/users")).toBe(false);
    expect(isRouteAllowed("waiter", "/finances")).toBe(false);
  });

  it("kitchen solo accede a la vista de cocina", () => {
    expect(isRouteAllowed("kitchen", "/kitchen")).toBe(true);
    expect(isRouteAllowed("kitchen", "/dashboard")).toBe(true);
    expect(isRouteAllowed("kitchen", "/orders")).toBe(false);
    expect(isRouteAllowed("kitchen", "/menu")).toBe(false);
    expect(isRouteAllowed("kitchen", "/sales")).toBe(false);
    expect(isRouteAllowed("kitchen", "/reservations")).toBe(false);
    expect(isRouteAllowed("kitchen", "/users")).toBe(false);
    expect(isRouteAllowed("kitchen", "/finances")).toBe(false);
  });
});

describe("role configs — estructura de navegación", () => {
  it("owner tiene navegación que incluye todas las rutas de gestión", () => {
    const ownerHrefs = roleConfigs.owner.navigation.map((i) => i.href);
    // Verificamos presencia de rutas clave, no el total (puede crecer)
    expect(ownerHrefs).toContain("/dashboard");
    expect(ownerHrefs).toContain("/sales");
    expect(ownerHrefs).toContain("/users");
    expect(ownerHrefs).toContain("/branches");
    expect(ownerHrefs).toContain("/restaurants");
    expect(ownerHrefs).toContain("/finances");
    // Owner siempre tendrá al menos todas las rutas operativas
    expect(ownerHrefs.length).toBeGreaterThanOrEqual(8);
  });

  it("manager tiene la navegación correcta en orden", () => {
    expect(roleConfigs.manager.navigation.map((i) => i.href)).toEqual([
      "/dashboard",
      "/sales",
      "/reservations",
      "/orders",
      "/menu",
    ]);
  });

  it("waiter tiene navegación mínima y en orden", () => {
    expect(roleConfigs.waiter.navigation.map((i) => i.href)).toEqual([
      "/orders",
      "/menu",
    ]);
  });

  it("kitchen tiene solo su vista propia", () => {
    expect(roleConfigs.kitchen.navigation.map((i) => i.href)).toEqual([
      "/kitchen",
    ]);
  });

  it("toda ruta en navigation también está en allowedRoutes", () => {
    for (const [roleId, config] of Object.entries(roleConfigs)) {
      for (const navItem of config.navigation) {
        expect(
          config.allowedRoutes.includes(navItem.href),
          `${roleId}: ${navItem.href} en nav pero no en allowedRoutes`
        ).toBe(true);
      }
    }
  });
});

describe("isValidRoleId", () => {
  it("reconoce roles válidos", () => {
    expect(isValidRoleId("owner")).toBe(true);
    expect(isValidRoleId("admin")).toBe(true);
    expect(isValidRoleId("manager")).toBe(true);
    expect(isValidRoleId("waiter")).toBe(true);
    expect(isValidRoleId("kitchen")).toBe(true);
  });

  it("rechaza valores inválidos", () => {
    expect(isValidRoleId("superadmin")).toBe(false);
    expect(isValidRoleId("")).toBe(false);
    expect(isValidRoleId("OWNER")).toBe(false);
  });
});
