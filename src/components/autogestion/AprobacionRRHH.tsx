"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Inbox } from "lucide-react";
import { decideRequestAction } from "@/lib/actions/autogestion";
import type { RequestConSolicitante } from "@/db/queries";

const TIPO_LABEL: Record<string, string> = {
  vacaciones: "Vacaciones",
  licencia: "Licencia",
  home_office: "Home office",
  otro: "Otro",
};

function iniciales(nombre: string) {
  return nombre.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}
function rango(desde: string, hasta: string) {
  if (desde && hasta) return `${desde} → ${hasta}`;
  return desde || hasta || "Sin fechas";
}

export function AprobacionRRHH({ pendientes }: { pendientes: RequestConSolicitante[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const decidir = (id: number, estado: "aprobada" | "rechazada") =>
    startTransition(async () => {
      await decideRequestAction(id, estado);
      router.refresh();
    });

  return (
    <section className="eco-card p-6">
      <div className="flex items-center gap-2">
        <Inbox size={16} className="text-brand" />
        <h2 className="font-bold text-heading">Pendientes de aprobar</h2>
        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-bold text-brand">{pendientes.length}</span>
      </div>

      {pendientes.length === 0 ? (
        <div className="mt-4 flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-line bg-surface/40 py-8 text-center">
          <Inbox size={22} className="text-line" />
          <p className="text-sm font-semibold text-heading">Nada por revisar</p>
          <p className="text-xs text-muted">Cuando llegue una solicitud, aparece acá.</p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {pendientes.map((r) => (
            <li key={r.id} className="rounded-xl border border-line bg-surface/40 p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  {iniciales(r.nombre)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-heading">{r.nombre}</p>
                  <p className="text-xs text-muted">{r.area || "Sin área"}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-brand/10 px-2 py-0.5 font-bold text-brand">{TIPO_LABEL[r.tipo] ?? r.tipo}</span>
                    <span className="text-muted">{rango(r.desde, r.hasta)}</span>
                  </div>
                  {r.motivo && <p className="mt-1.5 text-xs text-ink">“{r.motivo}”</p>}
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => decidir(r.id, "aprobada")}
                  disabled={pending}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-accent px-3 py-2 text-xs font-bold text-white transition hover:bg-brand-accent-dark disabled:opacity-60"
                >
                  <Check size={14} /> Aprobar
                </button>
                <button
                  onClick={() => decidir(r.id, "rechazada")}
                  disabled={pending}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-bold text-muted transition hover:border-red-300 hover:text-red-500 disabled:opacity-60"
                >
                  <X size={14} /> Rechazar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
