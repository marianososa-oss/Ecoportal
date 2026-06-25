/**
 * Hero navy con degradé + glows tipo aurora + textura de puntos.
 * Mismo lenguaje visual que el hero de econoticias, para que el portal se
 * sienta de la misma familia.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
  size = "md",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  size?: "md" | "lg";
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy">
      <div className="absolute inset-0 bg-gradient-to-br from-navy/96 via-navy-2/90 to-navy/96" />

      {/* Mesh / aurora */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="animate-aurora absolute -left-32 -top-40 h-[34rem] w-[34rem] rounded-full blur-[110px]"
          style={{ background: "radial-gradient(circle, var(--brand-light), transparent 65%)" }}
        />
        <div
          className="animate-aurora-2 absolute -right-40 -top-10 h-[30rem] w-[30rem] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, var(--brand-accent), transparent 65%)" }}
        />
      </div>
      <div className="bg-dots-hero absolute inset-0 opacity-60" />

      <div
        className={`relative mx-auto max-w-6xl px-5 sm:px-8 ${
          size === "lg" ? "py-14 sm:py-20" : "py-10 sm:py-12"
        }`}
      >
        {eyebrow && (
          <p
            className="animate-rise text-xs font-bold uppercase tracking-[0.24em] text-brand-accent"
            style={{ animationDelay: "0ms" }}
          >
            {eyebrow}
          </p>
        )}
        <h1
          className={`animate-rise mt-2 max-w-3xl text-balance font-extrabold leading-[1.05] tracking-tight text-white ${
            size === "lg" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl"
          }`}
          style={{ animationDelay: "80ms" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="animate-rise mt-3 max-w-2xl text-pretty text-base text-white/80 sm:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            {subtitle}
          </p>
        )}
        {children && (
          <div className="animate-rise mt-6" style={{ animationDelay: "260ms" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
