import { cookies } from "next/headers";
import type { AuthUser } from "./types";

// Server-side session: a compact HMAC-SHA256-signed token stored in an httpOnly
// cookie. This is the real enforcement for admin mutations — the client-side
// auth state in auth-provider.tsx only drives UI. Uses Web Crypto so it works in
// both the Node.js and Edge runtimes.

export const SESSION_COOKIE = "cm_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
const SECRET = process.env.SESSION_SECRET || "";

export interface SessionPayload {
  id: string;
  email: string;
  name: string;
  exp: number; // unix seconds
}

function base64urlEncode(bytes: Uint8Array): string {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(input: string): Uint8Array {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function sign(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return base64urlEncode(new Uint8Array(sig));
}

/** Build a signed session token for an authenticated user. */
export async function createSession(user: AuthUser): Promise<string> {
  const payload: SessionPayload = {
    id: String(user.id),
    email: user.email,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS,
  };
  const body = base64urlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await sign(body);
  return `${body}.${sig}`;
}

/** Verify a token's signature + expiry; returns the payload or null. */
export async function verifySession(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token || !SECRET) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = await sign(body);
  // Constant-time comparison to avoid signature timing leaks.
  if (sig.length !== expected.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) {
    diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  if (diff !== 0) return null;

  try {
    const payload = JSON.parse(
      new TextDecoder().decode(base64urlDecode(body))
    ) as SessionPayload;
    if (
      typeof payload.exp !== "number" ||
      payload.exp < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/** Read + verify the session from the incoming request's cookies. */
export async function readSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

/** Cookie options used when issuing the session. `maxAge: 0` clears it. */
export function sessionCookieOptions(maxAge: number = MAX_AGE_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
