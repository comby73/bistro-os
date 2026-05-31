"use client";

import type { RoleId } from "@/features/auth/roles";
import type { MenuCatalog } from "@/features/menu/types";
import { OrderComposer } from "./OrderComposer";
import { OrdersManagementBoard } from "./OrdersManagementBoard";

export function OrdersWorkspace({
  roleId,
  roleLabel,
  initialMenuCatalog,
  restaurantId,
  branchId
}: {
  roleId: RoleId;
  roleLabel: string;
  initialMenuCatalog?: MenuCatalog;
  restaurantId?: string;
  branchId?: string | null;
}) {
  const canCreate = roleId === "owner" || roleId === "admin" || roleId === "manager" || roleId === "waiter";

  return (
    <div className="grid gap-8 2xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
      {canCreate && (
        <OrderComposer
          defaultWaiterName={roleLabel}
          initialMenuCatalog={initialMenuCatalog}
          restaurantId={restaurantId}
          branchId={branchId}
        />
      )}
      <OrdersManagementBoard restaurantId={restaurantId} />
    </div>
  );
}
