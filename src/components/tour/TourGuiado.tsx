"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  LayoutGrid,
  Users,
  ClipboardCheck,
  Image as ImageIcon,
  PenLine,
  Gauge,
  PartyPopper,
  ArrowRight,
  ArrowLeft,
  Check,
  RotateCcw,
} from "lucide-react";
import { setTourDoneAction } from "@/lib/actions/tour";

type Paso = {
  icon: React.ElementType;
  tono: string;
  titulo: string;
  bajada: string;
  puntos: string[];
  href?: string;
  cta?: string;
};

const PASOS: Paso[] = [
  {
    icon: Compass,
    tono: "var(--eco-humedad)",
    titulo: "Bienvenido/a a Mi Portal",
    bajada:
      "Este es tu espacio dentro de Ecocontrol: todo lo que necesitás en el día a día, en un solo lugar.",
    puntos: [
      "Entrás con tu cuenta @ecocontrol.com.ar, sin contraseñas nuevas.",
      "Lo que cargues queda guardado y te espera la próxima vez.",
      "En 2 minutos conocés todas las secciones.",
    ],
  },
  {
    icon: LayoutGrid,
    tono: "var(--eco-aire)",
    titulo: "Mi día, tu tablero",
    bajada:
      "La pantalla de inicio te muestra cómo viene tu jornada apenas entrás.",
    puntos: [
      "Tu agenda sincronizada con Google Calendar.",
      "Tus tareas del día: las cargás, las tildás y quedan guardadas.",
      "Lo que se viene en tu área: capacitaciones, reuniones y cumpleaños.",
    ],
    href: "/",
    cta: "Ver Mi día",
  },
  {
    icon: Users,
    tono: "var(--eco-renovables)",
    titulo: "Gente y organigrama",
    bajada:
      "Para saber quién es quién y encontrar a cualquier compañero en un clic.",
    puntos: [
      "Directorio completo por área, con mail directo.",
      "Los cumpleaños del mes, para no perderte ninguno.",
      "Reconocimientos: dejale un mensaje de agradecimiento a un compañero.",
      "El organigrama de la empresa, embebido.",
    ],
    href: "/gente",
    cta: "Ver Gente",
  },
  {
    icon: ClipboardCheck,
    tono: "var(--eco-explosivos)",
    titulo: "Autogestión",
    bajada:
      "Pedidos de vacaciones y licencias, sin mails ni papeles dando vueltas.",
    puntos: [
      "Cargás la solicitud con fechas y motivo.",
      "Seguís el estado: pendiente, aprobada o rechazada.",
      "RRHH la revisa y resuelve desde el mismo panel.",
    ],
    href: "/autogestion",
    cta: "Ver Autogestión",
  },
  {
    icon: ImageIcon,
    tono: "var(--eco-monitoreo)",
    titulo: "Tu imagen de perfil",
    bajada:
      "La placa institucional de Ecocontrol, con tu nombre y tu área, lista para descargar.",
    puntos: [
      "Escribís tu nombre y tu área, y la ves al instante.",
      "La descargás en PNG de 800×800.",
      "Sirve para Teams, WhatsApp y tu foto de Google.",
    ],
    href: "/perfil",
    cta: "Crear mi placa",
  },
  {
    icon: PenLine,
    tono: "var(--eco-presion)",
    titulo: "Tu firma de mail",
    bajada:
      "La firma institucional armada sola, con tus datos y el formato de la empresa.",
    puntos: [
      "Completás nombre, puesto y teléfono.",
      "La copiás con un botón y la pegás en Gmail.",
      "Incluye el logo, el banner y los datos de contacto de Ecocontrol.",
    ],
    href: "/firma",
    cta: "Armar mi firma",
  },
  {
    icon: Gauge,
    tono: "var(--eco-temp-soft)",
    titulo: "Accesos rápidos",
    bajada:
      "Desde Mi día llegás a las herramientas que usás todos los días, sin buscar links.",
    puntos: [
      "EcoMonitor: el monitoreo de equipos HVAC.",
      "Capacitaciones: los cursos internos.",
      "Gmail, Calendar y Drive, con tu cuenta ya iniciada.",
    ],
  },
];

