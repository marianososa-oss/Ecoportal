import Link from "next/link";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-card/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <div className="flex items-center gap-3">
          <Logo height={32} />
          <span className="hidden h-5 w-px bg-line sm:block" />
          <Link
            href="/"
            className="hidden text-sm font-bold tracking-wide text-heading sm:block"
          >
            Mi Portal
          </Link>
        </div>

        <nav className="flex items-center gap-1">
          <NavLink href="/">Inicio</NavLink>
          <NavLink href="/perfil">Mi perfil</NavLink>
          <ThemeToggle className="ml-1" />
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-full px-3.5 py-2 text-sm font-semibold text-muted transition hover:bg-surface hover:text-brand"
    >
      {children}
    </Link>
  );
}
