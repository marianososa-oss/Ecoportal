import { redirect } from "next/navigation";
import { FileText, GraduationCap, CalendarClock, Users } from "lucide-react";
import { ProgressBar } from "@/components/dashboard/Progress";
import { IdentityCard } from "@/components/dashboard/IdentityCard";
import { Greeting } from "@/components/dashboard/Greeting";
import { HeroSummary } from "@/components/dashboard/HeroSummary";
import { LiveStats } from "@/components/dashboard/LiveStats";
import { TaskTracker } from "@/components/dashboard/TaskTracker";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { CalendarAgenda } from "@/components/dashboard/CalendarAgenda";
import { getCurrentUser } from "@/lib/user";
import { toIdentidad } from "@/lib/identidad";
import { getUpcomingCalendarEvents } from "@/lib/google";

export const metadata = { title: "Mi tablero" };
export const dynamic = "force-dynamic";

/* ── Datos de muestra (Equipo / Cursos / Documentos / Actividad).
   Se conectan a fuentes reales en fases siguientes (directorio, Capacitaciones,
   Drive). Tareas, eventos, perfil y stats ya son reales y editables. ─────── */
const EQUIPO = [
  { nombre: "Lucía Green", rol: "Líder de equipo" },
  { nombre: "Martín Fell", rol: "Comercial" },
  { nombre: "Ana Ferro", rol: "Ingeniería" },
  { nombre: "Kevin Luz", rol: "Diseño" },
];
const OBJETIVOS = [
  { titulo: "Conocer a tu equipo", pct: 72 },
  { titulo: "Configurar tus cuentas y herramientas", pct: 12 },
  { titulo: "Completar tu perfil", pct: 95 },
];
const CURSOS = [
  { titulo: "Webinar: Automatización de procesos", fecha: "25 may · 11:00" },
  { titulo: "Liderazgo situacional", fecha: "23 may · 11:00" },
];
const DOCUMENTOS = [
  { nombre: "Contrato de empleo", tipo: "PDF" },
  { nombre: "Manual de marca", tipo: "PDF" },
  { nombre: "Inducción 2026", tipo: "DOC" },
];
const ACTIVIDAD = [
  { dia: "Lu", h: 42 }, { dia: "Ma", h: 55 }, { dia: "Mi", h: 38 },
  { dia: "Ju", h: 70 }, { dia: "Vi", h: 100, label: "8h 13m" },
  { dia: "Sa", h: 22 }, { dia: "Do", h: 16 },
];

const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

function iniciales(nombre: string) {
  return nombre.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}
