export function SalesReportActions({ readOnly }: { readOnly?: boolean }) {
  return (
    <section className="card-premium p-6">
      <div className="mb-6">
        <p className="eyebrow mb-3">Reportes</p>
        <h2 className="text-xl font-semibold">Acciones simuladas</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          disabled={readOnly}
          className="rounded-2xl border border-line bg-layer1/60 px-5 py-4 text-left transition hover:border-gold/35 hover:bg-layer1 disabled:cursor-not-allowed disabled:opacity-55"
        >
          <span className="block font-semibold">Exportar reporte</span>
          <span className="mt-2 block text-sm leading-6 text-paper/58">
            Genera un corte diario operativo en formato simulado.
          </span>
        </button>

        <button
          type="button"
          disabled={readOnly}
          className="rounded-2xl border border-line bg-layer1/60 px-5 py-4 text-left transition hover:border-gold/35 hover:bg-layer1 disabled:cursor-not-allowed disabled:opacity-55"
        >
          <span className="block font-semibold">Enviar resumen diario</span>
          <span className="mt-2 block text-sm leading-6 text-paper/58">
            Simula el envío del resumen de ventas y caja al cierre del turno.
          </span>
        </button>
      </div>

      {readOnly && (
        <p className="mt-4 text-sm text-paper/55">
          El rol actual puede consultar ventas, pero no ejecutar acciones de cierre.
        </p>
      )}
    </section>
  );
}
