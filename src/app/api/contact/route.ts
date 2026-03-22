import { NextResponse } from "next/server";

const CONTACT_WEBHOOK_URL =
  "https://n8n.zeeshanai.cloud/webhook/3698c537-566e-4f92-90e9-9bf374619b7e";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(CONTACT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.N8N_API_KEY || "",
      },
      body: JSON.stringify(body),
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
