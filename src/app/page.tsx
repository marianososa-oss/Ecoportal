import Link from "next/link";
import {
  ImageIcon,
  PenLine,
  Compass,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
          <div className="animate-rise">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand">
              Bienvenida/o a Ecocontrol
            </p>
            <h1 className="mt-2 max-w-3xl text-4xl font-extrabold tracking-tight text-heading sm:text-5xl">
              Tu portal personal del equipo
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted">
              Dejá tu perfil listo en minutos y, muy pronto, vas a tener acá tu
              agenda, tus tareas y todo lo que se viene en tu área.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <FeatureCard
              href="/perfil"
              icon={<ImageIcon />}
              titulo="Imagen de perfil"
              desc="Creá tu placa institucional con tu nombre y tu área. Lista para descargar."
              cta="Crear mi imagen"
              destacado
            />
            <FeatureCard
              href="/firma"
              icon={<PenLine />}
              titulo="Firma de mail"
              desc="Generá tu firma corporativa lista para pegar en Gmail."
              cta="Crear mi firma"
            />
            <FeatureCard
              icon={<Compass />}
              titulo="Tour guiado"
              desc="Un recorrido para conocer toda la web interna de Ecocontrol."
              cta="Muy pronto"
            />
            <FeatureCard
              href="/dashboard"
              icon={<CalendarDays />}
              titulo="Mi tablero"
              desc="Tu agenda, tareas del día, equipo y eventos de tu área en un solo lugar."
              cta="Ver mi tablero"
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function FeatureCard({
  href,
  icon,
  titulo,
  desc,
  cta,
  destacado = false,
}: {
  href?: string;
  icon: React.ReactNode;
  titulo: string;
  desc: string;
  cta: string;
  destacado?: boolean;
}) {
  const inner = (
    <div
      className={`group flex h-full flex-col rounded-2xl border p-6 shadow-card transition ${
        href
          ? "cursor-pointer border-line bg-card hover:-translate-y-0.5 hover:shadow-lift"
          : "border-dashed border-line bg-card/60"
      }`}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
          destacado ? "bg-brand text-white" : "bg-surface text-brand"
        }`}
      >
        {icon}
      </div>
      <h2 className="mt-4 text-lg font-bold text-heading">{titulo}</h2>
      <p className="mt-1 flex-1 text-sm text-muted">{desc}</p>
      <span
        className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold ${
          href ? "text-brand" : "text-muted"
        }`}
      >
        {cta}
        {href && (
          <ArrowRight
            size={15}
            className="transition group-hover:translate-x-0.5"
          />
        )}
      </span>
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}
