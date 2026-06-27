"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/products";

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

declare global {
  interface Window {
    Stripe?: (key: string) => any;
    __lumiereStripeJs?: Promise<void>;
  }
}

function loadStripeJs(): Promise<void> {
  if (window.Stripe) return Promise.resolve();
  if (window.__lumiereStripeJs) return window.__lumiereStripeJs;
  window.__lumiereStripeJs = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://js.stripe.com/v3/";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("stripe.js failed"));
    document.head.appendChild(s);
  });
  return window.__lumiereStripeJs;
}

type Status = "loading" | "ready" | "paying" | "error";

/**
 * Step 2 — payment. Asks the server for a PaymentIntent: if Stripe keys are
 * configured it mounts the Stripe Payment Element (card + Apple/Google Pay);
 * otherwise it falls back to a fully-functional demo card so the flow can be
 * completed end-to-end without live keys.
 */
export function PaymentStep({
  amount,
  email,
  onBack,
  onPaid,
}: {
  amount: number;
  email: string;
  onBack: () => void;
  onPaid: (mode: "live" | "demo") => void;
}) {
  const [status, setStatus] = useState<Status>("loading");
  const [mode, setMode] = useState<"live" | "demo">("demo");
  const [message, setMessage] = useState<string | null>(null);

  const stripeRef = useRef<any>(null);
  const elementsRef = useRef<any>(null);
  const elementHost = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, email }),
        });
        const data = await res.json();
        if (cancelled) return;

        // Live only when the server returned a secret AND we have a pk.
        if (data.mode === "live" && data.clientSecret && PUBLISHABLE_KEY) {
          await loadStripeJs();
          if (cancelled) return;
          const stripe = window.Stripe!(PUBLISHABLE_KEY);
          const elements = stripe.elements({
            clientSecret: data.clientSecret,
            appearance: {
              theme: "flat",
              variables: {
                colorPrimary: "#b8962e",
                colorBackground: "#f9f6f0",
                colorText: "#1a1a18",
                fontFamily: "system-ui, sans-serif",
                borderRadius: "6px",
              },
            },
          });
          const paymentEl = elements.create("payment", {
            layout: "tabs",
          });
          stripeRef.current = stripe;
          elementsRef.current = elements;
          if (elementHost.current) paymentEl.mount(elementHost.current);
          setMode("live");
          setStatus("ready");
        } else {
          setMode("demo");
          setStatus("ready");
        }
      } catch {
        if (!cancelled) {
          // Network/Stripe failure → degrade to demo so checkout still works.
          setMode("demo");
          setStatus("ready");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [amount, email]);

  const pay = async () => {
    setMessage(null);
    if (mode === "demo") {
      setStatus("paying");
      // Simulate authorisation latency.
      setTimeout(() => onPaid("demo"), 1100);
      return;
    }

    // Live Stripe confirmation.
    setStatus("paying");
    try {
      const stripe = stripeRef.current;
      const elements = elementsRef.current;
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/checkout",
        },
        redirect: "if_required",
      });
      if (error) {
        setMessage(error.message ?? "Payment could not be completed.");
        setStatus("ready");
        return;
      }
      if (paymentIntent && paymentIntent.status === "succeeded") {
        onPaid("live");
      } else {
        setMessage("Payment is processing — please wait a moment.");
        setStatus("ready");
      }
    } catch {
      setMessage("Something went wrong confirming your payment.");
      setStatus("ready");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-h3 text-obsidian">Payment</h2>
        <p className="mt-1 inline-flex items-center gap-1.5 font-mono text-caption text-carbon/70">
          <IconLock />
          Your payment is encrypted and secure
        </p>
      </div>

      {status === "loading" && (
        <div className="flex items-center gap-3 py-10 text-carbon/60">
          <span className="animate-pulse text-2xl text-gold">◆</span>
          <span className="font-mono text-caption uppercase tracking-[0.16em]">
            Preparing secure payment…
          </span>
        </div>
      )}

      {/* Live Stripe Payment Element mounts here */}
      <div ref={elementHost} className={mode === "live" ? "block" : "hidden"} />

      {/* Demo card */}
      {status !== "loading" && mode === "demo" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[color:var(--border-soft)] bg-white/40 p-4">
            <span className="overline text-carbon/60">Card — demo mode</span>
            <div className="mt-3 space-y-3">
              <div className="rounded-button border border-[color:var(--divider)] bg-ivory px-3 py-3 font-mono text-body text-obsidian">
                4242 4242 4242 4242
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-button border border-[color:var(--divider)] bg-ivory px-3 py-3 font-mono text-body text-obsidian">
                  12 / 34
                </div>
                <div className="rounded-button border border-[color:var(--divider)] bg-ivory px-3 py-3 font-mono text-body text-obsidian">
                  123
                </div>
              </div>
            </div>
          </div>
          <p className="font-mono text-caption text-carbon/60">
            No Stripe keys configured — payments are simulated. Add{" "}
            <span className="text-gold">STRIPE_SECRET_KEY</span> to go live.
          </p>
        </div>
      )}

      {message && (
        <p className="font-mono text-caption text-rose-gold">{message}</p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={status === "paying"}
          className="rounded-button border border-obsidian px-6 py-4 font-mono text-caption uppercase tracking-[0.2em] text-obsidian transition-colors hover:bg-obsidian hover:text-ivory disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={pay}
          disabled={status === "paying" || status === "loading"}
          className="flex-1 rounded-button bg-obsidian px-6 py-4 font-mono text-caption uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "paying"
            ? "Processing…"
            : `Pay ${formatPrice(amount)}`}
        </button>
      </div>
    </div>
  );
}

function IconLock() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
