"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const ERRORS: Record<string, string> = {
  google_no_configurado: "El login con Google todavía no está configurado.",
  google_cancelado: "Cancelaste el ingreso con Google.",
  estado_invalido: "La sesión de ingreso expiró. Probá de nuevo.",
  google_token: "No pudimos validar tu cuenta. Probá de nuevo.",
  dominio_no_permitido: "Tenés que ingresar con tu cuenta @ecocontrol.com.ar.",
  base_de_datos: "Hubo un problema al cargar tu perfil. Probá de nuevo.",
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  );
}

function LoginCard() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/dashboard";
  const errorCode = params.get("error");
  const googleHref = `/api/auth/google?next=${encodeURIComponent(next)}`;

  return (
    <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-white/95 p-8 shadow-2xl backdrop-blur">
      <div className="flex justify-center">
        <span className="inline-flex rounded-xl bg-white p-2 shadow-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-ecocontrol.svg" alt="Ecocontrol" className="h-9 w-auto" />
        </span>
      </div>
      <h1 className="mt-6 text-center text-xl font-extrabold text-brand-dark">
        Mi Portal
      </h1>
      <p className="mt-1 text-center text-sm text-muted">
        Ingresá con tu cuenta de Ecocontrol para entrar a tu espacio personal.
      </p>

      {errorCode && (
        <p className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {ERRORS[errorCode] ?? "No pudimos iniciar sesión. Probá de nuevo."}
        </p>
      )}

      <a
        href={googleHref}
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-white px-4 py-3.5 text-sm font-bold text-ink transition hover:bg-surface"
      >
        <GoogleIcon />
        Entrar con Google
      </a>
      <p className="mt-3 text-center text-xs text-muted">
        Solo cuentas <strong>@ecocontrol.com.ar</strong>. Tu sesión queda
        recordada en este dispositivo.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-navy px-5">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/eco/shelter.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-navy/95 via-navy/85 to-navy-2/80" />
      <div className="bg-dots-hero absolute inset-0 opacity-40" />
      <Suspense>
        <LoginCard />
      </Suspense>
    </main>
  );
}
