"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart, Sparkles, Send, Check } from "lucide-react";
import { giveKudoAction } from "@/lib/actions/kudos";
import type { KudoView } from "@/db/queries";

type Opcion = { id: number; nombre: string };

function iniciales(nombre: string) {
  return nombre.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function Reconocimientos({
  opciones,
  kudos,
}: {
  opciones: Opcion[];
  kudos: KudoView[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [abierto, setAbierto] = useState(false);
  const [ok, setOk] = useState(false);
  const [to, setTo] = useState<number | "">("");
  const [msg, setMsg] = useState("");

  const enviar = () => {
    if (!to || !msg.trim()) return;
    startTransition(async () => {
      const r = await giveKudoAction(Number(to), msg);
      if (r.ok) {
        setMsg("");
        setTo("");
        setOk(true);
        setAbierto(false);
        setTimeout(() => setOk(false), 2500);
        router.refresh();
      }
    });
  };

  return (
    <section className="mb-8 eco-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold text-heading">
          <Heart size={16} className="text-brand-accent" /> Reconocimientos
        </h2>
        <button
          onClick={() => setAbierto((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-xs font-bold text-white transition hover:bg-brand-light"
        >
          {ok ? <Check size={13} /> : <Sparkles size={13} />}
          {ok ? "¡Enviado!" : "Dar reconocimiento"}
        </button>
      </div>

      {abierto && (
        <div className="mt-4 animate-rise rounded-xl border border-line bg-surface/50 p-4">
          <div className="grid gap-3 sm:grid-cols-[220px_1fr]">
            <select
              value={to}
              onChange={(e) => setTo(e.target.value ? Number(e.target.value) : "")}
              className="rounded-lg border border-line bg-bg px-3 py-2.5 text-sm outline-none ring-brand/30 focus:border-brand focus:ring-2"
            >
              <option value="">¿A quién?</option>
              {opciones.map((o) => (
                <option key={o.id} value={o.id}>{o.nombre}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && enviar()}
                placeholder="Gracias por… / Buen laburo con…"
                className="flex-1 rounded-lg border border-line bg-bg px-3 py-2.5 text-sm outline-none ring-brand/30 focus:border-brand focus:ring-2"
              />
              <button
                onClick={enviar}
                disabled={pending || !to || !msg.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-light disabled:opacity-50"
              >
                <Send size={14} /> Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Muro */}
      {kudos.length > 0 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {kudos.map((k) => (
            <div key={k.id} className="rounded-xl border border-line bg-surface/40 p-4">
              <div className="flex items-center gap-2.5">
                {k.paraAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={k.paraAvatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-accent text-xs font-bold text-white">
                    {iniciales(k.para)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-heading">{k.para}</p>
                  {k.paraArea && <p className="truncate text-[11px] text-muted">{k.paraArea}</p>}
                </div>
              </div>
              <p className="mt-2.5 text-sm text-ink">“{k.mensaje}”</p>
              <p className="mt-2 text-[11px] text-muted">— {k.de}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-line bg-surface/40 py-8 text-center">
          <Heart size={22} className="text-line" />
          <p className="text-sm font-semibold text-heading">Todavía no hay reconocimientos</p>
          <p className="text-xs text-muted">Sé el primero en agradecer a un compañero. 💚</p>
        </div>
      )}
    </section>
  );
}
