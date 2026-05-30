"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { MenuCategory, MenuItem, MenuItemInput } from "@/features/menu/types";
import { MenuItemForm } from "./MenuItemForm";

// Drawer lateral para crear / editar un producto de la carta.
export function MenuItemEditor({
  open,
  item,
  categories,
  dataSource,
  pending,
  onSubmit,
  onArchive,
  onClose
}: {
  open: boolean;
  item?: MenuItem;
  categories: MenuCategory[];
  dataSource: "local" | "supabase";
  pending: boolean;
  onSubmit: (input: MenuItemInput) => void;
  onArchive?: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* backdrop */}
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={onClose} />

      {/* panel */}
      <aside className="relative h-full w-full max-w-md overflow-y-auto border-l border-line bg-layer1 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-layer1/95 px-6 py-5 backdrop-blur">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold/70">
              {item ? "Editar producto" : "Nuevo producto"}
            </p>
            <h2 className="mt-1 text-[20px] font-bold text-paper">
              {item ? item.name : "Agregar a la carta"}
            </h2>
          </div>
          <button onClick={onClose} className="rounded-full border border-line p-2 text-paper/60 transition hover:text-paper">
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          <MenuItemForm
            item={item}
            categories={categories}
            dataSource={dataSource}
            pending={pending}
            onSubmit={onSubmit}
            onArchive={onArchive}
            onCancel={onClose}
          />
        </div>
      </aside>
    </div>
  );
}
