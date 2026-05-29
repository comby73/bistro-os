"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/features/auth/login-action";

const initialState: LoginState = {};

const DEMO_RESTAURANTS = [
  {
    name: "Bistró Palermo",
    color: "#E8B863",
    users: [
      { email: "owner@bistro-os.com",   label: "Dueño" },
      { email: "admin@bistro-os.com",   label: "Administrador" },
      { email: "manager@bistro-os.com", label: "Jefe de sala" },
      { email: "waiter@bistro-os.com",  label: "Mozo" },
      { email: "kitchen@bistro-os.com", label: "Cocina" },
    ],
  },
  {
    name: "Casa Norte",
    color: "#4A9B7F",
    users: [
      { email: "owner@casanorte.com",   label: "Dueño" },
      { email: "admin@casanorte.com",   label: "Administrador" },
      { email: "manager@casanorte.com", label: "Jefe de sala" },
      { email: "waiter@casanorte.com",  label: "Mozo" },
    ],
  },
  {
    name: "La Mesa Dorada",
    color: "#C0732A",
    users: [
      { email: "owner@mesadorada.com",   label: "Dueño" },
      { email: "admin@mesadorada.com",   label: "Administrador" },
      { email: "manager@mesadorada.com", label: "Jefe de sala" },
      { email: "waiter@mesadorada.com",  label: "Mozo" },
    ],
  },
];

function fill(email: string) {
  const emailInput = document.getElementById("bistro-email") as HTMLInputElement;
  const passInput  = document.getElementById("bistro-pass")  as HTMLInputElement;
  if (emailInput) emailInput.value = email;
  if (passInput)  passInput.value  = "demo1234";
  emailInput?.focus();
}

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <div className="mx-6 w-full max-w-4xl">
      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">

        {/* ── Formulario ── */}
        <section className="card-premium p-8 md:p-10">
          <p className="eyebrow mb-4">Bistró OS</p>
          <h1 className="text-3xl font-bold tracking-[-0.04em] text-paper md:text-4xl">
            Bienvenido.
          </h1>
          <p className="mt-3 text-[15px] leading-7 text-paper/65">
            Ingresá con tu email y contraseña.
          </p>

          <form action={action} className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="bistro-email" className="text-[12px] font-semibold uppercase tracking-[0.14em] text-paper/55">
                Email
              </label>
              <input
                id="bistro-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="usuario@restaurante.com"
                suppressHydrationWarning
                className="rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-[15px] text-paper placeholder-paper/30 outline-none transition focus:border-gold/50 focus:bg-layer1"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="bistro-pass" className="text-[12px] font-semibold uppercase tracking-[0.14em] text-paper/55">
                Contraseña
              </label>
              <input
                id="bistro-pass"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                suppressHydrationWarning
                className="rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-[15px] text-paper placeholder-paper/30 outline-none transition focus:border-gold/50 focus:bg-layer1"
              />
            </div>

            {state.error && (
              <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[14px] text-red-400">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="btn-gold mt-2 py-3 text-[15px] disabled:opacity-50"
            >
              {pending ? "Ingresando…" : "Ingresar"}
            </button>
          </form>

          <p className="mt-6 text-center text-[12px] text-paper/35">
            Contraseña demo: <span className="font-mono text-paper/55">demo1234</span>
          </p>
        </section>

        {/* ── Panel de usuarios demo ── */}
        <section className="flex flex-col gap-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/40">
            Acceso rápido — elegí un usuario
          </p>

          {DEMO_RESTAURANTS.map((rest) => (
            <div
              key={rest.name}
              className="rounded-2xl border bg-layer1/50 p-4"
              style={{ borderColor: `${rest.color}30` }}
            >
              {/* Header restaurante */}
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[13px] font-bold"
                  style={{ backgroundColor: `${rest.color}25`, color: rest.color }}
                >
                  {rest.name.charAt(0)}
                </span>
                <p className="text-[14px] font-bold" style={{ color: rest.color }}>
                  {rest.name}
                </p>
              </div>

              {/* Usuarios */}
              <div className="grid gap-1.5">
                {rest.users.map((u) => (
                  <button
                    key={u.email}
                    type="button"
                    onClick={() => fill(u.email)}
                    className="flex items-center justify-between rounded-xl border border-line/30 bg-ink/30 px-3 py-2 text-left transition hover:bg-layer1"
                    style={{ ["--hover-border" as string]: `${rest.color}40` }}
                  >
                    <div>
                      <span className="text-[13px] font-semibold text-paper/80">{u.label}</span>
                      <span className="ml-2 font-mono text-[11px] text-paper/40">{u.email}</span>
                    </div>
                    <span className="text-[11px] text-paper/30">Usar →</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}
