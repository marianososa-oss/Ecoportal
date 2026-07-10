"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send, Plane, HeartPulse, House, FileText, Check } from "lucide-react";
import { createRequestAction } from "@/lib/actions/autogestion";

const TIPOS = [
  { id: "vacaciones", label: "Vacaciones", icon: Plane },
  { id: "licencia", label: "Licencia", icon: HeartPulse },
  { id: "home_office", label: "Home office", icon: House },
  { id: "otro", label: "Otro", icon: FileText },
];

export function SolicitudForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [ok, setOk] = useState(false);
  const [f, setF] = useState({ tipo: "vacaciones", desde: "", hasta: "", motivo: "" });

  const enviar = () => {
    startTransition(async () => {
      const r = await createRequestAction(f);
      if (r.ok) {
        setF({ tipo: "vacaciones", desde: "", hasta: "", motivo: "" });
        setOk(true);
        setTimeout(() => setOk(false), 2500);
        router.refresh();
      }
    });
  };

  return (
    <section className="eco-sheen rounded-2xl border border-line bg-card p-6 shadow-card">
      <h2 className="font-bold text-heading">Nueva solicitud</h2>
      <p className="mt-1 text-sm text-muted">Pedí vacaciones, una licencia o lo que necesites. RRHH la revisa.</p>

      {/* Tipo */}
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TIPOS.map((t) => {
          const Icon = t.icon;
          const activo = f.tipo === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setF((p) => ({ ...p, tipo: t.id }))}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition ${
                activo
                  ? "border-brand bg-brand text-white shadow-card"
                  : "border-line bg-surface/50 text-muted hover:border-brand/40 hover:text-brand"
              }`}
            >
              <Icon size={18} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-ink">
          Desde
          <input
            type="date"
            value={f.desde}
            onChange={(e) => setF((p) => ({ ...p, desde: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm outline-none ring-brand/30 focus:border-brand focus:ring-2"
          />
        </label>
        <label className="block text-sm font-semibold text-ink">
          Hasta
          <input
            type="date"
            value={f.hasta}
            onChange={(e) => setF((p) => ({ ...p, hasta: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm outline-none ring-brand/30 focus:border-brand focus:ring-2"
          />
        </label>
      </div>

      <label className="mt-4 block text-sm font-semibold text-ink">
        Motivo / comentario (opcional)
        <textarea
          value={f.motivo}
          onChange={(e) => setF((p) => ({ ...p, motivo: e.target.value }))}
          rows={2}
          placeholder="Un detalle para RRHH…"
          className="mt-1 w-full resize-none rounded-lg border border-line bg-bg px-3 py-2.5 text-sm outline-none ring-brand/30 focus:border-brand focus:ring-2"
        />
      </label>

      <button
        type="button"
        onClick={enviar}
        disabled={pending}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-light disabled:opacity-60"
      >
        {ok ? <Check size={16} /> : <Send size={15} />}
        {ok ? "¡Enviada!" : pending ? "Enviando…" : "Enviar solicitud"}
      </button>
    </section>
  );
}
