"use client";

import { useState, useTransition } from "react";
import { crearReserva } from "./actions";

interface RestaurantInfo {
  name: string;
  description: string;
  brand_color: string;
  slug: string;
  restaurant_id: string;
  branch_id: string;
}

interface Props {
  restaurant: RestaurantInfo;
}

type FormState = "idle" | "submitting" | "success" | "error";

export function ReservaForm({ restaurant }: Props) {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const color = restaurant.brand_color;
  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setState("submitting");
    setErrorMsg("");

    startTransition(async () => {
      const result = await crearReserva({
        restaurant_id: restaurant.restaurant_id,
        branch_id: restaurant.branch_id,
        customer_name: data.get("customer_name") as string,
        customer_contact: data.get("customer_contact") as string,
        reservation_date: data.get("reservation_date") as string,
        reservation_time: data.get("reservation_time") as string,
        party_size: parseInt(data.get("party_size") as string, 10),
        notes: (data.get("notes") as string) || undefined,
      });

      if (result.ok) {
        setState("success");
        form.reset();
      } else {
        setState("error");
        setErrorMsg(result.error ?? "Error al enviar. Intenta de nuevo.");
      }
    });
  }

  if (state === "success") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto text-4xl"
            style={{ backgroundColor: color + "22", border: `2px solid ${color}` }}
          >
            ✓
          </div>
          <h2 className="text-2xl font-bold text-white">
            ¡Reserva recibida!
          </h2>
          <p className="text-zinc-400 text-lg">
            Te contactaremos para confirmar tu reserva en{" "}
            <span style={{ color }} className="font-semibold">
              {restaurant.name}
            </span>
            .
          </p>
          <p className="text-zinc-500 text-sm">
            Por favor, revisá tu teléfono. El equipo del restaurante se va a comunicar
            pronto para confirmar fecha, hora y mesa.
          </p>
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => setState("idle")}
              className="w-full py-3 rounded-xl font-semibold text-black transition-opacity hover:opacity-90"
              style={{ backgroundColor: color }}
            >
              Hacer otra reserva
            </button>
            <a
              href={`/carta/${restaurant.slug}`}
              className="w-full py-3 rounded-xl font-semibold text-center border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors block"
            >
              Ver la carta
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header
        className="py-8 px-4 text-center"
        style={{ borderBottom: `1px solid ${color}33` }}
      >
        <div
          className="inline-block w-3 h-3 rounded-full mb-4"
          style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}88` }}
        />
        <h1 className="text-2xl font-bold text-white">{restaurant.name}</h1>
        <p className="text-zinc-400 text-sm mt-1">{restaurant.description}</p>
      </header>

      {/* Form */}
      <main className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <h2 className="text-xl font-semibold text-white mb-6">
            Reservá tu mesa
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1" htmlFor="customer_name">
                Nombre completo *
              </label>
              <input
                id="customer_name"
                name="customer_name"
                type="text"
                required
                placeholder="Ej: María González"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 transition-all"
                style={{ focusRingColor: color } as React.CSSProperties}
                onFocus={(e) => (e.currentTarget.style.borderColor = color)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "")}
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1" htmlFor="customer_contact">
                Teléfono de contacto *
              </label>
              <input
                id="customer_contact"
                name="customer_contact"
                type="tel"
                required
                placeholder="Ej: 11 5555 1234"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 transition-all"
                onFocus={(e) => (e.currentTarget.style.borderColor = color)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "")}
              />
            </div>

            {/* Fecha y hora */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-zinc-400 mb-1" htmlFor="reservation_date">
                  Fecha *
                </label>
                <input
                  id="reservation_date"
                  name="reservation_date"
                  type="date"
                  required
                  min={today}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                  onFocus={(e) => (e.currentTarget.style.borderColor = color)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1" htmlFor="reservation_time">
                  Hora *
                </label>
                <input
                  id="reservation_time"
                  name="reservation_time"
                  type="time"
                  required
                  defaultValue="20:00"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                  onFocus={(e) => (e.currentTarget.style.borderColor = color)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                />
              </div>
            </div>

            {/* Personas */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1" htmlFor="party_size">
                Cantidad de personas *
              </label>
              <select
                id="party_size"
                name="party_size"
                required
                defaultValue="2"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                onFocus={(e) => (e.currentTarget.style.borderColor = color)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "")}
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "persona" : "personas"}
                  </option>
                ))}
              </select>
            </div>

            {/* Comentarios */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1" htmlFor="notes">
                Comentarios (opcional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Ej: cumpleaños, alergias, mesa exterior..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none resize-none transition-all"
                onFocus={(e) => (e.currentTarget.style.borderColor = color)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "")}
              />
            </div>

            {/* Error */}
            {state === "error" && (
              <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-300 text-sm">
                {errorMsg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending || state === "submitting"}
              className="w-full py-4 rounded-xl font-bold text-black text-base transition-opacity disabled:opacity-60 mt-2"
              style={{ backgroundColor: color }}
            >
              {isPending || state === "submitting"
                ? "Enviando reserva..."
                : "Confirmar reserva"}
            </button>

            <p className="text-center text-zinc-600 text-xs pt-1">
              El restaurante confirmará tu reserva por teléfono.
            </p>
          </form>

          {/* Link a la carta */}
          <div
            className="mt-8 pt-6 text-center"
            style={{ borderTop: `1px solid ${color}22` }}
          >
            <a
              href={`/carta/${restaurant.slug}`}
              className="text-sm transition-colors"
              style={{ color: color + "bb" }}
            >
              Ver la carta de {restaurant.name} →
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-zinc-700 text-xs">
        Reservas gestionadas por{" "}
        <span className="text-zinc-500">Bistró OS</span>
      </footer>
    </div>
  );
}
