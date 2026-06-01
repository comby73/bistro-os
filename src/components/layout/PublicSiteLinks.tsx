"use client";

import { useState } from "react";
import { CalendarPlus, UtensilsCrossed, Copy, Check, ExternalLink } from "lucide-react";

interface Props {
  slug: string;
}

function CopyableUrl({ href, icon: Icon, label }: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="rounded-xl border border-line/60 bg-layer1/40 p-3">
      {/* label + link externo */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <Icon size={13} className="text-paper/50" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-paper/45">
            {label}
          </span>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-paper/40 hover:text-gold transition-colors"
          title="Abrir en nueva pestaña"
        >
          <ExternalLink size={13} />
        </a>
      </div>

      {/* URL + botón copiar */}
      <div className="flex items-center gap-2">
        <p className="flex-1 truncate text-[11px] text-paper/60 font-mono">
          {href.replace("https://", "")}
        </p>
        <button
          onClick={copy}
          className="shrink-0 rounded-lg p-1.5 transition-colors hover:bg-layer2"
          title="Copiar URL"
        >
          {copied
            ? <Check size={13} className="text-green-400" />
            : <Copy size={13} className="text-paper/40 hover:text-paper" />
          }
        </button>
      </div>
    </div>
  );
}

export function PublicSiteLinks({ slug }: Props) {
  const base = typeof window !== "undefined"
    ? window.location.origin
    : "https://bistro-os-phi.vercel.app";

  const reservarUrl = `${base}/reservar/${slug}`;
  const cartaUrl    = `${base}/carta/${slug}`;

  return (
    <div className="mt-6 rounded-2xl border border-line bg-layer1/30 p-4">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper/40">
        🌐 Sitio público
      </p>
      <div className="space-y-2">
        <CopyableUrl
          href={reservarUrl}
          icon={CalendarPlus}
          label="Reservas"
        />
        <CopyableUrl
          href={cartaUrl}
          icon={UtensilsCrossed}
          label="Carta"
        />
      </div>
      <p className="mt-3 text-[10px] text-paper/30 leading-4">
        Compartí estos links con tus clientes o ponelos en tu web e Instagram.
      </p>
    </div>
  );
}
