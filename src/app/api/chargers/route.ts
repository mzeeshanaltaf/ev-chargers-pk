import { NextResponse } from "next/server";
import { readSession } from "@/lib/session";

const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL!;
const API_KEY = process.env.N8N_API_KEY!;

const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });

export async function GET() {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({ event_type: "get_ev_chargers" }),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch chargers" },
        { status: 502 }
      );
    }

    const data = await res.json();
    // Response format: [{ result: { open: [...], closed: [...] } }]
    const result = data?.[0]?.result;
    if (result) {
      const chargers = [
        ...(result.open || []).map((c: object) => ({ ...c, is_open: true })),
        ...(result.closed || []).map((c: object) => ({ ...c, is_open: false })),
      ];
      return NextResponse.json(chargers);
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to backend" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await readSession())) return unauthorized();

    const body = await request.json();

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        event_type: "insert_ev_charger",
        ...body,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to insert charger" },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to backend" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await readSession())) return unauthorized();

    const body = await request.json();

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        event_type: "update_ev_charger",
        is_active: true,
        ...body,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to update charger" },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to backend" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await readSession())) return unauthorized();

    const { id } = await request.json();

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({ event_type: "delete_ev_charger", id }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to delete charger" },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to backend" },
      { status: 500 }
    );
  }
}
