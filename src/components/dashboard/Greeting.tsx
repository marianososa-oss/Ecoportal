export function Greeting({ nombre, fecha }: { nombre: string; fecha: string }) {
  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
        {nombre ? `¡Hola, ${nombre}!` : "¡Hola!"} 👋
      </h1>
      <p className="mt-0.5 text-sm text-white/70">{fecha}</p>
    </div>
  );
}
