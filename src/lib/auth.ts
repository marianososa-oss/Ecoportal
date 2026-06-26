import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "ecoportal_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 días — "te recuerda"

export type SessionPayload = { uid: number; email: string };

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("Falta SESSION_SECRET (mínimo 16 caracteres).");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecretKey());
}

export async function getSession(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.uid !== "number" || typeof payload.email !== "string") {
      return null;
    }
    return { uid: payload.uid, email: payload.email };
  } catch {
    return null;
  }
}
