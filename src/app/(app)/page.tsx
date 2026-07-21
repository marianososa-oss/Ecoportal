import { redirect } from "next/navigation";
import { IdentityCard } from "@/components/dashboard/IdentityCard";
import { Greeting } from "@/components/dashboard/Greeting";
import { HeroSummary } from "@/components/dashboard/HeroSummary";
import { LiveStats } from "@/components/dashboard/LiveStats";
import { TaskTracker } from "@/components/dashboard/TaskTracker";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { CalendarAgenda } from "@/components/dashboard/CalendarAgenda";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";
import { QuickAccess } from "@/components/dashboard/QuickAccess";
import { HeroBackdrop } from "@/components/shell/PageHero";
import { getCurrentUser } from "@/lib/user";
import { toIdentidad } from "@/lib/identidad";
import { getUpcomingCalendarEvents } from "@/lib/google";
import { getTasks, getEvents } from "@/db/queries";

export const metadata = { title: "Mi día" };
export const dynamic = "force-dynamic";

const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

export default async function MiDia() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const identidad = toIdentidad(user);

  const [tasks, events, calEvents] = await Promise.all([
    getTasks(user.id),
    getEvents(user.id),
    user.googleRefreshToken ? getUpcomingCalendarEvents(user.googleRefreshToken) : Promise.resolve([]),
  ]);

  const tareas = tasks.map((t) => ({ id: t.id, titulo: t.titulo, cuando: t.cuando, estado: t.estado as "pendiente" | "completa" }));
  const eventos = events.map((e) => ({ id: e.id, titulo: e.titulo, cuando: e.cuando, tipo: e.tipo }));
  const pendientes = tareas.filter((t) => t.estado !== "completa").length;
  const completas = tareas.filter((t) => t.estado === "completa").length;

  const now = new Date();
  const fecha = `${now.getDate()} de ${MESES[now.getMonth()]} de ${now.getFullYear()}`;

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy">
        <HeroBackdrop />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-11 animate-rise sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Greeting nombre={identidad.firstName || identidad.nombre} fecha={fecha} />
          <HeroSummary perfilPct={identidad.pct} tareasPendientes={pendientes} eventosCount={eventos.length} />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="min-w-0 space-y-5 lg:col-span-2">
            <div className="grid gap-5 md:grid-cols-5">
              <Reveal delay={40} className="min-w-0 md:col-span-2"><IdentityCard user={identidad} /></Reveal>
              <div className="min-w-0 space-y-5 md:col-span-3">
                <Reveal delay={90}>
                  <LiveStats perfilPct={identidad.pct} tareasTotal={tareas.length} tareasCompletas={completas} />
                </Reveal>
                <Reveal delay={150}>
                  <OnboardingChecklist perfilDone={identidad.pct === 100} />
                </Reveal>
              </div>
            </div>

            <Reveal delay={210}><QuickAccess /></Reveal>
            <Reveal delay={260}><CalendarAgenda eventos={calEvents} /></Reveal>
          </div>

          <div className="min-w-0 space-y-5">
            <Reveal delay={120}><TaskTracker tareas={tareas} /></Reveal>
            <Reveal delay={220}><UpcomingEvents eventos={eventos} /></Reveal>
          </div>
        </div>
      </div>
    </>
  );
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <div className={`animate-rise ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
