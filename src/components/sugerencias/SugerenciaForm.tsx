"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send, Check, EyeOff } from "lucide-react";
import { createSuggestionAction } from "@/lib/actions/sugerencias";
import { CATEGORIAS } from "./meta";

export function SugerenciaForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [ok, setOk] = useState(false);
  const [f, setF] = useState({ texto: "", categoria: "sistema", anonimo: false });

  const enviar = () => {
    if (!f.texto.trim()) return;
    startTransition(async () => {
      const r = await createSuggestionAction(f);
      if (r.ok) {
        setF({ texto: "", categoria: "sistema", anonimo: false });
        setOk(true);
        setTimeout(() => setOk(false), 2500);
        router.refresh();
      }
    });
  };

  return (
    <section className="eco-card p-6">
      <h2 className="font-bold text-heading">Dejá tu sugerencia</h2>
      <p className="mt-1 text-sm text-muted">
        ¿Qué mejorarías para que trabajemos mejor? Contalo claro y concreto.
      </p>

      <textarea
        value={f.texto}
        onChange={(e) => setF((p) => ({ ...p, texto: e.target.value }))}
        rows={4}
        placeholder="Ej: sería útil un sistema para reservar la sala de reuniones…"
        className="mt-4 w-full resize-none rounded-xl border border-line bg-bg px-3.5 py-3 text-sm outline-none ring-brand/30 transition focus:border-brand focus:ring-2"
      />

      <p className="mt-4 text-xs font-semibold text-ink">¿De qué se trata?</p>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {CATEGORIAS.map((c) => {
          const activo = f.categoria === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setF((p) => ({ ...p, categoria: c.id }))}
              style={activo ? { borderColor: c.tone, background: `color-mix(in srgb, ${c.tone} 14%, transparent)` } : undefined}
              className={`rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                activo ? "text-heading" : "border-line bg-surface/50 text-muted hover:border-brand/40 hover:text-brand"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <label className="mt-4 flex cursor-pointer items-center gap-2.5 rounded-xl border border-line bg-surface/40 px-3.5 py-3">
        <input
          type="checkbox"
          checked={f.anonimo}
          onChange={(e) => setF((p) => ({ ...p, anonimo: e.target.checked }))}
          className="h-4 w-4 shrink-0 accent-brand"
        />
        <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
          <EyeOff size={14} className="text-muted" /> Enviar de forma anónima
        </span>
      </label>

      <button
        type="button"
        onClick={enviar}
        disabled={pending || !f.texto.trim()}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-light disabled:opacity-50"
      >
        {ok ? <Check size={16} /> : <Send size={15} />}
        {ok ? "¡Gracias!" : pending ? "Enviando…" : "Enviar sugerencia"}
      </button>
    </section>
  );
}
