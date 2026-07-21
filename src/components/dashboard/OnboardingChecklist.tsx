import Link from "next/link";
import { Check, Circle, ArrowRight } from "lucide-react";

type Paso = {
  titulo: string;
  done: boolean;
  href?: string;
};

/**
 * Checklist de onboarding con estado REAL. "Completá tu perfil" y "Conectá tu
 * Calendar" se detectan de verdad; imagen y firma quedan como accesos.
 */
export function OnboardingChecklist({
  perfilDone,
  tourDone = false,
}: {
  perfilDone: boolean;
  tourDone?: boolean;
}) {
  const pasos: Paso[] = [
    { titulo: "Ingresaste con tu cuenta de Ecocontrol", done: true },
    { titulo: "Conectaste tu Google Calendar", done: true },
    { titulo: "Completá tu perfil (nombre y área)", done: perfilDone },
    { titulo: "Hacé el tour guiado", done: tourDone, href: "/tour" },
    { titulo: "Creá tu imagen de perfil", done: false, href: "/perfil" },
    { titulo: "Armá tu firma de mail", done: false, href: "/firma" },
  ];
  const hechos = pasos.filter((p) => p.done).length;
  const pct = Math.round((hechos / pasos.length) * 100);

  return (
    <section className="eco-card eco-card-hover p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-heading">Tu inducción</h2>
        <span className="text-xs font-bold text-brand-accent-dark">{hechos}/{pasos.length}</span>
      </div>
      <p className="mt-1 text-xs text-muted">Dejá tu espacio listo en unos pasos.</p>

      <ul className="mt-4 space-y-1.5">
        {pasos.map((p) => {
          const inner = (
            <div className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition ${p.href ? "hover:bg-surface" : ""}`}>
              {p.done ? (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-accent text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
              ) : (
                <Circle size={18} className="shrink-0 text-line" />
              )}
              <span className={`flex-1 text-sm ${p.done ? "text-muted line-through" : "font-semibold text-ink"}`}>
                {p.titulo}
              </span>
              {p.href && !p.done && <ArrowRight size={14} className="shrink-0 text-brand" />}
            </div>
          );
          return p.href && !p.done ? (
            <li key={p.titulo}><Link href={p.href}>{inner}</Link></li>
          ) : (
            <li key={p.titulo}>{inner}</li>
          );
        })}
      </ul>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface">
        <div className="h-full rounded-full bg-brand-accent transition-all" style={{ width: `${pct}%` }} />
      </div>
    </section>
  );
}
