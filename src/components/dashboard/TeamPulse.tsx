import Link from "next/link";
import { HardHat, Lightbulb, MapPin, ArrowRight, ArrowBigUp } from "lucide-react";
import type { WorklogView, SuggestionView } from "@/db/queries";

export function TeamPulse({
  enObra,
  topIdea,
}: {
  enObra: WorklogView[];
  topIdea: SuggestionView | null;
}) {
  return (
    <section className="eco-card eco-card-hover p-5">
      <h2 className="font-bold text-heading">Pulso del equipo</h2>

      {/* En obra esta semana */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-sm font-bold text-heading">
            <HardHat size={14} style={{ color: "var(--eco-monitoreo)" }} /> En obra esta semana
          </p>
          <Link href="/trabajamos" className="flex items-center gap-0.5 text-xs font-semibold text-brand hover:text-brand-light">
            Ver <ArrowRight size={12} />
          </Link>
        </div>
        {enObra.length > 0 ? (
          <ul className="mt-2 space-y-1.5">
            {enObra.slice(0, 3).map((w) => (
              <li key={w.id} className="flex items-center gap-2 text-sm">
                <span className="truncate font-semibold text-ink">{w.autor}</span>
                {w.lugar && (
                  <span className="inline-flex shrink-0 items-center gap-0.5 text-xs text-muted">
                    <MapPin size={11} /> {w.lugar}
                  </span>
                )}
              </li>
            ))}
            {enObra.length > 3 && <li className="text-xs text-muted">+{enObra.length - 3} más</li>}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-muted">Nadie en obra registrado esta semana.</p>
        )}
      </div>

      <div className="my-4 h-px bg-line" />

      {/* Idea más votada */}
      <div>
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-sm font-bold text-heading">
            <Lightbulb size={14} style={{ color: "var(--eco-explosivos)" }} /> Idea más apoyada
          </p>
          <Link href="/sugerencias" className="flex items-center gap-0.5 text-xs font-semibold text-brand hover:text-brand-light">
            {topIdea ? "Ver" : "Sumar"} <ArrowRight size={12} />
          </Link>
        </div>
        {topIdea ? (
          <div className="mt-2 flex items-start gap-2.5">
            <span className="flex h-9 w-8 shrink-0 flex-col items-center justify-center rounded-lg border border-line bg-surface/60 text-brand">
              <ArrowBigUp size={14} />
              <span className="text-xs font-extrabold leading-none">{topIdea.votos}</span>
            </span>
            <p className="line-clamp-2 text-sm text-ink">{topIdea.texto}</p>
          </div>
        ) : (
          <p className="mt-2 text-xs text-muted">Todavía no hay sugerencias. Dejá la primera.</p>
        )}
      </div>
    </section>
  );
}
