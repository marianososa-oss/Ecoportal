"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Image as ImageIcon,
  PenLine,
  Compass,
  Menu,
  X,
  Sparkles,
  LogOut,
  User as UserIcon,
  Users,
  ClipboardCheck,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import type { Identidad } from "@/lib/identidad";

type Item = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  soon?: boolean;
};

const NAV: Item[] = [
  { href: "/", label: "Mi día", icon: LayoutGrid },
  { href: "/gente", label: "Gente", icon: Users },
  { href: "/autogestion", label: "Autogestión", icon: ClipboardCheck },
  { href: "/perfil", label: "Imagen de perfil", icon: ImageIcon },
  { href: "/firma", label: "Firma de mail", icon: PenLine },
  { href: "/tour", label: "Tour guiado", icon: Compass, soon: true },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/** Fondo navy con textura + glow (compartido desktop/drawer). */
function NavyBackdrop() {
  return (
    <>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-2 via-navy to-navy" />
      <div aria-hidden className="bg-dots-hero absolute inset-0 -z-10 opacity-[0.35]" />
      <div
        aria-hidden
        className="absolute -left-20 -top-24 -z-10 h-72 w-72 rounded-full blur-[90px]"
        style={{ background: "radial-gradient(circle, var(--brand-light), transparent 68%)", opacity: 0.35 }}
      />
    </>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        const content = (
          <span
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
              active
                ? "bg-white/[0.14] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                : "text-white/55 hover:bg-white/[0.07] hover:text-white",
              item.soon && "cursor-default opacity-45 hover:bg-transparent hover:text-white/55",
            )}
          >
            <Icon
              size={18}
              className={cn(
                "shrink-0 transition-transform duration-200",
                active ? "text-brand-accent" : "",
                !active && !item.soon && "group-hover:scale-110",
              )}
            />
            <span className="flex-1">{item.label}</span>
            {item.soon && (
              <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/60">
                pronto
              </span>
            )}
            {active && <span className="absolute right-2.5 h-1.5 w-1.5 rounded-full bg-brand-accent" />}
          </span>
        );
        if (item.soon) return <div key={item.href}>{content}</div>;
        return (
          <Link key={item.href} href={item.href} onClick={onNavigate}>
            {content}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5 px-1">
      <span className="inline-flex rounded-lg bg-white p-1.5 shadow-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-ecocontrol.svg" alt="Ecocontrol" className="h-6 w-auto" />
      </span>
      <span className="text-sm font-extrabold tracking-tight text-white">Mi Portal</span>
    </Link>
  );
}

function WelcomeChip() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3">
      <p className="flex items-center gap-1.5 text-xs font-bold text-white">
        <Sparkles size={13} className="text-brand-accent" /> Bienvenida/o
      </p>
      <p className="mt-0.5 text-[11px] leading-snug text-white/60">
        Pronto vas a entrar con tu cuenta de Ecocontrol.
      </p>
    </div>
  );
}

function UserCard({ user }: { user: Identidad }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.06] p-2.5">
      <div className="flex items-center gap-2.5">
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-white/15" />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-accent text-white">
            <UserIcon size={16} />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold text-white">{user.nombre}</p>
          <p className="truncate text-[10px] text-white/55">{user.area || user.email}</p>
        </div>
      </div>
      <a
        href="/api/auth/logout"
        className="mt-2 flex items-center justify-center gap-1.5 rounded-lg border border-white/10 py-1.5 text-[11px] font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
      >
        <LogOut size={12} /> Cerrar sesión
      </a>
    </div>
  );
}

export function Sidebar({ user }: { user: Identidad | null }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Sidebar fijo (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col gap-6 overflow-hidden border-r border-white/10 px-4 py-6 lg:flex">
        <NavyBackdrop />
        <Brand />
        <NavList />
        <div className="flex flex-col gap-3">
          {user ? <UserCard user={user} /> : <WelcomeChip />}
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
            <span className="text-xs font-semibold text-white/70">Tema</span>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Topbar (mobile) */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between overflow-hidden border-b border-white/10 px-4 lg:hidden">
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-2 to-navy" />
        <Brand />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* Drawer (mobile) */}
      <div
        className={cn("fixed inset-0 z-40 lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 flex w-72 max-w-[82%] flex-col gap-6 overflow-hidden border-r border-white/10 px-4 py-6 shadow-lift transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <NavyBackdrop />
          <div className="flex items-center justify-between">
            <Brand />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70"
            >
              <X size={18} />
            </button>
          </div>
          <NavList onNavigate={() => setOpen(false)} />
          {user ? <UserCard user={user} /> : <WelcomeChip />}
        </aside>
      </div>
    </>
  );
}
