import { NextResponse } from "next/server";
import { generateOrderNumber } from "@/lib/checkout";
import { getOrder, saveOrder, type StoredOrder } from "@/lib/orders";

/**
 * POST → persist a completed order, returning its order number.
 * GET ?number=LUM-XXXXX → retrieve an order (for the confirmation / track page).
 */
export const runtime = "nodejs";

type PostBody = {
  email?: string;
  fullName?: string;
  items?: StoredOrder["items"];
  total?: number;
  delivery?: string;
  giftWrap?: boolean;
  engraving?: string;
  giftMessage?: string;
  paymentMode?: "live" | "demo";
};

export async function POST(req: Request) {
  let body: PostBody;
  try {
    body = (await req.json()) as PostBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const order: StoredOrder = {
    number: generateOrderNumber(),
    email: body.email ?? "",
    fullName: body.fullName ?? "",
    items: Array.isArray(body.items) ? body.items : [],
    total: Math.round(body.total ?? 0),
    delivery: body.delivery ?? "Standard",
    giftWrap: body.giftWrap ?? true,
    engraving: body.engraving ?? "",
    giftMessage: body.giftMessage ?? "",
    createdAt: new Date().toISOString(),
    paymentMode: body.paymentMode === "live" ? "live" : "demo",
  };

  await saveOrder(order);
  return NextResponse.json({ number: order.number });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const number = searchParams.get("number");
  if (!number) {
    return NextResponse.json({ error: "Missing order number" }, { status: 400 });
  }
  const order = await getOrder(number);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ order });
}
