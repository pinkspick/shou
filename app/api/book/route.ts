import { NextResponse } from "next/server";

/**
 * POST → record an appointment request.
 *
 * For now this logs to the server console and "sends" a confirmation email via
 * a Resend placeholder (also a log). Swap `sendConfirmationEmail` for a real
 * Resend call once RESEND_API_KEY is wired — the request shape stays the same.
 */
export const runtime = "nodejs";

type BookBody = {
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  mode?: "in-person" | "virtual";
  type?: string;
  notes?: string;
};

function genRef(): string {
  return `APT-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

async function sendConfirmationEmail(to: string, ref: string, body: BookBody) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Placeholder — log instead of sending.
    console.log(
      `[book] (resend placeholder) confirmation → ${to || "no-email"} ref=${ref}`,
      body,
    );
    return;
  }
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Lumière <atelier@lumiere.example>",
        to,
        subject: `Your Lumière appointment — ${ref}`,
        text:
          `Hi ${body.name ?? "there"},\n\n` +
          `We've received your ${body.mode === "virtual" ? "virtual" : "in-person"} ` +
          `appointment request (${body.type ?? "consultation"}) for ${body.date ?? "your chosen date"} ` +
          `at ${body.time ?? "your chosen time"}.\n\n` +
          `We'll confirm within 2 hours. Reference: ${ref}.\n\n— Lumière`,
      }),
    });
  } catch (err) {
    console.error("[book] resend failed", err);
  }
}

export async function POST(req: Request) {
  let body: BookBody;
  try {
    body = (await req.json()) as BookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const ref = genRef();
  console.log("[book] appointment request", { ref, ...body });

  await sendConfirmationEmail(body.email ?? "", ref, body);

  return NextResponse.json({ ok: true, ref });
}
