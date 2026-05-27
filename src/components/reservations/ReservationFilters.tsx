"use client";

import type { ReservationFilter } from "@/features/reservations/types";
import { getReservationStatusLabel } from "@/features/reservations/calculations";

export function ReservationFilters({
  activeFilter,
  onChange,
  counts
}: {
  activeFilter: ReservationFilter;
  onChange: (value: ReservationFilter) => void;
  counts: Record<ReservationFilter, number>;
}) {
  const filterOptions: Array<{ value: ReservationFilter; label: string }> = [
    { value: "all", label: "Todas" },
    { value: "pending", label: getReservationStatusLabel("pending") },
    { value: "confirmed", label: getReservationStatusLabel("confirmed") },
    { value: "seated", label: getReservationStatusLabel("seated") },
    { value: "cancelled", label: getReservationStatusLabel("cancelled") },
    { value: "completed", label: getReservationStatusLabel("completed") }
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={
            activeFilter === option.value
              ? "rounded-full border border-gold/40 bg-gold/12 px-4 py-2 text-sm text-gold"
              : "rounded-full border border-line bg-layer1/55 px-4 py-2 text-sm text-paper/65 transition hover:border-gold/25 hover:text-paper"
          }
        >
          <span>{option.label}</span>
          <span className="ml-2 text-xs text-paper/45">{counts[option.value]}</span>
        </button>
      ))}
    </div>
  );
}
