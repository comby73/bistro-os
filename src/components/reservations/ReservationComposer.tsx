"use client";

import { useState } from "react";
import type { CreateReservationInput } from "@/features/reservations/types";

export function ReservationComposer({
  createReservation
}: {
  createReservation: (input: CreateReservationInput) => void;
}) {
  const [customerName, setCustomerName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [partySize, setPartySize] = useState("2");
  const [tableAssigned, setTableAssigned] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!customerName.trim() || !contactPhone.trim() || !date || !time) {
      setError("Completá nombre, contacto, fecha y hora.");
      return;
    }

    createReservation({
      customer_name: customerName,
      contact_phone: contactPhone,
      date,
      time,
      party_size: Number(partySize),
      table_assigned: tableAssigned,
      notes
    });

    setCustomerName("");
    setContactPhone("");
    setDate("");
    setTime("");
    setPartySize("2");
    setTableAssigned("");
    setNotes("");
    setError("");
  }

  return (
    <section className="card-premium p-6">
      <div className="mb-5">
        <p className="eyebrow mb-3">Nueva reserva</p>
        <h3 className="text-xl font-semibold">Cargar reserva</h3>
        <p className="mt-2 text-sm text-paper/55">
          Alta rápida para el turno actual o próximas mesas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-paper/45">Cliente</span>
            <input
              className="w-full rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-sm outline-none transition focus:border-gold/60"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Mariana López"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-paper/45">WhatsApp</span>
            <input
              className="w-full rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-sm outline-none transition focus:border-gold/60"
              value={contactPhone}
              onChange={(event) => setContactPhone(event.target.value)}
              placeholder="+54 9..."
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_1fr_120px]">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-paper/45">Fecha</span>
            <input
              className="w-full rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-sm outline-none transition focus:border-gold/60"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              type="date"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-paper/45">Hora</span>
            <input
              className="w-full rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-sm outline-none transition focus:border-gold/60"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              type="time"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-paper/45">Personas</span>
            <input
              className="w-full rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-sm outline-none transition focus:border-gold/60"
              value={partySize}
              onChange={(event) => setPartySize(event.target.value)}
              type="number"
              min="1"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-[180px_1fr]">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-paper/45">Mesa</span>
            <input
              className="w-full rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-sm outline-none transition focus:border-gold/60"
              value={tableAssigned}
              onChange={(event) => setTableAssigned(event.target.value)}
              placeholder="Mesa 6"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-paper/45">Notas</span>
            <textarea
              className="min-h-24 w-full rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-sm outline-none transition focus:border-gold/60"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Alergias, pedido especial, zona del salón"
            />
          </label>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <button type="submit" className="btn-gold w-full md:w-auto">
          Crear reserva
        </button>
      </form>
    </section>
  );
}
