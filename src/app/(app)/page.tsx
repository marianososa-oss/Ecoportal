import Link from "next/link";
import {
  Image as ImageIcon,
  PenLine,
  Compass,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  {
    href: "/perfil",
    icon: ImageIcon,
    titulo: "Imagen de perfil",
    desc: "Tu placa institucional con nombre y área, lista para descargar.",
    cta: "Crear mi imagen",
    destacado: true,
  },
  {
    href: "/firma",
    icon: PenLine,
    titulo: "Firma de mail",
    desc: "Tu firma corporativa lista para pegar en Gmail en un clic.",
    cta: "Crear mi firma",
  },
  {
    href: "/dashboard",
    icon: LayoutGrid,
    titulo: "Mi tablero",
    desc: "Agenda, tareas del día, equipo y eventos de tu área, todo junto.",
    cta: "Ver mi tablero",
  },
  {
    href: undefined,
    icon: Compass,
    titulo: "Tour guiado",
    desc: "Un recorrido para conocer toda la web interna de Ecocontrol.",
    cta: "Muy pronto",
  },
] as const;

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="max-w-3xl animate-rise">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1 text-xs font-semibold text-brand shadow-card">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-accent" />
          Bienvenida/o a Ecocontrol
        </span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-heading text-balance sm:text-5xl">
          Tu portal personal del equipo
        </h1>
        <p className="mt-3 text-lg text-muted text-pretty">
          Dejá tu perfil listo en minutos y, muy pronto, vas a tener acá tu
          agenda, tus tareas y todo lo que se viene en tu área.
        </p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {FEATURES.map((f, i) => (
          <FeatureCard key={f.titulo} {...f} delay={i * 70} />
        ))}
      </div>
    </div>
  );
}

function FeatureCard({
  href,
  icon: Icon,
  titulo,
  desc,
  cta,
  destacado = false,
  delay = 0,
}: {
  href?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  titulo: string;
  desc: string;
  cta: string;
  destacado?: boolean;
  delay?: number;
}) {
  const inner = (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={[
        "group flex h-full animate-rise flex-col rounded-2xl border p-6 shadow-card transition-all duration-300",
        href
          ? "cursor-pointer border-line bg-card hover:-translate-y-1 hover:shadow-lift hover:border-brand/30"
          : "border-dashed border-line bg-card/60",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300",
          destacado ? "bg-brand text-white" : "bg-surface text-brand",
          href ? "group-hover:scale-110 group-hover:-rotate-3" : "",
        ].join(" ")}
      >
        <Icon size={22} />
      </div>
      <h2 className="mt-4 text-lg font-bold text-heading">{titulo}</h2>
      <p className="mt-1 flex-1 text-sm text-muted">{desc}</p>
      <span
        className={[
          "mt-4 inline-flex items-center gap-1.5 text-sm font-semibold",
          href ? "text-brand" : "text-muted",
        ].join(" ")}
      >
        {cta}
        {href && (
          <ArrowRight
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        )}
      </span>
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}
