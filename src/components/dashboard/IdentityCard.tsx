"use client";

import { useEffect, useState } from "react";
import { Pencil, User, X, Check } from "lucide-react";
import { ProgressRing } from "./Progress";
import { usePerfilLocal, completitud, type PerfilLocal } from "@/lib/perfil-local";

function iniciales(p: PerfilLocal) {
  const n = (p.nombre[0] ?? "") + (p.apellido[0] ?? "");
  return n.toUpperCase();
}

export function IdentityCard() {
  const [perfil, guardar, listo] = usePerfilLocal();
  const [open, setOpen] = useState(false);

  const pct = completitud(perfil);
  const tieneNombre = perfil.nombre.trim() || perfil.apellido.trim();
  const nombreCompleto = `${perfil.nombre} ${perfil.apellido}`.trim();

  return (
    <div className="group relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-navy-2 p-5 text-white shadow-card transition-all duration-300 hover:shadow-lift">
      <span className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl transition-transform duration-500 group-hover:scale-125" />

      <div className="flex items-center justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/15 text-3xl font-extrabold backdrop-blur-sm">
          {tieneNombre ? iniciales(perfil) : <User size={36} className="text-white/70" />}
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-lg font-bold leading-tight">
          {listo && tieneNombre ? nombreCompleto : "Tu nombre"}
        </p>
        <p className="text-sm text-white/75">
          {listo && perfil.area.trim() ? perfil.area : "Tu área"}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <ProgressRing pct={pct} />
        <div>
          <p className="text-2xl font-extrabold leading-none">{pct}%</p>
          <p className="text-xs text-white/70">perfil completo</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white/15 py-2.5 text-xs font-semibold backdrop-blur-sm transition hover:bg-white/25"
      >
        <Pencil size={13} />
        {tieneNombre ? "Editar mi perfil" : "Completá tu perfil"}
      </button>

      {open && (
        <EditModal
          perfil={perfil}
          onClose={() => setOpen(false)}
          onSave={(p) => {
            guardar(p);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

function EditModal({
  perfil,
  onClose,
  onSave,
}: {
  perfil: PerfilLocal;
  onClose: () => void;
  onSave: (p: PerfilLocal) => void;
}) {
  const [form, setForm] = useState<PerfilLocal>(perfil);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const set = (k: keyof PerfilLocal) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
      />
      <div className="animate-rise relative w-full max-w-sm rounded-2xl border border-line bg-card p-6 text-ink shadow-lift">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-heading">Mi perfil</h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-surface"
          >
            <X size={16} />
          </button>
        </div>
        <p className="mt-1 text-sm text-muted">
          Estos datos personalizan tu tablero. Se guardan en este navegador.
        </p>

        <div className="mt-5 space-y-3">
          <Campo label="Nombre" value={form.nombre} onChange={set("nombre")} placeholder="Mariano" autoFocus />
          <Campo label="Apellido" value={form.apellido} onChange={set("apellido")} placeholder="Sosa" />
          <Campo label="Área" value={form.area} onChange={set("area")} placeholder="Marketing" />
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={() => onSave(form)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-light"
          >
            <Check size={15} /> Guardar
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-muted transition hover:bg-surface"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function Campo({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-semibold text-ink">
      {label}
      <input
        {...props}
        className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm outline-none ring-brand/30 transition focus:border-brand focus:ring-2"
      />
    </label>
  );
}
