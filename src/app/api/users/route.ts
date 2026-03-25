import { NextResponse } from "next/server";

const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL!;
const API_KEY = process.env.N8N_API_KEY!;

export async function POST(request: Request) {
  try {
    const { user_name } = await request.json();

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({ event_type: "register_user", user_name }),
    });

    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data[0] : data);
  } catch {
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}
