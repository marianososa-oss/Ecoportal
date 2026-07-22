"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowBigUp, Lightbulb, EyeOff, Trash2 } from "lucide-react";
import { toggleVoteAction, setEstadoAction, deleteSuggestionAction } from "@/lib/actions/sugerencias";
import { CATEGORIAS, ESTADOS, catMeta, estadoMeta } from "./meta";
import type { SuggestionView } from "@/db/queries";

const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
function fmtFecha(d: Date) {
  const x = new Date(d);
  return `${x.getDate()} ${MES[x.getMonth()]}`;
}

export function SuggestionsFeed({ items, isAdmin }: { items: SuggestionView[]; isAdmin: boolean }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [filtro, setFiltro] = useState<string>("todas");

  const run = (fn: () => Promise<unknown>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  const visibles = filtro === "todas" ? items : items.filter((s) => s.categoria === filtro);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Chip activo={filtro === "todas"} onClick={() => setFiltro("todas")} label={`Todas · ${items.length}`} />
        {CATEGORIAS.map((c) => {
          const n = items.filter((s) => s.categoria === c.id).length;
          if (!n) return null;
          return <Chip key={c.id} activo={filtro === c.id} onClick={() => setFiltro(c.id)} label={`${c.label} · ${n}`} tone={c.tone} />;
        })}
      </div>

      {visibles.length === 0 ? (
        <div className="eco-card flex flex-col items-center gap-2 p-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-brand">
            <Lightbulb size={22} />
          </span>
          <p className="text-sm font-semibold text-heading">Todavía no hay sugerencias</p>
          <p className="max-w-xs text-xs text-muted">Sé la primera persona en proponer una mejora. Toda idea suma.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {visibles.map((s) => {
            const cat = catMeta(s.categoria);
            const est = estadoMeta(s.estado);
            return (
              <li key={s.id} className="eco-card eco-card-hover flex gap-3 p-4">
                {/* Voto */}
                <button
                  onClick={() => run(() => toggleVoteAction(s.id))}
                  aria-pressed={s.yaVote}
                  aria-label={s.yaVote ? "Sacar apoyo" : "Apoyar"}
                  className={`flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-xl border transition ${
                    s.yaVote
                      ? "border-brand bg-brand text-white"
                      : "border-line bg-surface/50 text-muted hover:border-brand/50 hover:text-brand"
                  }`}
                >
                  <ArrowBigUp size={18} className={s.yaVote ? "fill-current" : ""} />
                  <span className="text-sm font-extrabold leading-none">{s.votos}</span>
                </button>

                {/* Cuerpo */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink">{s.texto}</p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <Tag label={cat.label} tone={cat.tone} />
                    <Tag label={est.label} tone={est.tone} soft />
                    <span className="text-[11px] text-muted">
                      {s.autor ? (
                        <>
                          {s.autor}
                          {s.autorArea ? ` · ${s.autorArea}` : ""}
                        </>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <EyeOff size={11} /> Anónima
                        </span>
                      )}
                      {" · "}
                      {fmtFecha(s.createdAt)}
                    </span>
                  </div>

                  {isAdmin && (
                    <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
                      <span className="text-[11px] font-semibold text-muted">Estado:</span>
                      <select
                        value={s.estado}
                        onChange={(e) => run(() => setEstadoAction(s.id, e.target.value))}
                        className="rounded-lg border border-line bg-bg px-2 py-1 text-xs outline-none ring-brand/30 focus:ring-2"
                      >
                        {ESTADOS.map((e) => (
                          <option key={e.id} value={e.id}>{e.label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => run(() => deleteSuggestionAction(s.id))}
                        aria-label="Borrar sugerencia"
                        className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg text-muted transition hover:bg-surface hover:text-red-500"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function Chip({ activo, onClick, label, tone }: { activo: boolean; onClick: () => void; label: string; tone?: string }) {
  return (
    <button
      onClick={onClick}
      style={activo && tone ? { borderColor: tone, color: tone } : undefined}
      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
        activo ? "border-brand bg-brand/10 text-brand" : "border-line text-muted hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}

function Tag({ label, tone, soft = false }: { label: string; tone: string; soft?: boolean }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold"
      style={{
        color: tone,
        background: `color-mix(in srgb, ${tone} ${soft ? 12 : 16}%, transparent)`,
      }}
    >
      {label}
    </span>
  );
}
