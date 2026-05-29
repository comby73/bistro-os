"use client";

import type { RoleId } from "@/features/auth/roles";
import type { MenuCatalog } from "@/features/menu/types";
import { OrderComposer } from "./OrderComposer";
import { OrdersManagementBoard } from "./OrdersManagementBoard";

export function OrdersWorkspace({
  roleId,
  roleLabel,
  initialMenuCatalog,
  restaurantId
}: {
  roleId: RoleId;
  roleLabel: string;
  initialMenuCatalog?: MenuCatalog;
  restaurantId?: string;
}) {
  const canCreate = roleId === "waiter";

  if (canCreate) {
    return (
      <OrderComposer
        defaultWaiterName={roleLabel}
        initialMenuCatalog={initialMenuCatalog}
        restaurantId={restaurantId}
      />
    );
  }

  return <OrdersManagementBoard restaurantId={restaurantId} />;
}
