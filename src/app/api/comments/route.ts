import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL!;
const API_KEY = process.env.N8N_API_KEY!;

const MAX_CONTENT = 2000;

export async function GET(request: Request) {
  const charger_id = new URL(request.url).searchParams.get("charger_id");
  if (!charger_id) {
    return NextResponse.json({ error: "charger_id is required" }, { status: 400 });
  }

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({ event_type: "get_comments", charger_id }),
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { success } = await checkRateLimit(getClientIp(request), "comments");
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // event_type is a discriminator but must be allowlisted — never forward an
    // arbitrary client-supplied value to the shared n8n webhook, and only
    // forward the explicit fields each operation needs (no body spread).
    const op = body?.event_type;
    let payload: Record<string, unknown>;

    if (op === "add_comment") {
      const charger_id = body?.charger_id;
      const user_id = body?.user_id;
      const content =
        typeof body?.content === "string" ? body.content.trim() : "";
      if (typeof charger_id !== "string" || !charger_id) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
      }
      if (user_id == null || String(user_id).length === 0) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
      }
      if (!content || content.length > MAX_CONTENT) {
        return NextResponse.json({ error: "Invalid comment" }, { status: 400 });
      }
      payload = {
        event_type: "add_comment",
        charger_id,
        user_id: String(user_id),
        content,
      };
    } else if (op === "add_comment_reaction") {
      const comment_id = body?.comment_id;
      const user_id = body?.user_id;
      const reaction_type = body?.reaction_type;
      if (comment_id == null || user_id == null) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
      }
      if (reaction_type !== "like" && reaction_type !== "dislike") {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
      }
      payload = {
        event_type: "add_comment_reaction",
        comment_id: String(comment_id),
        user_id: String(user_id),
        reaction_type,
      };
    } else {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data[0] : data);
  } catch {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
