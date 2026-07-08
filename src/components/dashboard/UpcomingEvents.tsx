"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Cake, CalendarClock, Plus, Trash2 } from "lucide-react";
import { addEventAction, deleteEventAction } from "@/lib/actions/tablero";

export type TipoEvento = "capacitacion" | "cumple" | "evento";
export type EventoView = { id: number; titulo: string; cuando: string; tipo: string };

const ICON: Record<string, React.ReactNode> = {
  capacitacion: <GraduationCap size={15} />,
  cumple: <Cake size={15} />,
  evento: <CalendarClock size={15} />,
};
const TIPOS: { id: TipoEvento; label: string }[] = [
  { id: "capacitacion", label: "Capacitación" },
  { id: "cumple", label: "Cumpleaños" },
  { id: "evento", label: "Evento" },
];

export function UpcomingEvents({ eventos }: { eventos: EventoView[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [creando, setCreando] = useState(false);
  const [f, setF] = useState<{ titulo: string; cuando: string; tipo: TipoEvento }>({
    titulo: "",
    cuando: "",
    tipo: "evento",
  });

  const run = (fn: () => Promise<void>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  const confirmar = () => {
    if (!f.titulo.trim()) return;
    const { titulo, cuando, tipo } = f;
    setF({ titulo: "", cuando: "", tipo: "evento" });
    setCreando(false);
    run(() => addEventAction(titulo, cuando, tipo));
  };

  return (
    <section className="rounded-2xl border border-line bg-card p-5 shadow-card transition-all duration-300 hover:shadow-lift">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarClock size={15} className="text-brand" />
          <h2 className="font-bold text-heading">Lo que se viene en tu área</h2>
        </div>
        <button
          onClick={() => setCreando((v) => !v)}
          className="inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-xs font-bold text-white transition hover:bg-brand-light"
        >
          <Plus size={13} /> Agregar
        </button>
      </div>

      {creando && (
        <div className="mt-3 animate-rise rounded-xl border border-line bg-surface/60 p-3">
          <input
            autoFocus
            value={f.titulo}
            onChange={(e) => setF((p) => ({ ...p, titulo: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && confirmar()}
            placeholder="¿Qué evento?"
            className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          />
          <div className="mt-2 flex gap-2">
            <input
              value={f.cuando}
              onChange={(e) => setF((p) => ({ ...p, cuando: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && confirmar()}
              placeholder="Cuándo"
              className="flex-1 rounded-lg border border-line bg-bg px-3 py-2 text-xs outline-none ring-brand/30 focus:ring-2"
            />
            <select
              value={f.tipo}
              onChange={(e) => setF((p) => ({ ...p, tipo: e.target.value as TipoEvento }))}
              className="rounded-lg border border-line bg-bg px-2 py-2 text-xs outline-none ring-brand/30 focus:ring-2"
            >
              {TIPOS.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
            <button onClick={confirmar} className="rounded-lg bg-brand px-3 py-2 text-xs font-bold text-white transition hover:bg-brand-light">Ok</button>
          </div>
        </div>
      )}

      <ul className="mt-4 space-y-2">
        {eventos.map((e) => (
          <li key={e.id} className="group flex items-center gap-3 rounded-xl border border-line bg-surface/40 p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
              {ICON[e.tipo] ?? ICON.evento}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{e.titulo}</p>
              <p className="text-xs text-muted">{e.cuando}</p>
            </div>
            <button
              onClick={() => run(() => deleteEventAction(e.id))}
              aria-label="Borrar"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted opacity-0 transition hover:bg-card hover:text-red-500 group-hover:opacity-100"
            >
              <Trash2 size={13} />
            </button>
          </li>
        ))}
        {eventos.length === 0 && (
          <li className="px-2 py-6 text-center text-sm text-muted">
            Sin eventos cargados. Agregá el primero 👆
          </li>
        )}
      </ul>
    </section>
  );
}
