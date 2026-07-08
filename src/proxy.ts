import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, getSession } from "@/lib/auth";

/** Todo el portal requiere sesión (empleado @ecocontrol.com.ar). */
export async function proxy(req: NextRequest) {
  // Si el login aún no está configurado, no bloqueamos (evita dejar el sitio
  // inaccesible antes de cargar las credenciales).
  if (!process.env.SESSION_SECRET || !process.env.GOOGLE_CLIENT_ID) {
    return NextResponse.next();
  }
  // Solo dev: bypass para previsualizar el portal logueado.
  if (process.env.NODE_ENV !== "production" && process.env.MOCK_USER === "1") {
    return NextResponse.next();
  }
  const session = await getSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    const url = new URL("/login", req.url);
    if (req.nextUrl.pathname !== "/") {
      url.searchParams.set("next", req.nextUrl.pathname);
    }
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // Protege todo menos /login, las rutas de auth, assets y estáticos.
  matcher: ["/((?!login|api/auth|_next/static|_next/image|favicon|.*\\.).*)"],
};
