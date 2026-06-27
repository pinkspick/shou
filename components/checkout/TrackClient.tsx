"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LumiereBox } from "@/components/cart/LumiereBox";
import { formatPrice } from "@/lib/products";

type Order = {
  number: string;
  fullName: string;
  total: number;
  delivery: string;
  createdAt: string;
  items: { name: string; descriptor: string; qty: number; unitPrice: number }[];
};

/* The editorial journey a piece travels — purely cosmetic staging. */
const STAGES = [
  { key: "confirmed", label: "Order confirmed", detail: "We have your order." },
  { key: "atelier", label: "In the atelier", detail: "Hand-set and inspected." },
  { key: "wrapped", label: "Wrapped & sealed", detail: "Boxed in obsidian and gold." },
  { key: "transit", label: "In transit", detail: "Insured courier en route." },
  { key: "delivered", label: "Delivered", detail: "In your hands." },
] as const;

/** Pick a believable stage from how long ago the order was placed. */
function stageIndex(createdAt: string): number {
  const ageH = (Date.now() - new Date(createdAt).getTime()) / 3_600_000;
  if (ageH < 1) return 0;
  if (ageH < 24) return 1;
  if (ageH < 48) return 2;
  if (ageH < 96) return 3;
  return 4;
}

export function TrackClient() {
  const params = useSearchParams();
  const initial = params.get("number") ?? "";
  const [query, setQuery] = useState(initial);
  const [order, setOrder] = useState<Order | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "notfound">("idle");

  const lookup = async (number: string) => {
    if (!number.trim()) return;
    setState("loading");
    setOrder(null);
    try {
      const res = await fetch(`/api/order?number=${encodeURIComponent(number.trim())}`);
      if (!res.ok) {
        setState("notfound");
        return;
      }
      const data = await res.json();
      setOrder(data.order as Order);
      setState("idle");
    } catch {
      setState("notfound");
    }
  };

  useEffect(() => {
    if (initial) lookup(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  const current = order ? stageIndex(order.createdAt) : 0;

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <div className="text-center">
        <span className="overline text-gold">Order Tracking</span>
        <h1 className="mt-3 font-display text-h1 text-obsidian">
          Follow your light
        </h1>
        <p className="mx-auto mt-3 max-w-md text-body text-carbon/70">
          Enter your order number to see where your piece is on its journey.
        </p>
      </div>

      <div className="mx-auto mt-8 flex max-w-md gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && lookup(query)}
          placeholder="LUM-XXXXX"
          className="min-w-0 flex-1 rounded-button border border-[color:var(--border-soft)] bg-transparent px-4 py-3 font-mono text-body uppercase tracking-[0.12em] text-obsidian placeholder:text-carbon/40 focus:border-gold focus:outline-none"
        />
        <button
          type="button"
          onClick={() => lookup(query)}
          className="rounded-button bg-obsidian px-6 py-3 font-mono text-caption uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-gold"
        >
          Track
        </button>
      </div>

      {state === "loading" && (
        <p className="mt-10 text-center font-mono text-caption uppercase tracking-[0.16em] text-carbon/60">
          Locating your order…
        </p>
      )}

      {state === "notfound" && (
        <p className="mt-10 text-center text-body text-carbon/70">
          We couldn&apos;t find an order with that number. Please check and try
          again — or reach our concierge.
        </p>
      )}

      {order && (
        <div className="mt-12">
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-[color:var(--divider)] bg-white/40 p-8 text-center">
            <LumiereBox open={current >= 4} size={150} />
            <div>
              <span className="overline text-carbon/60">Order</span>
              <p className="numeric font-mono text-h3 tracking-[0.12em] text-obsidian">
                {order.number}
              </p>
              <p className="mt-1 text-body text-carbon/70">
                {order.delivery} · {formatPrice(order.total)}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <ol className="mt-10 space-y-0">
            {STAGES.map((stage, i) => {
              const done = i < current;
              const active = i === current;
              return (
                <li key={stage.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-caption ${
                        done
                          ? "bg-gold text-ivory"
                          : active
                            ? "bg-obsidian text-ivory"
                            : "border border-carbon/30 text-carbon/40"
                      }`}
                    >
                      {done ? "✓" : i + 1}
                    </span>
                    {i < STAGES.length - 1 && (
                      <span
                        className={`my-1 w-px flex-1 ${
                          done ? "bg-gold" : "bg-[color:var(--divider)]"
                        }`}
                        style={{ minHeight: 28 }}
                      />
                    )}
                  </div>
                  <div className={`pb-6 ${active || done ? "" : "opacity-50"}`}>
                    <p className="font-sans text-body text-obsidian">{stage.label}</p>
                    <p className="font-mono text-caption text-carbon/60">
                      {stage.detail}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <p className="mt-12 text-center">
        <Link
          href="/shop"
          className="font-mono text-caption uppercase tracking-[0.16em] text-carbon/70 link-underline"
        >
          Return to the Maison
        </Link>
      </p>
    </div>
  );
}
