export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-7 text-center sm:flex-row sm:text-left">
        <p className="text-sm text-muted">
          © {year} Ecocontrol · Mi Portal — espacio interno del equipo.
        </p>
        <a
          href="https://www.ecocontrol.com.ar"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-bold text-brand transition hover:text-brand-light"
        >
          www.ecocontrol.com.ar
        </a>
      </div>
    </footer>
  );
}
