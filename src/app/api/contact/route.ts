import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

const CONTACT_WEBHOOK_URL =
  "https://n8n.zeeshanai.cloud/webhook/3698c537-566e-4f92-90e9-9bf374619b7e";

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { success } = await checkRateLimit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot: a real user never fills the hidden `website` field. Silently
    // pretend success so bots don't learn they were caught.
    if (typeof body?.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    // Don't forward the honeypot field to n8n.
    const { website: _website, ...payload } = body ?? {};
    void _website;

    const res = await fetch(CONTACT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.N8N_API_KEY || "",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
