"use client";

import { useState, useEffect, startTransition } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Copy, Check, ExternalLink, Printer } from "lucide-react";

export function QRPanel() {
  const [origin, setOrigin] = useState("http://localhost:3000");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    startTransition(() => setOrigin(window.location.origin));
  }, []);

  const cartaUrl = `${origin}/carta`;

  const copy = async () => {
    await navigator.clipboard.writeText(cartaUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const print = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    const svg = document.getElementById("bistro-qr-svg")?.outerHTML ?? "";
    win.document.write(`
      <html><head><title>QR Carta Bistró</title><style>
        body { margin: 0; display: flex; flex-direction: column; align-items: center;
               justify-content: center; min-height: 100vh; font-family: sans-serif;
               background: #fff; color: #111; }
        h2 { font-size: 22px; margin-bottom: 8px; }
        p  { font-size: 13px; color: #666; margin-bottom: 24px; }
        .url { font-size: 11px; color: #999; margin-top: 16px; }
      </style></head><body>
        <h2>Bistró · Cuisine & Ambiance</h2>
        <p>Escaneá para ver la carta del día</p>
        ${svg}
        <p class="url">${cartaUrl}</p>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <section className="card-premium p-6">
      {/* encabezado */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl border border-gold/20 bg-gold/10 p-3">
          <QrCode size={22} className="text-gold" />
        </div>
        <div>
          <h3 className="text-[17px] font-bold text-paper">QR de la carta</h3>
          <p className="text-[13px] text-paper/60">
            Compartilo con tus clientes para que vean el menú del día
          </p>
        </div>
      </div>

      {/* QR generado localmente */}
      <div className="flex justify-center mb-6">
        <div className="rounded-2xl border border-line bg-white p-5 shadow-lg shadow-black/40">
          <QRCodeSVG
            id="bistro-qr-svg"
            value={cartaUrl}
            size={200}
            bgColor="#ffffff"
            fgColor="#0A0A0A"
            level="H"
            includeMargin={false}
          />
        </div>
      </div>

      {/* URL */}
      <div className="mb-4 rounded-2xl border border-line bg-ink/60 px-4 py-3">
        <p className="mb-1 text-[11px] uppercase tracking-[0.13em] text-paper/45">
          URL de la carta
        </p>
        <p className="break-all text-[14px] font-medium text-paper">{cartaUrl}</p>
      </div>

      {/* acciones */}
      <div className="flex gap-2.5">
        <button
          onClick={copy}
          className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border py-3 text-[14px] font-semibold transition-all duration-200 ${
            copied
              ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-400"
              : "border-gold/35 bg-gold/10 text-gold hover:bg-gold/18"
          }`}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Copiado" : "Copiar link"}
        </button>

        <button
          onClick={print}
          className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-[14px] font-medium text-paper/75 transition-all duration-200 hover:border-gold/30 hover:text-paper"
          title="Imprimir QR"
        >
          <Printer size={15} />
        </button>

        <a
          href="/carta"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-layer1/60 px-4 py-3 text-[14px] font-medium text-paper/75 transition-all duration-200 hover:border-gold/30 hover:text-paper"
          title="Ver carta"
        >
          <ExternalLink size={15} />
        </a>
      </div>

      <p className="mt-4 text-center text-[12px] text-paper/38">
        El QR siempre apunta a la carta actualizada · funciona sin internet
      </p>
    </section>
  );
}
