import { NextResponse } from "next/server";

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

    if (!res.ok) {
      return NextResponse.json(
        { authorized: false, message: "Authentication failed" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { authorized: false, message: "Failed to connect to server" },
      { status: 500 }
    );
  }
}
