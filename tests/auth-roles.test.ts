import { describe, expect, it } from "vitest";
import {
  getDefaultRouteForRole,
  isRouteAllowed,
  roleConfigs
} from "../src/features/auth/roles";

describe("role configs", () => {
  it("define la ruta inicial esperada por rol", () => {
    expect(getDefaultRouteForRole("owner")).toBe("/dashboard");
    expect(getDefaultRouteForRole("admin")).toBe("/dashboard");
    expect(getDefaultRouteForRole("manager")).toBe("/dashboard");
    expect(getDefaultRouteForRole("waiter")).toBe("/orders");
    expect(getDefaultRouteForRole("kitchen")).toBe("/kitchen");
  });

  it("restringe las rutas sensibles por rol", () => {
    expect(isRouteAllowed("owner", "/sales")).toBe(true);
    expect(isRouteAllowed("admin", "/sales")).toBe(true);
    expect(isRouteAllowed("manager", "/sales")).toBe(true);
    expect(isRouteAllowed("manager", "/menu")).toBe(true);
    expect(isRouteAllowed("waiter", "/orders")).toBe(true);
    expect(isRouteAllowed("waiter", "/menu")).toBe(true);
    expect(isRouteAllowed("waiter", "/sales")).toBe(false);
    expect(isRouteAllowed("waiter", "/reservations")).toBe(false);
    expect(isRouteAllowed("kitchen", "/kitchen")).toBe(true);
    expect(isRouteAllowed("kitchen", "/sales")).toBe(false);
    expect(isRouteAllowed("kitchen", "/orders")).toBe(false);
  });

  it("mantiene navegación visible alineada con cada perfil", () => {
    expect(roleConfigs.owner.navigation).toHaveLength(6);
    expect(roleConfigs.manager.navigation.map((item) => item.href)).toEqual([
      "/dashboard",
      "/sales",
      "/reservations",
      "/orders",
      "/menu"
    ]);
    expect(roleConfigs.waiter.navigation.map((item) => item.href)).toEqual([
      "/orders",
      "/menu"
    ]);
  });
});
