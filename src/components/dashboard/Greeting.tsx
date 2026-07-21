export function Greeting({ nombre, fecha }: { nombre: string; fecha: string }) {
  return (
    <div>
      <p
        className="text-xs font-bold uppercase tracking-[0.24em]"
        style={{ color: "var(--eco-aire)" }}
      >
        Mi día
      </p>
      <h1 className="mt-2 text-3xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-5xl">
        {nombre ? (
          <>
            ¡Hola, <span style={{ color: "var(--eco-aire)" }}>{nombre}</span>!
          </>
        ) : (
          "¡Hola!"
        )}{" "}
        👋
      </h1>
      <p className="mt-2 text-sm text-white/70">{fecha}</p>
    </div>
  );
}
