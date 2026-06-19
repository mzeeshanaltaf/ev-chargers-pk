import { NextResponse } from "next/server";
import { createSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL!;
const API_KEY = process.env.N8N_API_KEY!;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { authorized: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        event_type: "authenticate_user",
        email,
        password,
      }),
    });

    // Map upstream failures to a single generic 401 so the client can't
    // distinguish "wrong password" from "backend down".
    if (!res.ok) {
      return NextResponse.json(
        { authorized: false, message: "Authentication failed" },
        { status: 401 }
      );
    }

    const data = await res.json();

    if (data?.authorized && data?.user) {
      const response = NextResponse.json(data);
      const token = await createSession(data.user);
      response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
      return response;
    }

    return NextResponse.json(
      { authorized: false, message: "Authentication failed" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { authorized: false, message: "Failed to connect to server" },
      { status: 500 }
    );
  }
}

// Logout: clear the session cookie.
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
  return response;
}
