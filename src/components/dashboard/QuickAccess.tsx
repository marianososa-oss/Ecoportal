import { Gauge, GraduationCap, Mail, CalendarDays, FolderOpen, ArrowUpRight } from "lucide-react";

const ACCESOS = [
  { label: "EcoMonitor", desc: "Monitoreo HVAC", href: "https://eco-monitor-zeta.vercel.app", icon: Gauge, color: "text-brand" },
  { label: "Capacitaciones", desc: "Cursos internos", href: "https://ecocontrol-capacitaciones.vercel.app", icon: GraduationCap, color: "text-brand-accent-dark" },
  { label: "Gmail", desc: "Tu correo", href: "https://mail.google.com", icon: Mail, color: "text-brand" },
  { label: "Calendar", desc: "Tu agenda", href: "https://calendar.google.com", icon: CalendarDays, color: "text-brand-accent-dark" },
  { label: "Drive", desc: "Tus archivos", href: "https://drive.google.com", icon: FolderOpen, color: "text-brand" },
];

export function QuickAccess() {
  return (
    <section className="eco-sheen rounded-2xl border border-line bg-card p-5 shadow-card">
      <h2 className="font-bold text-heading">Accesos rápidos</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {ACCESOS.map((a) => {
          const Icon = a.icon;
          return (
            <a
              key={a.label}
              href={a.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-2 rounded-xl border border-line bg-surface/50 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-card"
            >
              <div className="flex items-center justify-between">
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg bg-card ${a.color}`}>
                  <Icon size={17} />
                </span>
                <ArrowUpRight size={14} className="text-muted transition group-hover:text-brand" />
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
