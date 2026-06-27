"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

/**
 * Tracking entry page — a quiet, centred form. We don't gate on the email
 * (there's no auth backend), but we collect it the way the real flow would and
 * route to the status page by order number.
 */
export function TrackForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [number, setNumber] = useState(params.get("number") ?? "");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    const id = number.trim();
    if (!id) {
      setError(true);
      return;
    }
    router.push(`/orders/${encodeURIComponent(id)}`);
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <div className="text-center">
        <span className="overline text-gold">Order Tracking</span>
        <h1 className="mt-3 font-display text-h1 text-obsidian">
          Follow your light
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-body text-carbon/70">
          Enter your order details to see where your piece is on its journey
          from our atelier to your hands.
        </p>
      </div>

      <div className="mt-9 space-y-4">
        <div>
          <label className="overline mb-1.5 block text-obsidian">
            Order Number
          </label>
          <input
            type="text"
            value={number}
            onChange={(e) => {
              setNumber(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="LUM-XXXXX"
            className={`w-full rounded-button border bg-transparent px-4 py-3 font-mono text-body uppercase tracking-[0.12em] text-obsidian placeholder:text-carbon/40 focus:outline-none ${
              error
                ? "border-rose-gold focus:border-rose-gold"
                : "border-[color:var(--border-soft)] focus:border-gold"
            }`}
          />
        </div>

        <div>
          <label className="overline mb-1.5 block text-obsidian">Email</label>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="you@example.com"
            className="w-full rounded-button border border-[color:var(--border-soft)] bg-transparent px-4 py-3 font-sans text-body text-obsidian placeholder:text-carbon/40 focus:border-gold focus:outline-none"
          />
        </div>

        {error && (
          <p className="font-mono text-caption text-rose-gold">
            Please enter your order number.
          </p>
        )}

        <button
          type="button"
          onClick={submit}
          className="w-full rounded-button bg-obsidian px-6 py-4 font-mono text-caption uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold"
        >
          Track Order
        </button>

        <Link
          href="/account"
          className="block text-center font-mono text-caption uppercase tracking-[0.16em] text-carbon/70 link-underline"
        >
          Sign in to view all orders
        </Link>
      </div>

      <p className="mt-8 flex items-center justify-center gap-2 text-center font-mono text-caption text-carbon/55">
        <IconEnvelope />
        Check your confirmation email for your order number.
      </p>
    </div>
  );
}

function IconEnvelope() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
