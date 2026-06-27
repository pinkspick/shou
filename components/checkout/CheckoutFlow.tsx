"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/components/cart/CartContext";
import { computeTotals } from "@/lib/cart";
import {
  EMPTY_ADDRESS,
  EMPTY_CONTACT,
  deliveryCost,
  getDeliveryOption,
  type Address,
  type Contact,
  type DeliveryId,
} from "@/lib/checkout";
import { ContactStep } from "./ContactStep";
import { PaymentStep } from "./PaymentStep";
import { OrderSummary } from "./OrderSummary";
import { ConfirmationStep, type PlacedOrder } from "./ConfirmationStep";

const STEPS = ["Details", "Payment", "Confirmation"] as const;

/**
 * Orchestrates the three-step checkout on a single page (no reloads). Holds
 * contact / address / delivery / gift-message state, computes the live total,
 * drives payment, persists the order, and renders the confirmation.
 */
export function CheckoutFlow() {
  const { cart, clear } = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [contact, setContact] = useState<Contact>(EMPTY_CONTACT);
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);
  const [delivery, setDelivery] = useState<DeliveryId>("standard");
  const [giftMessage, setGiftMessage] = useState("");
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);

  const subtotal = useMemo(
    () => cart.items.reduce((s, i) => s + i.unitPrice * i.qty, 0),
    [cart.items]
  );
  const totals = useMemo(
    () => computeTotals(cart, deliveryCost(delivery, subtotal)),
    [cart, delivery, subtotal]
  );

  /* Empty cart (and not yet confirmed) → gentle dead-end. */
  if (cart.items.length === 0 && step !== 3) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-32 text-center">
        <span className="text-4xl text-gold">◆</span>
        <h1 className="font-display text-h2 text-obsidian">Your cart is empty</h1>
        <p className="text-body text-carbon/70">
          There&apos;s nothing to check out just yet.
        </p>
        <Link
          href="/shop"
          className="rounded-button bg-obsidian px-7 py-3.5 font-mono text-caption uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold"
        >
          Explore the Maison
        </Link>
      </div>
    );
  }

  async function handlePaid(mode: "live" | "demo") {
    const firstProductName = cart.items[0]?.name ?? "Lumière piece";
    const itemCount = cart.items.reduce((n, i) => n + i.qty, 0);

    // Persist the order (best-effort) and mint a number.
    let number = "";
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: contact.email,
          fullName: contact.fullName,
          items: cart.items.map((i) => ({
            name: i.name,
            descriptor: i.descriptor,
            qty: i.qty,
            unitPrice: i.unitPrice,
          })),
          total: totals.total,
          delivery: getDeliveryOption(delivery).name,
          giftWrap: cart.giftWrap,
          engraving: cart.engraving,
          giftMessage,
          paymentMode: mode,
        }),
      });
      const data = await res.json();
      number = data.number ?? "";
    } catch {
      /* fall through to a client-side number */
    }
    if (!number) {
      number = "LUM-" + Math.random().toString(36).toUpperCase().slice(2, 8);
    }

    setPlaced({
      number,
      email: contact.email,
      fullName: contact.fullName,
      total: totals.total,
      deliveryName: getDeliveryOption(delivery).name,
      firstProductName,
      itemCount,
    });
    clear();
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8">
      {/* Stepper */}
      {step !== 3 && (
        <nav className="mb-10 flex items-center justify-center gap-3 sm:gap-5">
          {STEPS.slice(0, 2).map((label, i) => {
            const n = (i + 1) as 1 | 2;
            const active = step === n;
            const done = step > n;
            return (
              <div key={label} className="flex items-center gap-3 sm:gap-5">
                <button
                  type="button"
                  onClick={() => done && setStep(n)}
                  className="flex items-center gap-2"
                  disabled={!done}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-caption transition-colors ${
                      active
                        ? "bg-obsidian text-ivory"
                        : done
                          ? "bg-gold text-ivory"
                          : "border border-carbon/30 text-carbon/50"
                    }`}
                  >
                    {done ? "✓" : n}
                  </span>
                  <span
                    className={`font-mono text-caption uppercase tracking-[0.14em] ${
                      active ? "text-obsidian" : "text-carbon/50"
                    }`}
                  >
                    {label}
                  </span>
                </button>
                {i === 0 && <span className="h-px w-8 bg-[color:var(--divider)] sm:w-14" />}
              </div>
            );
          })}
        </nav>
      )}

      {step === 3 && placed ? (
        <ConfirmationStep order={placed} />
      ) : (
        <div className="grid gap-12 lg:grid-cols-[1fr_22rem]">
          {/* Steps */}
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {step === 1 && (
                  <ContactStep
                    contact={contact}
                    setContact={setContact}
                    address={address}
                    setAddress={setAddress}
                    delivery={delivery}
                    setDelivery={setDelivery}
                    giftMessage={giftMessage}
                    setGiftMessage={setGiftMessage}
                    subtotal={subtotal}
                    onContinue={() => {
                      setStep(2);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                )}
                {step === 2 && (
                  <PaymentStep
                    amount={totals.total}
                    email={contact.email}
                    onBack={() => setStep(1)}
                    onPaid={handlePaid}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sticky summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <OrderSummary cart={cart} delivery={delivery} />
          </aside>
        </div>
      )}
    </div>
  );
}
