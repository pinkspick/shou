/**
 * Lumière — order-status domain (pure, client-safe).
 *
 * Derives a believable post-purchase journey from an order's number + creation
 * time: the five fulfilment milestones, an IGI certificate id, a carrier +
 * tracking number, and an estimated delivery date. None of this is real
 * logistics — it's deterministic theatre so the tracking experience feels
 * alive without a warehouse behind it. A `mockOrder()` synthesiser lets the
 * status page render for any id (shared links, demos) when the server store
 * has no record.
 *
 * `StoredOrder` is imported type-only, so this module never pulls in the
 * Node-only persistence layer and is safe to bundle for the browser.
 */
import type { StoredOrder } from "./orders";
import { PRODUCTS } from "./products";

const HOUR = 3_600_000;

export type StageId =
  | "confirmed"
  | "production"
  | "inspection"
  | "dispatched"
  | "delivered";

export type Stage = {
  id: StageId;
  label: string;
  description: string;
};

export const STAGES: Stage[] = [
  {
    id: "confirmed",
    label: "Order Confirmed",
    description: "We've received your order and payment.",
  },
  {
    id: "production",
    label: "In Production",
    description: "Your stone is selected and the piece is set by hand.",
  },
  {
    id: "inspection",
    label: "Quality Inspection",
    description: "Graded to IGI standard — your certificate is issued.",
  },
  {
    id: "dispatched",
    label: "Dispatched",
    description: "On its way to you by insured courier.",
  },
  {
    id: "delivered",
    label: "Delivered",
    description: "In your hands. We hope it takes their breath away.",
  },
];

/** Hours after purchase at which each stage is reached. */
const STAGE_OFFSETS_H = [0, 2, 26, 50, 98];

/** Index of the milestone currently in progress, from order age. */
export function currentStageIndex(createdAt: string): number {
  const ageH = (Date.now() - new Date(createdAt).getTime()) / HOUR;
  if (ageH < 1) return 0;
  if (ageH < 24) return 1;
  if (ageH < 48) return 2;
  if (ageH < 96) return 3;
  return 4;
}

export function stageDate(createdAt: string, i: number): Date {
  return new Date(new Date(createdAt).getTime() + STAGE_OFFSETS_H[i] * HOUR);
}

export type MilestoneStatus = "done" | "active" | "upcoming";
export type Milestone = {
  stage: Stage;
  status: MilestoneStatus;
  date: Date;
};

export function milestones(createdAt: string): Milestone[] {
  const cur = currentStageIndex(createdAt);
  return STAGES.map((stage, i) => ({
    stage,
    status: i < cur ? "done" : i === cur ? "active" : "upcoming",
    date: stageDate(createdAt, i),
  }));
}

/* ------------------------------------------------------------------
   Deterministic hash → identifiers
   ------------------------------------------------------------------ */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** IGI-style certificate id for the order. */
export function orderCertificateId(orderNumber: string): string {
  const h = hash(orderNumber + "·cert");
  const n = (h % 9_000_000_000) + 1_000_000_000; // 10 digits
  return `IGI-${String(n).slice(0, 4)}-${String(n).slice(4)}`;
}

export type Tracking = {
  carrier: string;
  trackingNumber: string;
  url: string;
};

const CARRIERS = [
  {
    name: "FedEx",
    url: (t: string) => `https://www.fedex.com/fedextrack/?trknbr=${t}`,
    format: (n: string) => n.slice(0, 12),
  },
  {
    name: "UPS",
    url: (t: string) => `https://www.ups.com/track?loc=en_US&tracknum=${t}`,
    format: (n: string) => `1Z${n.slice(0, 9).toUpperCase()}`,
  },
] as const;

export function tracking(orderNumber: string): Tracking {
  const h = hash(orderNumber + "·ship");
  const carrier = CARRIERS[h % CARRIERS.length];
  const digits = String((h % 900_000_000_000) + 100_000_000_000); // 12 digits
  const trackingNumber = carrier.format(digits);
  return {
    carrier: carrier.name,
    trackingNumber,
    url: carrier.url(trackingNumber),
  };
}

/** Estimated (or actual) delivery date — the final milestone's date. */
export function estimatedDelivery(createdAt: string): Date {
  return stageDate(createdAt, 4);
}

/* ------------------------------------------------------------------
   Formatting
   ------------------------------------------------------------------ */
export function formatPlacedDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatStageDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDeliveryDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/* ------------------------------------------------------------------
   Mock order — synthesised from an id so the status page always renders.
   ------------------------------------------------------------------ */
export function mockOrder(orderId: string): StoredOrder {
  const h = hash(orderId);
  const product = PRODUCTS[h % PRODUCTS.length];
  // 2–132 hours ago, so the journey lands on a believable mid-stage.
  const ageH = (h % 130) + 2;
  const createdAt = new Date(Date.now() - ageH * HOUR).toISOString();
  return {
    number: orderId,
    email: "",
    fullName: "Valued Client",
    items: [
      {
        name: product.name,
        descriptor: product.descriptor,
        qty: 1,
        unitPrice: product.price,
      },
    ],
    total: product.price,
    delivery: "Standard",
    giftWrap: true,
    engraving: "",
    giftMessage: "",
    createdAt,
    paymentMode: "demo",
  };
}

/* ------------------------------------------------------------------
   Certificate PDF — a minimal, valid, hand-built PDF (placeholder).
   ASCII-only so byte length == /Length and the file opens everywhere.
   ------------------------------------------------------------------ */
export function certificatePdfString(opts: {
  certId: string;
  productName: string;
  orderNumber: string;
  date: string;
}): string {
  const ascii = (s: string) =>
    s
      .normalize("NFKD")
      .replace(/[^\x20-\x7E]/g, "")
      .replace(/([()\\])/g, "\\$1");

  const lines = [
    "LUMIERE",
    "Certificate of Authenticity",
    "",
    `Certificate ID:  ${opts.certId}`,
    `Order:           ${opts.orderNumber}`,
    `Piece:           ${opts.productName}`,
    `Issued:          ${opts.date}`,
    "",
    "This certifies that the accompanying diamond is",
    "laboratory-grown and has been graded to the",
    "standards of the International Gemological Institute.",
    "",
    "Cut, colour, clarity and carat weight are recorded",
    "in the full report delivered with your confirmation.",
  ];

  let content = "BT\n/F1 18 Tf\n60 780 Td\n20 TL\n";
  for (const line of lines) content += `(${ascii(line)}) Tj\nT*\n`;
  content += "ET";

  const objs: Record<number, string> = {
    1: "<< /Type /Catalog /Pages 2 0 R >>",
    2: "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    3: "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    4: "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    5: `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  };

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  for (let i = 1; i <= 5; i++) {
    offsets[i] = pdf.length;
    pdf += `${i} 0 obj\n${objs[i]}\nendobj\n`;
  }
  const xrefPos = pdf.length;
  pdf += "xref\n0 6\n0000000000 65535 f \n";
  for (let i = 1; i <= 5; i++) {
    pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  }
  pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
  return pdf;
}
