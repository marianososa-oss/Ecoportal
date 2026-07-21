/**
 * Hero navy compartido por TODAS las pantallas del portal.
 * `HeroBackdrop` es el fondo (foto + velo + aurora + puntos) para que el hero
 * de "Mi día" y el de las demás páginas sean exactamente el mismo lenguaje.
 */
export function HeroBackdrop({ image = "/eco/shelter.jpg" }: { image?: string }) {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-right"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/97 via-navy/90 to-navy/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-navy/30" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="animate-aurora absolute -left-24 -top-36 h-[30rem] w-[30rem] rounded-full opacity-70 blur-[120px]"
          style={{ background: "radial-gradient(circle, var(--brand-light), transparent 65%)" }}
        />
      </div>
      <div className="bg-dots-hero absolute inset-0 opacity-40" />
    </>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
  size = "md",
  image = "/eco/shelter.jpg",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  size?: "md" | "lg";
  image?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy">
      <HeroBackdrop image={image} />

      <div
        className={`relative mx-auto max-w-6xl px-5 sm:px-8 ${
          size === "lg" ? "py-16 sm:py-24" : "py-12 sm:py-14"
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
          className={`animate-rise mt-2 max-w-3xl text-balance font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-sm ${
            size === "lg" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl"
          }`}
          style={{ animationDelay: "80ms" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="animate-rise mt-3 max-w-2xl text-pretty text-base text-white/85 sm:text-lg"
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
