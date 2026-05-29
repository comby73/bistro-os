export type AppRoute = "/dashboard" | "/orders" | "/reservations" | "/kitchen" | "/menu" | "/sales" | "/users" | "/branches";

export type RoleId = "owner" | "admin" | "manager" | "waiter" | "kitchen";

export interface NavigationItem {
  href: AppRoute;
  label: string;
}

export interface RoleConfig {
  id: RoleId;
  label: string;
  description: string;
  allowedRoutes: AppRoute[];
  navigation: NavigationItem[];
}

const DASHBOARD_NAV: NavigationItem = { href: "/dashboard", label: "Dashboard" };
const USERS_NAV:    NavigationItem = { href: "/users",    label: "Usuarios" };
const BRANCHES_NAV: NavigationItem = { href: "/branches", label: "Sucursales" };
const ORDERS_NAV: NavigationItem = { href: "/orders", label: "Pedidos" };
const RESERVATIONS_NAV: NavigationItem = { href: "/reservations", label: "Reservas" };
const KITCHEN_NAV: NavigationItem = { href: "/kitchen", label: "Cocina" };
const MENU_NAV: NavigationItem = { href: "/menu", label: "Menú" };
const SALES_NAV: NavigationItem = { href: "/sales", label: "Ventas y caja" };

export const roleConfigs: Record<RoleId, RoleConfig> = {
  owner: {
    id: "owner",
    label: "Dueño",
    description: "Visión global del negocio, ventas, operación y configuración del servicio.",
    allowedRoutes: ["/dashboard", "/sales", "/orders", "/reservations", "/kitchen", "/menu", "/users", "/branches"],
    navigation: [DASHBOARD_NAV, SALES_NAV, ORDERS_NAV, RESERVATIONS_NAV, KITCHEN_NAV, MENU_NAV, USERS_NAV, BRANCHES_NAV]
  },
  admin: {
    id: "admin",
    label: "Administrador",
    description: "Coordina la operación diaria y supervisa todos los módulos internos.",
    allowedRoutes: ["/dashboard", "/sales", "/orders", "/reservations", "/kitchen", "/menu"],
    navigation: [DASHBOARD_NAV, SALES_NAV, ORDERS_NAV, RESERVATIONS_NAV, KITCHEN_NAV, MENU_NAV]
  },
  manager: {
    id: "manager",
    label: "Jefe de sala",
    description: "Controla el servicio, el ritmo del salón y la gestión de reservas.",
    allowedRoutes: ["/dashboard", "/sales", "/reservations", "/orders", "/menu"],
    navigation: [DASHBOARD_NAV, SALES_NAV, RESERVATIONS_NAV, ORDERS_NAV, MENU_NAV]
  },
  waiter: {
    id: "waiter",
    label: "Mozo",
    description: "Opera pedidos en mesa y consulta el menú disponible durante el servicio.",
    allowedRoutes: ["/orders", "/menu", "/dashboard"],
    navigation: [ORDERS_NAV, MENU_NAV]
  },
  kitchen: {
    id: "kitchen",
    label: "Cocina",
    description: "Se concentra en tickets KDS, tiempos y flujo entre estaciones.",
    allowedRoutes: ["/kitchen", "/dashboard"],
    navigation: [KITCHEN_NAV]
  }
};

export const roleList = Object.values(roleConfigs);

export function getRoleConfig(roleId: RoleId): RoleConfig {
  return roleConfigs[roleId];
}

export function getDefaultRouteForRole(roleId: RoleId): AppRoute {
  return roleConfigs[roleId].allowedRoutes[0];
}

export function isRouteAllowed(roleId: RoleId, route: AppRoute): boolean {
  return roleConfigs[roleId].allowedRoutes.includes(route);
}

export function isValidRoleId(value: string): value is RoleId {
  return value in roleConfigs;
}
