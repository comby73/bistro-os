async function checkSupabase(): Promise<{ ok: boolean; latencyMs?: number }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return { ok: false };

  const start = Date.now();
  try {
    const res = await fetch(`${url}/rest/v1/menu_items?select=count`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    return { ok: res.ok, latencyMs: Date.now() - start };
  } catch {
    return { ok: false };
  }
}

export async function SupabaseStatus() {
  const { ok, latencyMs } = await checkSupabase();

  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-layer1/40 px-3 py-2.5">
      <span className="relative flex h-2 w-2 flex-shrink-0">
        {ok && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            ok
              ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
              : "bg-red-500 shadow-[0_0_6px_#ef4444]"
          }`}
        />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-paper/75">
          Supabase {ok ? "conectado" : "sin conexión"}
        </p>
        {ok && latencyMs !== undefined && (
          <p className="text-[10px] text-paper/38">{latencyMs} ms</p>
        )}
      </div>
    </div>
  );
}
