import { logoutAction } from "@/features/auth/actions";
import { LogOut } from "lucide-react";

export function DemoSessionControls() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="flex w-full items-center gap-2 rounded-2xl border border-line/60 px-4 py-2.5 text-[13px] font-medium text-paper/60 transition hover:border-red-500/40 hover:text-red-400"
      >
        <LogOut size={14} />
        Cerrar sesión
      </button>
    </form>
  );
}
