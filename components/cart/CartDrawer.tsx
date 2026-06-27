"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./CartContext";
import {
  ENGRAVING_MAX,
  ENGRAVING_PRICE,
  computeTotals,
  validatePromo,
  type CartItem,
} from "@/lib/cart";
import { formatPrice } from "@/lib/products";

const luxe = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * Persistent cart drawer — slides in from the right. Line items, gift wrapping,
 * engraving, promo, and the checkout CTA. Mounted once in the root layout and
 * driven entirely by CartContext.
 */
export function CartDrawer() {
  const {
    cart,
    drawerOpen,
    closeDrawer,
    removeItem,
    setQty,
    setGiftWrap,
    setEngraving,
    applyPromo,
  } = useCart();

  const totals = useMemo(() => computeTotals(cart), [cart]);

  /* Lock body scroll while open + close on Escape. */
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, closeDrawer]);

  const empty = cart.items.length === 0;

  return (
    <AnimatePresence>
      {drawerOpen && (
        <motion.div
          className="fixed inset-0 z-[130] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Scrim */}
          <button
            type="button"
            aria-label="Close cart"
            onClick={closeDrawer}
            className="absolute inset-0 bg-obsidian/55 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.aside
            role="dialog"
            aria-label="Shopping cart"
            className="relative flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: luxe }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[color:var(--divider)] px-6 py-5">
              <span className="overline text-obsidian">
                Your Selection{!empty && ` — ${cart.items.length}`}
              </span>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close"
                className="text-2xl leading-none text-carbon transition-colors hover:text-obsidian"
              >
                ×
              </button>
            </div>

            {empty ? (
              <EmptyState onClose={closeDrawer} />
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6">
                  <ul className="divide-y divide-[color:var(--divider)]">
                    {cart.items.map((item) => (
                      <LineItem
                        key={item.key}
                        item={item}
                        onRemove={() => removeItem(item.key)}
                        onQty={(q) => setQty(item.key, q)}
                      />
                    ))}
                  </ul>

                  {/* Gift options */}
                  <div className="space-y-4 border-t border-[color:var(--divider)] py-5">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={cart.giftWrap}
                        onChange={(e) => setGiftWrap(e.target.checked)}
                        className="mt-0.5 h-4 w-4 accent-gold"
                      />
                      <span className="text-body text-carbon">
                        Complimentary gift wrapping
                        <span className="block font-mono text-caption uppercase tracking-[0.14em] text-gold">
                          Signature obsidian box
                        </span>
                      </span>
                    </label>

                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="overline text-obsidian">Engraving</span>
                        <span className="font-mono text-caption text-carbon/60">
                          +{formatPrice(ENGRAVING_PRICE)} · {cart.engraving.length}/
                          {ENGRAVING_MAX}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={cart.engraving}
                        maxLength={ENGRAVING_MAX}
                        onChange={(e) => setEngraving(e.target.value)}
                        placeholder="A name, a date, a word…"
                        className="w-full rounded-button border border-[color:var(--border-soft)] bg-transparent px-3 py-2.5 font-sans text-body text-obsidian placeholder:text-carbon/40 focus:border-gold focus:outline-none"
                      />
                    </div>

                    <PromoField
                      promo={cart.promo}
                      onApply={applyPromo}
                    />
                  </div>
                </div>

                {/* Footer / totals */}
                <div className="border-t border-[color:var(--divider)] px-6 py-5">
                  <dl className="mb-4 space-y-1.5 font-sans text-body text-carbon">
                    <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
                    {totals.engraving > 0 && (
                      <Row label="Engraving" value={formatPrice(totals.engraving)} />
                    )}
                    {totals.discount > 0 && (
                      <Row
                        label={`Discount (${cart.promo})`}
                        value={`−${formatPrice(totals.discount)}`}
                        accent
                      />
                    )}
                    <div className="flex items-baseline justify-between border-t border-[color:var(--divider)] pt-2.5">
                      <dt className="overline text-obsidian">Total</dt>
                      <dd className="numeric font-mono text-body-lg text-obsidian">
                        {formatPrice(totals.total)}
                      </dd>
                    </div>
                  </dl>
                  <p className="mb-3 text-center font-mono text-caption text-carbon/60">
                    Shipping &amp; any taxes calculated at checkout
                  </p>
                  <Link
                    href="/checkout"
                    onClick={closeDrawer}
                    className="block rounded-button bg-obsidian px-6 py-4 text-center font-mono text-caption uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <dt>{label}</dt>
      <dd className={accent ? "numeric font-mono text-gold" : "numeric font-mono"}>
        {value}
      </dd>
    </div>
  );
}

function LineItem({
  item,
  onRemove,
  onQty,
}: {
  item: CartItem;
  onRemove: () => void;
  onQty: (qty: number) => void;
}) {
  return (
    <li className="flex gap-4 py-5">
      {/* Placeholder gem frame (no product imagery yet) */}
      <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-champagne to-glacial text-gold">
        ◆
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-body-lg leading-tight text-obsidian">
            {item.name}
          </h3>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${item.name}`}
            className="shrink-0 text-carbon/50 transition-colors hover:text-obsidian"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {item.descriptor && (
          <p className="mt-0.5 font-mono text-caption text-carbon/70">
            {item.descriptor}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <div className="inline-flex items-center rounded-button border border-[color:var(--border-soft)]">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => onQty(item.qty - 1)}
              className="px-2.5 py-1 text-carbon transition-colors hover:text-obsidian"
            >
              −
            </button>
            <span className="numeric min-w-[1.75rem] text-center font-mono text-caption text-obsidian">
              {item.qty}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => onQty(item.qty + 1)}
              className="px-2.5 py-1 text-carbon transition-colors hover:text-obsidian"
            >
              +
            </button>
          </div>
          <span className="numeric font-mono text-body text-obsidian">
            {formatPrice(item.unitPrice * item.qty)}
          </span>
        </div>
      </div>
    </li>
  );
}

function PromoField({
  promo,
  onApply,
}: {
  promo: string | null;
  onApply: (code: string | null) => void;
}) {
  const [code, setCode] = useState(promo ?? "");
  const [error, setError] = useState(false);

  const apply = () => {
    const trimmed = code.trim();
    if (!trimmed) {
      onApply(null);
      setError(false);
      return;
    }
    if (validatePromo(trimmed)) {
      onApply(trimmed.toUpperCase());
      setError(false);
    } else {
      setError(true);
    }
  };

  const applied = promo ? validatePromo(promo) : null;

  return (
    <div>
      <span className="overline mb-1.5 block text-obsidian">Promo Code</span>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          placeholder="LUMIERE10"
          className="min-w-0 flex-1 rounded-button border border-[color:var(--border-soft)] bg-transparent px-3 py-2.5 font-mono text-caption uppercase tracking-[0.1em] text-obsidian placeholder:text-carbon/40 focus:border-gold focus:outline-none"
        />
        <button
          type="button"
          onClick={apply}
          className="rounded-button border border-obsidian px-4 py-2.5 font-mono text-caption uppercase tracking-[0.14em] text-obsidian transition-colors hover:bg-obsidian hover:text-ivory"
        >
          Apply
        </button>
      </div>
      {error && (
        <p className="mt-1.5 font-mono text-caption text-carbon/70">
          That code isn&apos;t recognised.
        </p>
      )}
      {applied && (
        <p className="mt-1.5 font-mono text-caption uppercase tracking-[0.14em] text-gold">
          {applied.label} applied
        </p>
      )}
    </div>
  );
}

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
      <span className="text-4xl text-gold">◆</span>
      <div>
        <p className="font-display text-h3 text-obsidian">Your cart is empty</p>
        <p className="mt-2 text-body text-carbon/70">
          Every Lumière piece begins as light. Find the one that&apos;s yours.
        </p>
      </div>
      <Link
        href="/shop"
        onClick={onClose}
        className="rounded-button bg-obsidian px-7 py-3.5 font-mono text-caption uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold"
      >
        Explore the Maison
      </Link>
    </div>
  );
}
