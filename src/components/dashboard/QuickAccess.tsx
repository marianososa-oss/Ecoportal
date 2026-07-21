import { Gauge, GraduationCap, Network, Mail, CalendarDays, FolderOpen, ArrowUpRight } from "lucide-react";

/* Cada acceso toma un color de la paleta de servicios de Ecocontrol,
   la misma franja que aparece en la placa y en el banner del mail. */
const ACCESOS = [
  { label: "EcoMonitor", desc: "Monitoreo HVAC", href: "https://eco-monitor-zeta.vercel.app", icon: Gauge, tone: "var(--eco-humedad)" },
  { label: "Capacitaciones", desc: "Cursos internos", href: "https://ecocontrol-capacitaciones.vercel.app", icon: GraduationCap, tone: "var(--eco-aire)" },
  { label: "Organigrama", desc: "Estructura", href: "https://script.google.com/a/macros/ecocontrol.com.ar/s/AKfycbxMuzaZYNhfaPqTEedHPN7ht1L23k4hmhu8uTD_WDYiE-dbPzhJjaqqEp97eUqlszMo/exec", icon: Network, tone: "var(--eco-renovables)" },
  { label: "Gmail", desc: "Tu correo", href: "https://mail.google.com", icon: Mail, tone: "var(--eco-presion)" },
  { label: "Calendar", desc: "Tu agenda", href: "https://calendar.google.com", icon: CalendarDays, tone: "var(--eco-monitoreo)" },
  { label: "Drive", desc: "Tus archivos", href: "https://drive.google.com", icon: FolderOpen, tone: "var(--eco-explosivos)" },
];

export function QuickAccess() {
  return (
    <section className="eco-card p-5">
      <h2 className="font-bold text-heading">Accesos rápidos</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {ACCESOS.map((a) => {
          const Icon = a.icon;
          return (
            <a
              key={a.label}
              href={a.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ["--tone" as string]: a.tone }}
              className="eco-tile group relative flex flex-col gap-2 overflow-hidden rounded-xl border border-line bg-surface/50 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                style={{ background: "var(--tone)" }}
              />
              <div className="flex items-center justify-between">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{
                    color: "var(--tone)",
                    background: "color-mix(in srgb, var(--tone) 14%, transparent)",
                  }}
                >
                  <Icon size={17} />
                </span>
                <ArrowUpRight size={14} className="text-muted transition group-hover:text-[var(--tone)]" />
              </div>
              <div>
                <p className="text-sm font-bold text-heading">{a.label}</p>
                <p className="text-[11px] text-muted">{a.desc}</p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
