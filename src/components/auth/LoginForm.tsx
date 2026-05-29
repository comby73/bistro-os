"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/features/auth/login-action";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <section className="card-premium mx-6 w-full max-w-md p-8 md:p-10">

      <p className="eyebrow mb-4">Bistró OS</p>
      <h1 className="text-3xl font-bold tracking-[-0.04em] text-paper md:text-4xl">
        Bienvenido.
      </h1>
      <p className="mt-3 text-[15px] leading-7 text-paper/65">
        Ingresá con tu email y contraseña para acceder al sistema.
      </p>

      <form action={action} className="mt-8 flex flex-col gap-4">

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[12px] font-semibold uppercase tracking-[0.14em] text-paper/55">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="owner@bistro-os.com"
            className="rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-[15px] text-paper placeholder-paper/30 outline-none transition focus:border-gold/50 focus:bg-layer1"
          />
        </div>

        {/* Contraseña */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-[12px] font-semibold uppercase tracking-[0.14em] text-paper/55">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-[15px] text-paper placeholder-paper/30 outline-none transition focus:border-gold/50 focus:bg-layer1"
          />
        </div>

        {/* Error */}
        {state.error && (
          <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[14px] text-red-400">
            {state.error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={pending}
          className="btn-gold mt-2 py-3 text-[15px] disabled:opacity-50"
        >
          {pending ? "Ingresando…" : "Ingresar"}
        </button>
      </form>

      {/* Hint demo */}
      <div className="mt-8 rounded-2xl border border-line/50 bg-layer1/40 p-4">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-paper/40">
          Usuarios demo · contraseña: <span className="font-mono text-paper/60">demo1234</span>
        </p>
        <div className="grid gap-2">
          {[
            { email: "demo@bistro-os.com",   label: "Dueño — acceso total" },
            { email: "salon@bistro-os.com",  label: "Jefe de sala" },
            { email: "mozo@bistro-os.com",   label: "Mozo" },
            { email: "cocina@bistro-os.com", label: "Cocina" },
          ].map((u) => (
            <button
              key={u.email}
              type="button"
              onClick={() => {
                const emailInput = document.getElementById("email") as HTMLInputElement;
                const passInput  = document.getElementById("password") as HTMLInputElement;
                if (emailInput) emailInput.value = u.email;
                if (passInput)  passInput.value  = "demo1234";
              }}
              className="flex items-center justify-between rounded-xl border border-line/40 bg-ink/40 px-3 py-2 text-left transition hover:border-gold/30 hover:bg-layer1"
            >
              <div>
                <p className="text-[13px] font-semibold text-paper/80">{u.label}</p>
                <p className="text-[11px] text-paper/45 font-mono">{u.email}</p>
              </div>
              <span className="text-[11px] text-paper/35 transition group-hover:text-gold">Usar →</span>
            </button>
          ))}
        </div>
      </div>

    </section>
  );
}
