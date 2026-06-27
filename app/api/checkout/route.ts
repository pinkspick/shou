import { NextResponse } from "next/server";

/**
 * Creates a Stripe PaymentIntent for the checkout.
 *
 * We deliberately avoid the Stripe Node SDK (no package.json changes) and call
 * the REST API directly with `fetch`, form-encoded as Stripe expects. When no
 * secret key is configured the route returns `mode:"demo"` so the client can
 * simulate a successful payment — the storefront stays fully functional
 * without live keys.
 */
export const runtime = "nodejs";

type Body = {
  amount?: number; // whole dollars
  email?: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const dollars = Math.max(0, Math.round(body.amount ?? 0));
  const amount = dollars * 100; // Stripe works in cents

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    // Demo mode — no Stripe configured.
    return NextResponse.json({ mode: "demo", amount: dollars });
  }

  const params = new URLSearchParams();
  params.set("amount", String(amount));
  params.set("currency", "usd");
  params.set("automatic_payment_methods[enabled]", "true");
  if (body.email) params.set("receipt_email", body.email);

  try {
    const res = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = (await res.json()) as {
      client_secret?: string;
      id?: string;
      error?: { message?: string };
    };

    if (!res.ok || !data.client_secret) {
      return NextResponse.json(
        { error: data.error?.message ?? "Stripe error" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      mode: "live",
      clientSecret: data.client_secret,
      id: data.id,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach payment provider" },
      { status: 502 }
    );
  }
}
