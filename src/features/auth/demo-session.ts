import { getRoleConfig, type RoleId } from "./roles";

export const DEMO_ROLE_COOKIE = "bistro_demo_role";

export function isRoleId(value: string): value is RoleId {
  return value in {
    owner: true,
    admin: true,
    manager: true,
    waiter: true,
    kitchen: true
  };
}

export function parseDemoRole(value: string | undefined): RoleId | null {
  if (!value) return null;
  return isRoleId(value) ? value : null;
}

export function getDemoRoleLabel(value: string | undefined): string | null {
  const roleId = parseDemoRole(value);
  return roleId ? getRoleConfig(roleId).label : null;
}
