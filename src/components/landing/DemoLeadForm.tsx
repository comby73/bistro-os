"use client";

import { FormEvent, useState } from "react";
import { submitLead } from "@/features/leads/actions";
import type { PlanInterest } from "@/features/leads/types";

const initialState = {
  restaurant_name: "",
  owner_name: "",
  email: "",
  whatsapp: "",
  city: "",
  restaurant_type: "Restaurante de autor",
  number_of_tables: "20",
  plan_interest: "Pro" as PlanInterest,
  message: ""
};

export function DemoLeadForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrors({});
    setMessage("");

    const result = await submitLead(form);

    if (!result.ok) {
      setStatus("error");
      setMessage(result.message);
      setErrors(result.fieldErrors ?? {});
      return;
    }

    setStatus("success");
    setMessage(result.message);
  }

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <form onSubmit={onSubmit} className="card-premium space-y-5 p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Restaurante"
          name="restaurant_name"
          value={form.restaurant_name}
          error={errors.restaurant_name?.[0]}
          onChange={updateField}
        />
        <Field
          label="Responsable"
          name="owner_name"
          value={form.owner_name}
          error={errors.owner_name?.[0]}
          onChange={updateField}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          value={form.email}
          error={errors.email?.[0]}
          onChange={updateField}
        />
        <Field
          label="WhatsApp"
          name="whatsapp"
          value={form.whatsapp}
          error={errors.whatsapp?.[0]}
          onChange={updateField}
        />
        <Field
          label="Ciudad"
          name="city"
          value={form.city}
          error={errors.city?.[0]}
          onChange={updateField}
        />
        <Field
          label="Cantidad de mesas"
          name="number_of_tables"
          type="number"
          value={form.number_of_tables}
          error={errors.number_of_tables?.[0]}
          onChange={updateField}
        />
      </div>

      <label className="block">
        <span className="mb-2 block text-xs text-paper/70">Tipo de restaurante</span>
        <select
          className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm outline-none transition focus:border-gold/70"
          value={form.restaurant_type}
          onChange={(event) => updateField("restaurant_type", event.target.value)}
        >
          <option>Restaurante de autor</option>
          <option>Bistró</option>
          <option>Parrilla premium</option>
          <option>Cocina internacional</option>
          <option>Grupo gastronómico</option>
        </select>
        {errors.restaurant_type?.[0] && <p className="mt-2 text-xs text-red-300">{errors.restaurant_type[0]}</p>}
      </label>

      <label className="block">
        <span className="mb-2 block text-xs text-paper/70">Plan de interés</span>
        <select
          className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm outline-none transition focus:border-gold/70"
          value={form.plan_interest}
          onChange={(event) => updateField("plan_interest", event.target.value)}
        >
          <option>Starter</option>
          <option>Pro</option>
          <option>Enterprise</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-2 block text-xs text-paper/70">Mensaje</span>
        <textarea
          className="min-h-28 w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm outline-none transition focus:border-gold/70"
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="Contanos qué problema operativo querés resolver."
        />
        {errors.message?.[0] && <p className="mt-2 text-xs text-red-300">{errors.message[0]}</p>}
      </label>

      {message && (
        <div className={status === "success" ? "rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm text-gold" : "rounded-xl border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-200"}>
          {message}
        </div>
      )}

      <button disabled={status === "submitting"} className="btn-gold w-full disabled:opacity-60">
        {status === "submitting" ? "Enviando..." : "Solicitar demo"}
      </button>
    </form>
  );
}

type FieldName = keyof typeof initialState;

function Field({
  label,
  name,
  value,
  error,
  type = "text",
  onChange
}: {
  label: string;
  name: FieldName;
  value: string;
  error?: string;
  type?: string;
  onChange: (name: FieldName, value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs text-paper/70">{label}</span>
      <input
        className="w-full rounded-xl border border-line bg-ink px-4 py-3 text-sm outline-none transition focus:border-gold/70"
        name={name}
        value={value}
        type={type}
        onChange={(event) => onChange(name, event.target.value)}
      />
      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
    </label>
  );
}
