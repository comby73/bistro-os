"use client";

import type { RoleId } from "@/features/auth/roles";
import type { MenuCatalog } from "@/features/menu/types";
import { OrderComposer } from "./OrderComposer";
import { OrdersManagementBoard } from "./OrdersManagementBoard";

export function OrdersWorkspace({
  roleId,
  roleLabel,
  initialMenuCatalog
}: {
  roleId: RoleId;
  roleLabel: string;
  initialMenuCatalog?: MenuCatalog;
}) {
  const canCreate = roleId === "waiter";

  if (canCreate) {
    return <OrderComposer defaultWaiterName={roleLabel} initialMenuCatalog={initialMenuCatalog} />;
  }

  return <OrdersManagementBoard />;
}
