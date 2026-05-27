import { clearDemoRoleAction } from "@/features/auth/actions";

export function DemoSessionControls() {
  return (
    <form action={clearDemoRoleAction}>
      <button
        type="submit"
        className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.18em] text-paper/70 transition hover:border-gold/40 hover:text-paper"
      >
        Cambiar rol
      </button>
    </form>
  );
}
