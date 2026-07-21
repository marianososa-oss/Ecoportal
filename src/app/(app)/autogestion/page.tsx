import { redirect } from "next/navigation";
import { Clock, CheckCircle2, XCircle, FileText } from "lucide-react";
import { PageHero } from "@/components/shell/PageHero";
import { SolicitudForm } from "@/components/autogestion/SolicitudForm";
import { AprobacionRRHH } from "@/components/autogestion/AprobacionRRHH";
import { getCurrentUser } from "@/lib/user";
import { getMyRequests, getPendingRequests } from "@/db/queries";
import type { Request } from "@/db/schema";

export const metadata = { title: "Autogestión" };
export const dynamic = "force-dynamic";

const TIPO_LABEL: Record<string, string> = {
  vacaciones: "Vacaciones",
  licencia: "Licencia",
  home_office: "Home office",
  otro: "Otro",
};

export default async function AutogestionPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const esRRHH = user.role === "rrhh" || user.role === "admin";

  const [mias, pendientes] = await Promise.all([
    getMyRequests(user.id),
    esRRHH ? getPendingRequests() : Promise.resolve([]),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Autogestión"
        title="Tus solicitudes"
        subtitle="Pedí vacaciones o licencias y seguí el estado, sin mails de ida y vuelta."
      />
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <SolicitudForm />
            {esRRHH && <AprobacionRRHH pendientes={pendientes} />}
          </div>

          <section className="eco-card p-6">
            <h2 className="font-bold text-heading">Mis solicitudes</h2>
            {mias.length === 0 ? (
              <div className="mt-4 flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-line bg-surface/40 py-10 text-center">
                <FileText size={22} className="text-line" />
                <p className="text-sm font-semibold text-heading">Todavía no pediste nada</p>
                <p className="text-xs text-muted">Cargá tu primera solicitud a la izquierda.</p>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {mias.map((r) => (
                  <MiSolicitud key={r.id} r={r} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

function MiSolicitud({ r }: { r: Request }) {
  const rango = r.desde && r.hasta ? `${r.desde} → ${r.hasta}` : r.desde || r.hasta || "Sin fechas";
  return (
    <li className="flex items-start justify-between gap-3 rounded-xl border border-line bg-surface/40 p-4">
      <div className="min-w-0">
        <p className="text-sm font-bold text-heading">{TIPO_LABEL[r.tipo] ?? r.tipo}</p>
        <p className="mt-0.5 text-xs text-muted">{rango}</p>
        {r.motivo && <p className="mt-1 text-xs text-ink">“{r.motivo}”</p>}
      </div>
      <EstadoBadge estado={r.estado} />
    </li>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  const map = {
    pendiente: { label: "Pendiente", cls: "bg-amber-100 text-amber-700", Icon: Clock },
    aprobada: { label: "Aprobada", cls: "bg-brand-accent/15 text-brand-accent-dark", Icon: CheckCircle2 },
    rechazada: { label: "Rechazada", cls: "bg-red-100 text-red-600", Icon: XCircle },
  } as const;
  const e = map[estado as keyof typeof map] ?? map.pendiente;
  const Icon = e.Icon;
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${e.cls}`}>
      <Icon size={13} /> {e.label}
    </span>
  );
}
