import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL!;
const API_KEY = process.env.N8N_API_KEY!;

const MAX_NAME = 60;

export async function POST(request: Request) {
  try {
    const { success } = await checkRateLimit(getClientIp(request), "users");
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const user_name =
      typeof body?.user_name === "string" ? body.user_name.trim() : "";
    if (!user_name || user_name.length > MAX_NAME) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

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
