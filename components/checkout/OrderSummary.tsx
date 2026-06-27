"use client";

import { computeTotals, type Cart } from "@/lib/cart";
import { deliveryCost, deliveryPriceLabel, getDeliveryOption, type DeliveryId } from "@/lib/checkout";
import { formatPrice } from "@/lib/products";
import { LumiereBox } from "@/components/cart/LumiereBox";

/**
 * Sticky order summary used in the checkout sidebar — line items, the itemised
 * total, and a glimpse of the presentation box so the gift is felt before it
 * ships.
 */
export function OrderSummary({
  cart,
  delivery,
}: {
  cart: Cart;
  delivery: DeliveryId;
}) {
  const subtotal = cart.items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const ship = deliveryCost(delivery, subtotal);
  const totals = computeTotals(cart, ship);
  const opt = getDeliveryOption(delivery);

  return (
    <div className="rounded-2xl border border-[color:var(--divider)] bg-white/40 p-6">
      <span className="overline text-obsidian">Order Summary</span>

      <ul className="mt-5 space-y-4">
        {cart.items.map((item) => (
          <li key={item.key} className="flex gap-3">
            <div className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-champagne to-glacial text-gold">
              ◆
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-obsidian font-mono text-[0.625rem] text-ivory">
                {item.qty}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-body text-obsidian">{item.name}</p>
              {item.descriptor && (
                <p className="font-mono text-caption text-carbon/60">
                  {item.descriptor}
                </p>
              )}
            </div>
            <span className="numeric font-mono text-caption text-obsidian">
              {formatPrice(item.unitPrice * item.qty)}
            </span>
          </li>
        ))}
      </ul>

      <dl className="mt-5 space-y-1.5 border-t border-[color:var(--divider)] pt-4 font-sans text-body text-carbon">
        <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
        {cart.giftWrap && <Row label="Gift wrapping" value="Complimentary" muted />}
        {totals.engraving > 0 && (
          <Row label="Engraving" value={formatPrice(totals.engraving)} />
        )}
        <Row label={opt.name} value={deliveryPriceLabel(delivery, subtotal)} />
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

      <div className="mt-6 flex items-center gap-4 rounded-xl bg-obsidian/[0.03] p-4">
        <LumiereBox size={72} />
        <p className="text-caption text-carbon/80">
          Presented in the signature Lumière box — matte obsidian, gold
          monogram, satin within.
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
  muted,
}: {
  label: string;
  value: string;
  accent?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <dt>{label}</dt>
      <dd
        className={
          accent
            ? "numeric font-mono text-gold"
            : muted
              ? "font-mono text-caption uppercase tracking-[0.12em] text-gold"
              : "numeric font-mono"
        }
      >
        {value}
      </dd>
    </div>
  );
}
