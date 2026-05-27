"use client";

import type { RoleId } from "@/features/auth/roles";
import { OrderComposer } from "./OrderComposer";
import { OrdersManagementBoard } from "./OrdersManagementBoard";

export function OrdersWorkspace({
  roleId,
  roleLabel
}: {
  roleId: RoleId;
  roleLabel: string;
}) {
  const canCreate = roleId === "waiter";

  if (canCreate) {
    return <OrderComposer defaultWaiterName={roleLabel} />;
  }

  return <OrdersManagementBoard />;
}
