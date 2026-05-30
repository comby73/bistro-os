"use client";

import { useState } from "react";
import { Loader2, Save, Archive } from "lucide-react";
import type { KitchenStation } from "@/features/kitchen/types";
import type { MenuCategory, MenuItem, MenuItemInput } from "@/features/menu/types";
import { MenuImageUploader } from "./MenuImageUploader";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const STATIONS: { value: KitchenStation; label: string }[] = [
  { value: "cold",  label: "Frío" },
  { value: "hot",   label: "Caliente" },
  { value: "grill", label: "Parrilla" },
  { value: "bar",   label: "Barra" },
  { value: "pass",  label: "Pase" }
];

const INPUT =
  "w-full rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-[15px] text-paper placeholder-paper/30 outline-none transition focus:border-gold/50 focus:bg-layer1";
const LABEL = "text-[12px] font-semibold uppercase tracking-[0.14em] text-paper/55";

export function MenuItemForm({
  item,
  categories,
  dataSource,
  pending,
  onSubmit,
  onArchive,
  onCancel
}: {
  item?: MenuItem;
  categories: MenuCategory[];
  dataSource: "local" | "supabase";
  pending: boolean;
  onSubmit: (input: MenuItemInput) => void;
  onArchive?: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [price, setPrice] = useState<string>(item ? String(item.price) : "");
  const [categoryId, setCategoryId] = useState(item?.category_id ?? categories[0]?.id ?? "");
  const [station, setStation] = useState<KitchenStation>(item?.station ?? "hot");
  const [available, setAvailable] = useState(item?.available ?? true);
  const [featured, setFeatured] = useState(item?.featured ?? false);
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? "");
  const [error, setError] = useState<string | null>(null);
  const [confirmArchive, setConfirmArchive] = useState(false);

  function submit() {
    if (!name.trim()) return setError("El nombre es obligatorio.");
    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum < 0) return setError("Precio inválido.");
    if (!categoryId) return setError("Elegí una categoría.");
    setError(null);
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      price: priceNum,
      category_id: categoryId,
      station,
      available,
      featured,
      image_url: imageUrl.trim() || undefined
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className={LABEL}>Nombre</label>
        <input className={INPUT} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Risotto de hongos" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={LABEL}>Descripción</label>
        <textarea className={`${INPUT} resize-none`} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción emotiva del plato" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className={LABEL}>Precio (USD)</label>
          <input className={INPUT} value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" placeholder="0" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={LABEL}>Estación</label>
          <select className={INPUT} value={station} onChange={(e) => setStation(e.target.value as KitchenStation)}>
            {STATIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={LABEL}>Categoría</label>
        <select className={INPUT} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <MenuImageUploader value={imageUrl} onChange={setImageUrl} itemId={item?.id} dataSource={dataSource} />

      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => setAvailable((v) => !v)}
          className={`rounded-2xl border px-4 py-3 text-[14px] font-medium transition ${available ? "border-gold/30 bg-gold/10 text-gold" : "border-line bg-ink/60 text-paper/60"}`}>
          {available ? "Disponible" : "No disponible"}
        </button>
        <button type="button" onClick={() => setFeatured((v) => !v)}
          className={`rounded-2xl border px-4 py-3 text-[14px] font-medium transition ${featured ? "border-gold/30 bg-gold/10 text-gold" : "border-line bg-ink/60 text-paper/60"}`}>
          {featured ? "Destacado" : "Sin destacar"}
        </button>
      </div>

      {error && <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[14px] text-red-400">{error}</p>}

      <div className="flex items-center gap-2 pt-2">
        <button type="button" onClick={submit} disabled={pending}
          className="btn-gold flex flex-1 items-center justify-center gap-2 py-3 text-[15px] disabled:opacity-50">
          {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {item ? "Guardar cambios" : "Crear producto"}
        </button>
        <button type="button" onClick={onCancel}
          className="rounded-2xl border border-line px-4 py-3 text-[14px] text-paper/60 transition hover:text-paper">
          Cancelar
        </button>
      </div>

      {item && onArchive && (
        <button type="button" onClick={() => setConfirmArchive(true)}
          className="flex items-center justify-center gap-2 rounded-2xl border border-line/60 py-2.5 text-[13px] text-paper/50 transition hover:border-red-500/40 hover:text-red-400">
          <Archive size={14} /> Dar de baja (baja lógica)
        </button>
      )}

      <ConfirmDialog
        open={confirmArchive}
        title="Dar de baja el producto"
        message={`¿Seguro que querés dar de baja "${item?.name ?? "este producto"}"? Dejará de verse en la carta y en los pedidos. No se borra: podés reactivarlo después.`}
        confirmLabel="Sí, dar de baja"
        tone="danger"
        pending={pending}
        onConfirm={() => { setConfirmArchive(false); onArchive?.(); }}
        onClose={() => setConfirmArchive(false)}
      />
    </div>
  );
}
