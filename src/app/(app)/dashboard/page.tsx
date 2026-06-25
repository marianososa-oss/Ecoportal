import {
  Bell,
  Search,
  Video,
  CheckCircle2,
  ArrowUpRight,
  FileText,
  GraduationCap,
  Cake,
  CalendarClock,
  Users,
} from "lucide-react";
import { TaskTracker, type Tarea } from "@/components/dashboard/TaskTracker";
import { ProgressRing, ProgressBar } from "@/components/dashboard/Progress";

export const metadata = { title: "Mi tablero" };

/* ── Datos de muestra (luego salen de la base + Google Calendar) ─────────── */
const USUARIO = { nombre: "Daniela", apellido: "Gómez", puesto: "Marketing", perfil: 95 };

const EQUIPO = [
  { nombre: "Lucía Green", rol: "Líder de equipo" },
  { nombre: "Martín Fell", rol: "Comercial" },
  { nombre: "Ana Ferro", rol: "Ingeniería" },
  { nombre: "Kevin Luz", rol: "Diseño" },
];

const TAREAS: Tarea[] = [
  { id: 1, titulo: "Conocé a tu equipo", deadline: "Hoy, 10:00", encargado: "Lucía Green", estado: "completa" },
  { id: 2, titulo: "Pedí tus accesos a Sistemas", deadline: "Hoy", encargado: "Jorge Ríos", estado: "completa" },
  { id: 3, titulo: "Leé el manual de marca", deadline: "Hoy", encargado: "Lucía Green", estado: "pendiente", destacada: true },
  { id: 4, titulo: "Revisá el proyecto en curso", deadline: "Hoy", encargado: "Martín Fell", estado: "en-curso" },
  { id: 5, titulo: "Leé el manual del empleado", deadline: "Mañana, 14:00", encargado: "Ana Ferro", estado: "pendiente" },
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

const EVENTOS = [
  { titulo: "Capacitación: Cotizador CT01", hora: "Hoy · 15:00", tipo: "capacitacion" as const },
  { titulo: "Cumple de Martín Fell", hora: "Mañana", tipo: "cumple" as const },
  { titulo: "Reunión mensual de área", hora: "Vie · 10:00", tipo: "evento" as const },
];

const ACTIVIDAD = [
  { dia: "Lu", h: 42 }, { dia: "Ma", h: 55 }, { dia: "Mi", h: 38 },
  { dia: "Ju", h: 70 }, { dia: "Vi", h: 100, label: "8h 13m" },
  { dia: "Sa", h: 22 }, { dia: "Do", h: 16 },
];

const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const DOW = ["lun","mar","mié","jue","vie","sáb","dom"];

function iniciales(nombre: string) {
  return nombre.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}
const AVATAR_COLORS = ["bg-brand", "bg-brand-accent", "bg-brand-light", "bg-navy-2", "bg-brand-accent-dark"];

export default function DashboardPage() {
  const now = new Date();
  const fechaLarga = `${now.getDate()} de ${MESES[now.getMonth()]} de ${now.getFullYear()}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Topbar */}
      <div className="flex flex-col gap-4 animate-rise sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-heading sm:text-3xl">
            ¡Hola, {USUARIO.nombre}! 👋
          </h1>
          <p className="mt-0.5 text-sm text-muted">{fechaLarga}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              placeholder="Buscar…"
              className="w-56 rounded-full border border-line bg-card py-2 pl-9 pr-4 text-sm outline-none ring-brand/30 transition focus:w-64 focus:ring-2"
            />
          </div>
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card text-brand transition hover:bg-surface">
            <Bell size={17} />
            <span className="absolute right-2 top-2 h-2 w-2 animate-pulse rounded-full bg-brand-accent" />
          </button>
        </div>
      </div>

      {/* Grilla principal */}
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {/* Columna izquierda (2/3) */}
        <div className="space-y-5 lg:col-span-2">
          {/* Perfil + stats + actividad */}
          <div className="grid gap-5 md:grid-cols-5">
            <Reveal delay={40} className="md:col-span-2">
              <ProfileCard />
            </Reveal>
            <div className="space-y-5 md:col-span-3">
              <div className="grid grid-cols-2 gap-5">
                <Reveal delay={90}>
                  <StatCard icon={<Video size={16} />} titulo="Reuniones" valor="2/3" pct={66} />
                </Reveal>
                <Reveal delay={140}>
                  <StatCard icon={<CheckCircle2 size={16} />} titulo="Tareas completas" valor="3/10" pct={32} />
                </Reveal>
              </div>
              <Reveal delay={190}>
                <ActivityChart />
              </Reveal>
            </div>
          </div>

          {/* Equipo + Cursos */}
          <div className="grid gap-5 md:grid-cols-2">
            <Reveal delay={240}><TeamCard /></Reveal>
            <Reveal delay={290}><CoursesCard /></Reveal>
          </div>

          {/* Calendario + Documentos */}
          <div className="grid gap-5 md:grid-cols-2">
            <Reveal delay={340}><CalendarCard now={now} /></Reveal>
            <Reveal delay={390}><DocumentsCard /></Reveal>
          </div>
        </div>

        {/* Columna derecha (1/3) */}
        <div className="space-y-5">
          <Reveal delay={120}><TaskTracker tareas={TAREAS} /></Reveal>
          <Reveal delay={220}><UpcomingEvents /></Reveal>
          <Reveal delay={320}><GoalsCard /></Reveal>
        </div>
      </div>
    </div>
  );
}

/** Envoltorio de entrada escalonada (respeta prefers-reduced-motion vía CSS). */
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

function ProfileCard() {
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-navy-2 p-5 text-white shadow-card transition-all duration-300 hover:shadow-lift">
      <span className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl transition-transform duration-500 group-hover:scale-125" />
      <div className="flex items-center justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/15 text-3xl font-extrabold backdrop-blur-sm">
          {iniciales(`${USUARIO.nombre} ${USUARIO.apellido}`)}
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-lg font-bold leading-tight">
          {USUARIO.nombre} {USUARIO.apellido}
        </p>
        <p className="text-sm text-white/75">{USUARIO.puesto}</p>
      </div>
      <div className="mt-4 flex items-center justify-center gap-3">
        <ProgressRing pct={USUARIO.perfil} />
        <div>
          <p className="text-2xl font-extrabold leading-none">{USUARIO.perfil}%</p>
          <p className="text-xs text-white/70">perfil completo</p>
        </div>
      </div>
      <button className="mt-4 w-full rounded-xl bg-white/15 py-2.5 text-xs font-semibold backdrop-blur-sm transition hover:bg-white/25">
        + Completá tu perfil
      </button>
    </div>
  );
}

function StatCard({ icon, titulo, valor, pct }: { icon: React.ReactNode; titulo: string; valor: string; pct: number }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-center gap-2 text-muted">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface text-brand">{icon}</span>
        <span className="text-xs font-semibold">{titulo}</span>
      </div>
      <p className="mt-3 text-2xl font-extrabold text-heading">{valor}</p>
      <div className="mt-2 flex items-center gap-2">
        <ProgressBar pct={pct} className="flex-1" />
        <span className="text-xs font-bold text-brand-accent-dark">{pct}%</span>
      </div>
    </div>
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

function CalendarCard({ now }: { now: Date }) {
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7; // lunes=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const celdas: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  return (
    <div className="rounded-2xl border border-line bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <CardHead icon={<CalendarClock size={15} />} titulo={`${MESES[month][0].toUpperCase()}${MESES[month].slice(1)} ${year}`} />
      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {DOW.map((d) => (
          <span key={d} className="text-[10px] font-bold uppercase text-muted">{d}</span>
        ))}
        {celdas.map((d, i) => (
          <div key={i} className="flex aspect-square items-center justify-center">
            {d && (
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                  d === today ? "bg-brand font-bold text-white" : "text-ink hover:bg-surface"
                }`}
              >
                {d}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const EVENT_ICON = {
  capacitacion: <GraduationCap size={15} />,
  cumple: <Cake size={15} />,
  evento: <CalendarClock size={15} />,
};

function UpcomingEvents() {
  return (
    <section className="rounded-2xl border border-line bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <CardHead icon={<CalendarClock size={15} />} titulo="Lo que se viene en tu área" />
      <ul className="mt-4 space-y-2">
        {EVENTOS.map((e) => (
          <li key={e.titulo} className="flex items-center gap-3 rounded-xl border border-line bg-surface/40 p-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
              {EVENT_ICON[e.tipo]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{e.titulo}</p>
              <p className="text-xs text-muted">{e.hora}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function GoalsCard() {
  return (
    <section className="rounded-2xl border border-line bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <h2 className="font-bold text-heading">Tus objetivos</h2>
      <p className="mt-1 text-xs text-muted">
        Pensados para acompañar tus primeras 2 semanas.
      </p>
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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-brand">{icon}</span>
        <h2 className="font-bold text-heading">{titulo}</h2>
      </div>
      <button className="flex items-center gap-0.5 text-xs font-semibold text-brand hover:text-brand-light">
        Ver todo <ArrowUpRight size={12} />
      </button>
    </div>
  );
}
