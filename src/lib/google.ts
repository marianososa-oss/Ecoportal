import "server-only";

/**
 * Login con Google (OAuth 2.0) restringido a @ecocontrol.com.ar + lectura de
 * Google Calendar para mostrar la agenda en el tablero.
 */

export const GOOGLE_HOSTED_DOMAIN = "ecocontrol.com.ar";

const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const CALENDAR_ENDPOINT =
  "https://www.googleapis.com/calendar/v3/calendars/primary/events";

const SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/calendar.readonly",
];

export type GoogleClaims = {
  sub: string;
  email: string;
  email_verified?: boolean;
  hd?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
};

function clientId() {
  const id = process.env.GOOGLE_CLIENT_ID;
  if (!id) throw new Error("Falta GOOGLE_CLIENT_ID.");
  return id;
}
function clientSecret() {
  const s = process.env.GOOGLE_CLIENT_SECRET;
  if (!s) throw new Error("Falta GOOGLE_CLIENT_SECRET.");
  return s;
}

export function buildGoogleAuthUrl(opts: { redirectUri: string; state: string }): string {
  const params = new URLSearchParams({
    client_id: clientId(),
    redirect_uri: opts.redirectUri,
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline",
    include_granted_scopes: "true",
    prompt: "consent",
    hd: GOOGLE_HOSTED_DOMAIN,
    state: opts.state,
  });
  return `${AUTH_ENDPOINT}?${params.toString()}`;
}

type TokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token: string;
};

export async function exchangeCodeForTokens(opts: {
  code: string;
  redirectUri: string;
}): Promise<TokenResponse> {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: opts.code,
      client_id: clientId(),
      client_secret: clientSecret(),
      redirect_uri: opts.redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) throw new Error(`Google token error: ${res.status} ${await res.text()}`);
  return res.json();
}

/** Nuevo access token a partir del refresh token guardado. */
export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  if (!refreshToken) return null;
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId(),
      client_secret: clientSecret(),
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

export function decodeIdToken(idToken: string): GoogleClaims {
  const parts = idToken.split(".");
  if (parts.length !== 3) throw new Error("id_token inválido.");
  return JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
}

export function isCorporateEmail(claims: GoogleClaims): boolean {
  const domain = claims.email?.split("@")[1]?.toLowerCase();
  return (
    claims.email_verified !== false &&
    (claims.hd === GOOGLE_HOSTED_DOMAIN || domain === GOOGLE_HOSTED_DOMAIN)
  );
}

export type CalEvent = {
  id: string;
  titulo: string;
  inicio: string | null;
  todoElDia: boolean;
};

/** Próximos eventos del Google Calendar del usuario (máx 8). */
export async function getUpcomingCalendarEvents(refreshToken: string): Promise<CalEvent[]> {
  const accessToken = await refreshAccessToken(refreshToken);
  if (!accessToken) return [];

  const params = new URLSearchParams({
    timeMin: new Date().toISOString(),
    maxResults: "8",
    singleEvents: "true",
    orderBy: "startTime",
  });
  const res = await fetch(`${CALENDAR_ENDPOINT}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return [];

  const data = (await res.json()) as {
    items?: Array<{
      id: string;
      summary?: string;
      start?: { dateTime?: string; date?: string };
    }>;
  };

  return (data.items ?? []).map((e) => ({
    id: e.id,
    titulo: e.summary ?? "(sin título)",
    inicio: e.start?.dateTime ?? e.start?.date ?? null,
    todoElDia: !e.start?.dateTime,
  }));
}
