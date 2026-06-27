/**
 * Lumière — cart model + money math.
 *
 * A cart line is uniquely identified by its product *plus* its configuration
 * (metal / carat / stone / cut / size), so the same piece in two metals is two
 * lines. Engraving and gift-wrap are cart-level (one engraving message, one
 * wrap choice per order) — matching the editorial "one gift, beautifully
 * presented" intent rather than per-line packaging.
 */
import type { Carat, Category, Cut, Metal, Stone } from "./products";

/** Personalised hand-engraving — a flat atelier fee. */
export const ENGRAVING_PRICE = 25;
/** Complimentary signature gift wrapping. */
export const GIFT_WRAP_PRICE = 0;
/** Max characters the engraver will hand-cut into the band/bar. */
export const ENGRAVING_MAX = 20;

export type CartConfig = {
  metal?: Metal;
  carat?: Carat;
  stone?: Stone;
  cut?: Cut;
  /** Ring size (US), only for rings. */
  size?: number | null;
};

export type CartItem = {
  /** Stable identity = product + configuration. */
  key: string;
  productId: string;
  slug: string;
  category: Category;
  name: string;
  /** Editorial one-line spec, e.g. "White Gold · 18K · Round". */
  descriptor: string;
  /** Per-unit price in whole dollars. */
  unitPrice: number;
  qty: number;
  config: CartConfig;
};

export type Cart = {
  items: CartItem[];
  /** Complimentary signature wrapping (default on — it's a gift house). */
  giftWrap: boolean;
  /** Engraving message (empty = none). */
  engraving: string;
  /** Applied promo code, normalised to upper-case, or null. */
  promo: string | null;
};

export const EMPTY_CART: Cart = {
  items: [],
  giftWrap: true,
  engraving: "",
  promo: null,
};

/** Identity for a configured line — order-stable, collision-free. */
export function itemKey(productId: string, config: CartConfig): string {
  return [
    productId,
    config.metal ?? "",
    config.carat ?? "",
    config.stone ?? "",
    config.cut ?? "",
    config.size ?? "",
  ].join("|");
}

/** Human-readable spec line from a configuration. */
export function configSummary(config: CartConfig): string {
  const parts: string[] = [];
  if (config.metal) parts.push(config.metal);
  if (config.carat) parts.push(config.carat);
  if (config.stone) parts.push(config.stone);
  if (config.cut) parts.push(config.cut);
  if (config.size != null) parts.push(`Size ${config.size}`);
  return parts.join(" · ");
}

/* ------------------------------------------------------------------
   Promotions — placeholder house codes.
   ------------------------------------------------------------------ */
export type Promo = {
  code: string;
  label: string;
  /** Either a percentage (0–1) or a flat dollar amount. */
  kind: "percent" | "flat";
  value: number;
};

export const PROMOS: Record<string, Promo> = {
  LUMIERE10: { code: "LUMIERE10", label: "10% welcome", kind: "percent", value: 0.1 },
  SHINE15: { code: "SHINE15", label: "15% off", kind: "percent", value: 0.15 },
  WELCOME50: { code: "WELCOME50", label: "$50 off", kind: "flat", value: 50 },
};

export function normalisePromo(code: string): string {
  return code.trim().toUpperCase();
}

export function validatePromo(code: string): Promo | null {
  return PROMOS[normalisePromo(code)] ?? null;
}

/** Discount in whole dollars for a given promo against a subtotal. */
export function promoDiscount(promo: Promo | null, subtotal: number): number {
  if (!promo) return 0;
  const raw =
    promo.kind === "percent" ? subtotal * promo.value : Math.min(promo.value, subtotal);
  return Math.round(raw);
}

export type CartTotals = {
  subtotal: number;
  engraving: number;
  giftWrap: number;
  discount: number;
  deliveryCost: number;
  total: number;
};

/**
 * Roll a cart up into an itemised total. Delivery is supplied by the caller
 * (it depends on the chosen delivery option, which lives in checkout state).
 */
export function computeTotals(cart: Cart, deliveryCost = 0): CartTotals {
  const subtotal = cart.items.reduce((sum, it) => sum + it.unitPrice * it.qty, 0);
  const engraving = cart.engraving.trim() ? ENGRAVING_PRICE : 0;
  const giftWrap = cart.giftWrap ? GIFT_WRAP_PRICE : 0;
  const discount = promoDiscount(validatePromo(cart.promo ?? ""), subtotal);
  const total = Math.max(
    0,
    subtotal + engraving + giftWrap + deliveryCost - discount
  );
  return { subtotal, engraving, giftWrap, discount, deliveryCost, total };
}

/** Total number of pieces (sum of quantities) — for the nav badge. */
export function cartCount(cart: Cart): number {
  return cart.items.reduce((n, it) => n + it.qty, 0);
}
