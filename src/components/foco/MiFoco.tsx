"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, MapPin } from "lucide-react";
import { saveFocoAction, deleteFocoAction } from "@/lib/actions/foco";
import { TIPOS } from "./meta";

type Current = { tipo: string; titulo: string; lugar: string } | null;

export function MiFoco({ current }: { current: Current }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [ok, setOk] = useState(false);
  const [f, setF] = useState({
    tipo: current?.tipo ?? "oficina",
    titulo: current?.titulo ?? "",
    lugar: current?.lugar ?? "",
  });

  const guardar = () => {
    if (!f.titulo.trim()) return;
    startTransition(async () => {
      const r = await saveFocoAction(f);
      if (r.ok) {
        setOk(true);
        setTimeout(() => setOk(false), 2500);
        router.refresh();
      }
    });
  };

  const quitar = () =>
    startTransition(async () => {
      await deleteFocoAction();
      setF({ tipo: "oficina", titulo: "", lugar: "" });
      router.refresh();
    });

  return (
    <section className="eco-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-heading">Tu foco de esta semana</h2>
        {current && <span className="text-xs font-bold text-brand-accent-dark">Publicado</span>}
      </div>
      <p className="mt-1 text-sm text-muted">Contá en qué andás para que el equipo no se pise y sepa dónde estás.</p>

      {/* Tipo */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TIPOS.map((t) => {
          const Icon = t.icon;
          const activo = f.tipo === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setF((p) => ({ ...p, tipo: t.id }))}
              style={activo ? { borderColor: t.tone, background: `color-mix(in srgb, ${t.tone} 14%, transparent)`, color: t.tone } : undefined}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition ${
                activo ? "" : "border-line bg-surface/50 text-muted hover:border-brand/40 hover:text-brand"
              }`}
            >
              <Icon size={18} />
              {t.label}
            </button>
          );
        })}
      </div>

      <label className="mt-4 block text-sm font-semibold text-ink">
        ¿En qué estás trabajando?
        <input
          value={f.titulo}
          onChange={(e) => setF((p) => ({ ...p, titulo: e.target.value }))}
          onKeyDown={(e) => e.key === "Enter" && guardar()}
          placeholder="Ej: puesta en marcha HVAC, app de checklist…"
          className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm outline-none ring-brand/30 transition focus:border-brand focus:ring-2"
        />
      </label>

      {f.tipo === "obra" && (
        <label className="mt-3 block text-sm font-semibold text-ink">
          ¿Dónde? <span className="font-normal text-muted">(obra, planta, cliente)</span>
          <div className="relative mt-1">
            <MapPin size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={f.lugar}
              onChange={(e) => setF((p) => ({ ...p, lugar: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && guardar()}
              placeholder="Ej: Planta Zárate"
              className="w-full rounded-lg border border-line bg-bg py-2.5 pl-9 pr-3 text-sm outline-none ring-brand/30 transition focus:border-brand focus:ring-2"
            />
          </div>
        </label>
      )}

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={guardar}
          disabled={pending || !f.titulo.trim()}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-light disabled:opacity-50"
        >
          {ok && <Check size={15} />}
          {ok ? "Guardado" : pending ? "Guardando…" : current ? "Actualizar" : "Publicar mi foco"}
        </button>
        {current && (
          <button type="button" onClick={quitar} disabled={pending} className="text-xs font-semibold text-muted transition hover:text-red-500">
            Quitar mi entrada
          </button>
        )}
      </div>
    </section>
  );
}
