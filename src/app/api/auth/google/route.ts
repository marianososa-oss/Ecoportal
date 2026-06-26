import { NextResponse, type NextRequest } from "next/server";
import { buildGoogleAuthUrl } from "@/lib/google";

export const dynamic = "force-dynamic";
const STATE_COOKIE = "ecoportal_oauth_state";

export async function GET(req: NextRequest) {
  const next = req.nextUrl.searchParams.get("next") ?? "/dashboard";
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ??
    `${req.nextUrl.origin}/api/auth/google/callback`;

  const nonce = crypto.randomUUID();
  const state = `${nonce}|${next}`;

  let url: string;
  try {
    url = buildGoogleAuthUrl({ redirectUri, state });
  } catch {
    return NextResponse.redirect(new URL("/login?error=google_no_configurado", req.nextUrl.origin));
  }

  const res = NextResponse.redirect(url);
  res.cookies.set(STATE_COOKIE, nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
