import { NextResponse, type NextRequest } from "next/server";
import { exchangeCodeForTokens, decodeIdToken, isCorporateEmail } from "@/lib/google";
import { upsertUserFromGoogle } from "@/db/queries";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
const STATE_COOKIE = "ecoportal_oauth_state";

function fail(origin: string, code: string) {
  return NextResponse.redirect(new URL(`/login?error=${code}`, origin));
}

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const params = req.nextUrl.searchParams;

  if (params.get("error")) return fail(origin, "google_cancelado");

  const code = params.get("code");
  const state = params.get("state") ?? "";
  const [nonce, next = "/dashboard"] = state.split("|");
  const savedNonce = req.cookies.get(STATE_COOKIE)?.value;

  if (!code || !nonce || nonce !== savedNonce) return fail(origin, "estado_invalido");

  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ?? `${origin}/api/auth/google/callback`;

  let claims, refreshToken: string | undefined;
  try {
    const tokens = await exchangeCodeForTokens({ code, redirectUri });
    claims = decodeIdToken(tokens.id_token);
    refreshToken = tokens.refresh_token;
  } catch {
    return fail(origin, "google_token");
  }

  if (!isCorporateEmail(claims)) return fail(origin, "dominio_no_permitido");

  let user;
  try {
    user = await upsertUserFromGoogle({
      sub: claims.sub,
      email: claims.email,
      name: claims.name,
      givenName: claims.given_name,
      familyName: claims.family_name,
      picture: claims.picture,
      refreshToken,
    });
  } catch {
    return fail(origin, "base_de_datos");
  }

  const token = await signSession({ uid: user.id, email: user.email });
  const dest = next.startsWith("/") ? next : "/dashboard";

  const res = NextResponse.redirect(new URL(dest, origin));
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  res.cookies.delete(STATE_COOKIE);
  return res;
}
