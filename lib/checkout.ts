/**
 * Lumière — checkout domain: delivery options, US shipping address,
 * contact details, and order-number minting. US-only by design (the maison
 * ships domestically for now; international is "by appointment").
 */

export type DeliveryId = "standard" | "express" | "white-glove";

export type DeliveryOption = {
  id: DeliveryId;
  name: string;
  detail: string;
  /** Estimated arrival, editorial. */
  eta: string;
};

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: "standard",
    name: "Standard",
    detail: "Insured, signature on delivery",
    eta: "5–7 business days",
  },
  {
    id: "express",
    name: "Express",
    detail: "Priority insured courier",
    eta: "2 business days",
  },
  {
    id: "white-glove",
    name: "White Glove",
    detail: "Hand-delivered by appointment",
    eta: "Scheduled with you",
  },
];

/** Free-shipping threshold for Standard delivery. */
export const FREE_SHIPPING_OVER = 500;
const STANDARD_FEE = 15;
const EXPRESS_FEE = 25;

/** Delivery cost in whole dollars for a chosen option + order subtotal. */
export function deliveryCost(id: DeliveryId, subtotal: number): number {
  switch (id) {
    case "standard":
      return subtotal >= FREE_SHIPPING_OVER ? 0 : STANDARD_FEE;
    case "express":
      return EXPRESS_FEE;
    case "white-glove":
      return 0;
  }
}

/** Short label for the delivery price (e.g. "Free", "$25"). */
export function deliveryPriceLabel(id: DeliveryId, subtotal: number): string {
  const cost = deliveryCost(id, subtotal);
  if (id === "white-glove") return "By appointment";
  return cost === 0 ? "Complimentary" : "$" + cost;
}

export function getDeliveryOption(id: DeliveryId): DeliveryOption {
  return DELIVERY_OPTIONS.find((d) => d.id === id) ?? DELIVERY_OPTIONS[0];
}

/* ------------------------------------------------------------------
   Contact + address
   ------------------------------------------------------------------ */
export type Contact = {
  email: string;
  fullName: string;
  phone: string;
};

export type Address = {
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: "US";
};

export const EMPTY_CONTACT: Contact = { email: "", fullName: "", phone: "" };
export const EMPTY_ADDRESS: Address = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_RE = /^\d{5}(-\d{4})?$/;

export function isContactValid(c: Contact): boolean {
  return (
    EMAIL_RE.test(c.email.trim()) &&
    c.fullName.trim().length > 1 &&
    c.phone.replace(/\D/g, "").length >= 10
  );
}

export function isAddressValid(a: Address): boolean {
  return (
    a.line1.trim().length > 2 &&
    a.city.trim().length > 1 &&
    a.state.trim().length >= 2 &&
    ZIP_RE.test(a.zip.trim())
  );
}

/* US states for the select. */
export const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
  "DC",
] as const;

/* ------------------------------------------------------------------
   Order number — "LUM-XXXXX" minted from time + entropy.
   ------------------------------------------------------------------ */
export function generateOrderNumber(): string {
  const t = Date.now().toString(36).toUpperCase().slice(-4);
  const r = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `LUM-${t}${r}`;
}
