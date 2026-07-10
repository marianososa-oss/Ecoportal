"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Bell, LayoutGrid, Users, ClipboardCheck, Image as ImageIcon,
  PenLine, CornerDownLeft, Inbox, Sparkles, X,
} from "lucide-react";

const SECCIONES = [
  { label: "Mi día", href: "/", icon: LayoutGrid, hint: "agenda, tareas, eventos" },
  { label: "Gente", href: "/gente", icon: Users, hint: "directorio, cumpleaños, kudos" },
  { label: "Autogestión", href: "/autogestion", icon: ClipboardCheck, hint: "vacaciones, licencias" },
  { label: "Imagen de perfil", href: "/perfil", icon: ImageIcon, hint: "placa institucional" },
  { label: "Firma de mail", href: "/firma", icon: PenLine, hint: "firma para Gmail" },
];

export function TopBar({ pendingCount = 0 }: { pendingCount?: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const [q, setQ] = useState("");
  const notiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (notiRef.current && !notiRef.current.contains(e.target as Node)) setNotiOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const resultados = SECCIONES.filter(
    (s) => !q.trim() || s.label.toLowerCase().includes(q.toLowerCase()) || s.hint.includes(q.toLowerCase()),
  );

  const ir = (href: string) => {
    setOpen(false);
    setQ("");
    router.push(href);
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-line bg-card/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
        <button
          onClick={() => setOpen(true)}
          className="flex w-full max-w-md items-center gap-2.5 rounded-full border border-line bg-surface/60 px-3.5 py-2 text-sm text-muted transition hover:border-brand/30 hover:text-ink"
        >
          <Search size={15} />
          <span className="flex-1 text-left">Buscar sección o persona…</span>
          <kbd className="hidden rounded border border-line bg-card px-1.5 py-0.5 text-[10px] font-semibold text-muted sm:inline">Ctrl K</kbd>
        </button>

        <div ref={notiRef} className="relative shrink-0">
          <button
            onClick={() => setNotiOpen((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card text-brand transition hover:bg-surface"
            aria-label="Notificaciones"
          >
            <Bell size={16} />
            {pendingCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-accent px-1 text-[10px] font-bold text-white">
                {pendingCount}
              </span>
            )}
          </button>

          {notiOpen && (
            <div className="absolute right-0 z-30 mt-2 w-72 overflow-hidden rounded-xl border border-line bg-card shadow-lift">
              <div className="border-b border-line px-4 py-3 text-sm font-bold text-heading">Notificaciones</div>
              {pendingCount > 0 ? (
                <button
                  onClick={() => { setNotiOpen(false); router.push("/autogestion"); }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-surface"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand"><Inbox size={15} /></span>
                  <span className="text-sm text-ink">
                    Tenés <strong>{pendingCount}</strong> {pendingCount === 1 ? "solicitud" : "solicitudes"} para aprobar.
                  </span>
                </button>
              ) : (
                <div className="flex flex-col items-center gap-1.5 px-4 py-7 text-center">
                  <Sparkles size={20} className="text-brand-accent" />
                  <p className="text-sm font-semibold text-heading">Estás al día</p>
                  <p className="text-xs text-muted">No hay nada pendiente por ahora.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Command palette */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24">
          <div onClick={() => setOpen(false)} className="absolute inset-0 bg-navy/50 backdrop-blur-sm" />
          <div className="animate-rise relative w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-card shadow-lift">
            <div className="flex items-center gap-2.5 border-b border-line px-4">
              <Search size={16} className="text-muted" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && resultados[0]) ir(resultados[0].href); }}
                placeholder="Buscá una sección…"
                className="flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-muted"
              />
              <button onClick={() => setOpen(false)} className="text-muted hover:text-ink"><X size={16} /></button>
            </div>
            <ul className="max-h-80 overflow-y-auto p-2">
              {resultados.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.href}>
                    <button onClick={() => ir(s.href)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-surface">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-brand"><Icon size={16} /></span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold text-ink">{s.label}</span>
                        <span className="block text-xs text-muted">{s.hint}</span>
                      </span>
                      <CornerDownLeft size={13} className="text-muted" />
                    </button>
                  </li>
                );
              })}
              {resultados.length === 0 && (
                <li className="px-3 py-8 text-center text-sm text-muted">Nada coincide con “{q}”.</li>
              )}
            </ul>
            <div className="border-t border-line px-4 py-2 text-[11px] text-muted">
              Buscás personas? Entrá a <button onClick={() => ir("/gente")} className="font-semibold text-brand">Gente</button>.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
