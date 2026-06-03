"use client";

import { useEffect } from "react";
import type { RoleId } from "@/features/auth/roles";
import type { MenuCatalog } from "@/features/menu/types";
import type { Order } from "@/features/orders/types";
import { hydrateFromSupabase } from "@/features/orders/demo-store";
import { OrderComposer } from "./OrderComposer";
import { OrdersManagementBoard } from "./OrdersManagementBoard";

interface Props {
  roleId: RoleId;
  roleLabel: string;
  initialMenuCatalog?: MenuCatalog;
  restaurantId?: string;
  branchId?: string | null;
  /** Pedidos del día leídos de Supabase (server-side). Se usan para hidratar
   *  localStorage si está vacío — por ejemplo al entrar desde otro dispositivo. */
  supabaseOrders?: Order[];
}

export function OrdersWorkspace({
  roleId,
  roleLabel,
  initialMenuCatalog,
  restaurantId,
  branchId,
  supabaseOrders = [],
}: Props) {
  const canCreate =
    roleId === "owner" ||
    roleId === "admin" ||
    roleId === "manager" ||
    roleId === "waiter";

  // Hidratar localStorage desde Supabase solo si está vacío.
  // Esto permite que el primer acceso desde un device nuevo cargue
  // los pedidos del día en vez de los seeds demo.
  useEffect(() => {
    if (restaurantId && supabaseOrders.length > 0) {
      hydrateFromSupabase(restaurantId, supabaseOrders);
    }
  }, [restaurantId, supabaseOrders]);

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