export function TourGuiado({
  nombre,
  yaHecho,
}: {
  nombre: string;
  yaHecho: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [i, setI] = useState(0);
  const [listo, setListo] = useState(yaHecho);

  const total = PASOS.length;
  const paso = PASOS[i];
  const Icon = paso.icon;
  const esUltimo = i === total - 1;
  const pct = Math.round(((i + 1) / total) * 100);

  const terminar = () => {
    setListo(true);
    startTransition(async () => {
      await setTourDoneAction(true);
      router.refresh();
    });
  };

  const rehacer = () => {
    setListo(false);
    setI(0);
    startTransition(async () => {
      await setTourDoneAction(false);
      router.refresh();
    });
  };

  if (listo) {
    return (
      <div className="eco-card mx-auto max-w-2xl p-8 text-center sm:p-12">
        <span
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{
            color: "var(--eco-aire)",
            background: "color-mix(in srgb, var(--eco-aire) 14%, transparent)",
          }}
        >
          <PartyPopper size={30} />
        </span>
        <h2 className="mt-5 text-2xl font-extrabold text-heading">
          ¡Listo{nombre ? `, ${nombre}` : ""}! Ya conocés tu portal
        </h2>
        <p className="mx-auto mt-2 max-w-md text-pretty text-sm text-muted">
          Cuando quieras volver a verlo, el tour queda siempre disponible acá.
          Ahora sí: a arrancar el día.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-light"
          >
            Ir a Mi día <ArrowRight size={16} />
          </Link>
          <button
            type="button"
            onClick={rehacer}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm font-semibold text-muted transition hover:bg-surface hover:text-brand disabled:opacity-50"
          >
            <RotateCcw size={15} /> Hacerlo de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:items-start">
      {/* Índice de pasos */}
      <ol className="eco-card hidden p-3 lg:block">
        {PASOS.map((p, n) => {
          const activo = n === i;
          const hecho = n < i;
          return (
            <li key={p.titulo}>
              <button
                type="button"
                onClick={() => setI(n)}
                style={{ ["--tone" as string]: p.tono }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                  activo ? "bg-surface" : "hover:bg-surface/60"
                }`}
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold"
                  style={
                    activo || hecho
                      ? { background: "var(--tone)", color: "#fff" }
                      : {
                          color: "var(--tone)",
                          background: "color-mix(in srgb, var(--tone) 14%, transparent)",
                        }
                  }
                >
                  {hecho ? <Check size={13} strokeWidth={3} /> : n + 1}
                </span>
                <span
                  className={`min-w-0 flex-1 truncate text-sm ${
                    activo ? "font-bold text-heading" : "text-muted"
                  }`}
                >
                  {p.titulo}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Paso actual */}
      <div className="eco-card p-6 sm:p-8" style={{ ["--tone" as string]: paso.tono }}>
        <div className="flex items-center justify-between gap-4">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{
              color: "var(--tone)",
              background: "color-mix(in srgb, var(--tone) 14%, transparent)",
            }}
          >
            <Icon size={24} />
          </span>
          <span className="text-xs font-bold text-muted">
            Paso {i + 1} de {total}
          </span>
        </div>

        <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-heading">
          {paso.titulo}
        </h2>
        <p className="mt-2 text-pretty text-sm text-muted sm:text-base">{paso.bajada}</p>

        <ul className="mt-5 space-y-2.5">
          {paso.puntos.map((t) => (
            <li key={t} className="flex items-start gap-2.5">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                style={{ background: "var(--tone)" }}
              />
              <span className="text-sm text-ink">{t}</span>
            </li>
          ))}
        </ul>

        {paso.href && (
          <Link
            href={paso.href}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-bold transition hover:bg-surface"
            style={{ color: "var(--tone)" }}
          >
            {paso.cta ?? "Ver la sección"} <ArrowRight size={15} />
          </Link>
        )}

        {/* Progreso + navegación */}
        <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: "var(--tone)" }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setI((n) => Math.max(0, n - 1))}
            disabled={i === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-muted transition hover:bg-surface hover:text-brand disabled:pointer-events-none disabled:opacity-40"
          >
            <ArrowLeft size={15} /> Anterior
          </button>

          {esUltimo ? (
            <button
              type="button"
              onClick={terminar}
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-accent-dark disabled:opacity-50"
            >
              <Check size={16} /> Terminar tour
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setI((n) => Math.min(total - 1, n + 1))}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-light"
            >
              Siguiente <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