const AVATAR_COLORS = ["bg-brand", "bg-brand-accent", "bg-brand-light", "bg-navy-2", "bg-brand-accent-dark"];

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");
  const identidad = toIdentidad(user);
  const calEvents = user.googleRefreshToken
    ? await getUpcomingCalendarEvents(user.googleRefreshToken)
    : [];

  const now = new Date();
  const fechaLarga = `${now.getDate()} de ${MESES[now.getMonth()]} de ${now.getFullYear()}`;

  return (
    <>
      <DashHero fecha={fechaLarga} nombre={identidad.firstName || identidad.nombre} perfilPct={identidad.pct} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Columna izquierda (2/3) */}
          <div className="space-y-5 lg:col-span-2">
            <div className="grid gap-5 md:grid-cols-5">
              <Reveal delay={40} className="md:col-span-2">
                <IdentityCard user={identidad} />
              </Reveal>
              <div className="space-y-5 md:col-span-3">
                <Reveal delay={90}>
                  <LiveStats perfilPct={identidad.pct} />
                </Reveal>
                <Reveal delay={150}>
                  <ActivityChart />
                </Reveal>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Reveal delay={210}><TeamCard /></Reveal>
              <Reveal delay={260}><CoursesCard /></Reveal>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Reveal delay={310}><CalendarAgenda eventos={calEvents} /></Reveal>
              <Reveal delay={360}><DocumentsCard /></Reveal>
            </div>
          </div>

          {/* Columna derecha (1/3) */}
          <div className="space-y-5">
            <Reveal delay={120}><TaskTracker /></Reveal>
            <Reveal delay={220}><UpcomingEvents /></Reveal>
            <Reveal delay={320}><GoalsCard /></Reveal>
          </div>
        </div>
      </div>
    </>
  );
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={`animate-rise ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ── Componentes ─────────────────────────────────────────────────────────── */

function DashHero({ fecha, nombre, perfilPct }: { fecha: string; nombre: string; perfilPct: number }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-right"
        style={{ backgroundImage: "url(/eco/shelter.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/97 via-navy/90 to-navy/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-navy/30" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="animate-aurora absolute -left-24 -top-36 h-[30rem] w-[30rem] rounded-full blur-[120px] opacity-70"
          style={{ background: "radial-gradient(circle, var(--brand-light), transparent 65%)" }}
        />
      </div>
      <div className="bg-dots-hero absolute inset-0 opacity-40" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-11 animate-rise sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Greeting nombre={nombre} fecha={fecha} />
        <HeroSummary perfilPct={perfilPct} />
      </div>
    </section>
  );
}

function ActivityChart() {
  return (
    <div className="rounded-2xl border border-line bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-sm font-semibold text-muted">Tu actividad</p>
          <p className="mt-1 text-2xl font-extrabold text-heading">7h 22m</p>
        </div>
        <span className="text-xs text-muted">promedio semanal</span>
      </div>
      <div className="mt-5 flex h-28 items-end justify-between gap-2">
        {ACTIVIDAD.map((d) => (
          <div key={d.dia} className="flex flex-1 flex-col items-center gap-2">
            <div className="relative flex w-full flex-1 items-end">
              {d.label && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                  {d.label}
                </span>
              )}
              <div
                className={`w-full rounded-full ${d.label ? "bg-brand-accent" : "bg-surface"}`}
                style={{ height: `${d.h}%` }}
              />
            </div>
            <span className="text-[11px] text-muted">{d.dia}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamCard() {
  return (
    <div className="rounded-2xl border border-line bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <CardHead icon={<Users size={15} />} titulo="Tu equipo" />
      <div className="mt-4 grid grid-cols-4 gap-2">
        {EQUIPO.map((m, i) => (
          <div key={m.nombre} className="flex flex-col items-center text-center">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
              {iniciales(m.nombre)}
            </div>
            <p className="mt-1.5 w-full truncate text-[11px] font-semibold text-ink">{m.nombre.split(" ")[0]}</p>
            <p className="w-full truncate text-[10px] text-muted">{m.rol}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoursesCard() {
  return (
    <div className="rounded-2xl border border-line bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <CardHead icon={<GraduationCap size={15} />} titulo="Cursos y webinars" />
      <ul className="mt-4 space-y-2">
        {CURSOS.map((c) => (
          <li key={c.titulo} className="rounded-xl border border-line bg-surface/50 p-3">
            <p className="text-sm font-semibold text-ink">{c.titulo}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
              <CalendarClock size={12} /> {c.fecha}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DocumentsCard() {
  return (
    <div className="rounded-2xl border border-line bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <CardHead icon={<FileText size={15} />} titulo="Documentos" />
      <ul className="mt-4 space-y-2">
        {DOCUMENTOS.map((d) => (
          <li key={d.nombre} className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-surface">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
              <FileText size={16} />
            </span>
            <span className="flex-1 text-sm font-semibold text-ink">{d.nombre}</span>
            <span className="rounded-md bg-surface px-1.5 py-0.5 text-[10px] font-bold text-muted">{d.tipo}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GoalsCard() {
  return (
    <section className="rounded-2xl border border-line bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <h2 className="font-bold text-heading">Tus objetivos</h2>
      <p className="mt-1 text-xs text-muted">Pensados para acompañar tus primeras 2 semanas.</p>
      <ul className="mt-4 space-y-4">
        {OBJETIVOS.map((o) => (
          <li key={o.titulo}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-ink">{o.titulo}</span>
              <span className="text-xs font-bold text-brand-accent-dark">{o.pct}%</span>
            </div>
            <ProgressBar pct={o.pct} height="h-2" className="mt-1.5" />
          </li>
        ))}
      </ul>
    </section>
  );
}

function CardHead({ icon, titulo }: { icon: React.ReactNode; titulo: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-brand">{icon}</span>
      <h2 className="font-bold text-heading">{titulo}</h2>
    </div>
  );
}
