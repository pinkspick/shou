"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { buildWhatsAppUrl } from "@/lib/site";
import type { StoredOrder } from "@/lib/orders";
import {
  certificatePdfString,
  currentStageIndex,
  estimatedDelivery,
  formatDeliveryDate,
  formatPlacedDate,
  formatStageDate,
  milestones,
  orderCertificateId,
  tracking,
  type StageId,
} from "@/lib/orderStatus";

/**
 * Order status page — pulls the order from the server store and, when it isn't
 * found (shared link, cold instance, demo), synthesises a deterministic mock so
 * the page always tells a story. Renders the milestone timeline, shipment
 * tracking, certificate, lifetime-service reminder and concierge CTA.
 */
export function OrderStatusClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/order?number=${encodeURIComponent(orderId)}`);
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order as StoredOrder);
        } else {
          const { mockOrder } = await import("@/lib/orderStatus");
          setOrder(mockOrder(orderId));
        }
      } catch {
        if (!cancelled) {
          const { mockOrder } = await import("@/lib/orderStatus");
          setOrder(mockOrder(orderId));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3 text-carbon/60">
        <span className="animate-pulse text-2xl text-gold">◆</span>
        <span className="font-mono text-caption uppercase tracking-[0.16em]">
          Retrieving your order…
        </span>
      </div>
    );
  }

  if (!order) return null;

  return <OrderStatusBody order={order} orderId={orderId} />;
}

function OrderStatusBody({
  order,
  orderId,
}: {
  order: StoredOrder;
  orderId: string;
}) {
  const ms = useMemo(() => milestones(order.createdAt), [order.createdAt]);
  const cur = currentStageIndex(order.createdAt);
  const ship = useMemo(() => tracking(order.number), [order.number]);
  const certId = useMemo(() => orderCertificateId(order.number), [order.number]);
  const eta = estimatedDelivery(order.createdAt);

  const productName = order.items[0]?.name ?? "Lumière piece";
  const certIssued = cur >= 2;
  const dispatched = cur >= 3;

  const supportUrl = buildWhatsAppUrl(
    `Hi Lumière, I have a question about order #${orderId}.`
  );
  const serviceUrl = buildWhatsAppUrl(
    `Hi Lumière, I'd like to book a lifetime-service appointment for order #${orderId}.`
  );

  const downloadCertificate = () => {
    const pdf = certificatePdfString({
      certId,
      productName,
      orderNumber: order.number,
      date: formatPlacedDate(order.createdAt),
    });
    const blob = new Blob([pdf], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lumiere-certificate-${certId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="mx-auto max-w-2xl px-5 pb-40 pt-10 sm:px-8 lg:pb-24">
      {/* Header */}
      <header className="border-b border-[color:var(--divider)] pb-7">
        <span className="overline text-gold">Order Status</span>
        <h1 className="numeric mt-2 font-mono text-h2 tracking-[0.1em] text-obsidian">
          {order.number}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-body text-carbon/70">
          <span>Placed {formatPlacedDate(order.createdAt)}</span>
          <span className="text-carbon/30">·</span>
          <span className="numeric font-mono text-obsidian">
            {formatPrice(order.total)}
          </span>
          {order.fullName && order.fullName !== "Valued Client" && (
            <>
              <span className="text-carbon/30">·</span>
              <span>{order.fullName}</span>
            </>
          )}
        </div>
        <p className="mt-3 text-body text-carbon/70">
          {order.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
        </p>
      </header>

      {/* Timeline */}
      <section className="pt-9">
        <h2 className="overline mb-6 text-obsidian">Fulfilment</h2>
        <ol>
          {ms.map((m, i) => {
            const last = i === ms.length - 1;
            return (
              <li key={m.stage.id} className="flex gap-4">
                {/* Node + connector */}
                <div className="flex flex-col items-center">
                  <StageNode id={m.stage.id} status={m.status} />
                  {!last && (
                    <span
                      className={`my-1 w-px flex-1 ${
                        m.status === "done" ? "bg-champagne" : "bg-[color:var(--divider)]"
                      }`}
                      style={{ minHeight: 36 }}
                    />
                  )}
                </div>
                {/* Content */}
                <div className={`pb-8 ${m.status === "upcoming" ? "opacity-55" : ""}`}>
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h3
                      className={`font-display text-h3 leading-none ${
                        m.status === "active" ? "text-gold" : "text-obsidian"
                      }`}
                    >
                      {m.stage.label}
                    </h3>
                    <span className="numeric font-mono text-caption text-carbon/60">
                      {m.status === "upcoming" ? "Est. " : ""}
                      {formatStageDate(m.date)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-body text-carbon/75">
                    {m.stage.description}
                  </p>
                  {m.stage.id === "dispatched" && m.status !== "upcoming" && (
                    <a
                      href={ship.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block font-mono text-caption uppercase tracking-[0.14em] text-gold link-underline"
                    >
                      {ship.carrier} · {ship.trackingNumber} →
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Shipment */}
      <section className="pt-2">
        <div className="rounded-2xl border border-[color:var(--divider)] bg-white/40 p-6">
          <h2 className="overline text-obsidian">Shipment</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <span className="font-mono text-caption uppercase tracking-[0.14em] text-carbon/55">
                Carrier &amp; Tracking
              </span>
              {dispatched ? (
                <a
                  href={ship.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block font-mono text-body text-obsidian link-underline"
                >
                  {ship.carrier} · {ship.trackingNumber}
                </a>
              ) : (
                <p className="mt-1 text-body text-carbon/60">
                  Available once your piece is dispatched.
                </p>
              )}
            </div>
            <div>
              <span className="font-mono text-caption uppercase tracking-[0.14em] text-carbon/55">
                {cur >= 4 ? "Delivered" : "Estimated Delivery"}
              </span>
              <p className="mt-1 font-display text-h3 text-obsidian">
                {formatDeliveryDate(eta)}
              </p>
            </div>
          </div>
          <RouteMap delivered={cur >= 4} />
        </div>
      </section>

      {/* Certificate */}
      {certIssued && (
        <section className="pt-8">
          <div className="rounded-2xl border border-[color:var(--divider)] bg-gradient-to-br from-champagne/30 to-glacial/30 p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <QRMock value={certId} size={104} />
              <div className="min-w-0 flex-1">
                <span className="overline text-gold">Your IGI Certificate</span>
                <p className="mt-2 font-display text-h3 text-obsidian">
                  Certified &amp; ready
                </p>
                <p className="numeric mt-1 font-mono text-body tracking-[0.08em] text-carbon">
                  {certId}
                </p>
                <button
                  type="button"
                  onClick={downloadCertificate}
                  className="mt-4 inline-flex items-center gap-2 rounded-button bg-obsidian px-5 py-3 font-mono text-caption uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-gold"
                >
                  <IconDownload />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Lifetime service */}
      <section className="pt-8">
        <div className="rounded-2xl border border-obsidian/15 bg-obsidian p-7 text-ivory">
          <span className="overline text-gold">Lifetime Care</span>
          <h2 className="mt-2 font-display text-h2">
            Your Lumière piece is covered for life.
          </h2>
          <p className="mt-3 max-w-md text-body text-ivory/70">
            Brilliance is a promise we keep. Bring your piece home to the atelier
            whenever it needs attention.
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-2 font-mono text-caption uppercase tracking-[0.14em] text-ivory/85">
            {["Cleaning", "Resizing", "Prong retipping", "Re-polishing"].map(
              (s, i) => (
                <li key={s} className="flex items-center gap-3">
                  {i > 0 && <span className="text-gold">·</span>}
                  {s}
                </li>
              )
            )}
          </ul>
          <a
            href={serviceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-button border border-ivory/40 px-6 py-3.5 font-mono text-caption uppercase tracking-[0.18em] text-ivory transition-colors hover:border-gold hover:bg-gold hover:text-obsidian"
          >
            Book a Service Appointment
          </a>
        </div>
      </section>

      <p className="pt-8 text-center">
        <Link
          href="/shop"
          className="font-mono text-caption uppercase tracking-[0.16em] text-carbon/70 link-underline"
        >
          Continue exploring the Maison
        </Link>
      </p>

      {/* Concierge */}
      <SupportCTA url={supportUrl} />
    </div>
  );
}

/* ---------------------------------------------------------------- */

function StageNode({
  id,
  status,
}: {
  id: StageId;
  status: "done" | "active" | "upcoming";
}) {
  const base =
    "relative flex h-9 w-9 items-center justify-center rounded-full shrink-0";
  if (status === "done") {
    return (
      <span className={`${base} bg-champagne text-obsidian`}>
        <IconCheck />
      </span>
    );
  }
  if (status === "active") {
    return (
      <span className={`${base} border-2 border-gold text-gold`}>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full border border-gold opacity-50" />
        <StageGlyph id={id} />
      </span>
    );
  }
  return (
    <span className={`${base} border border-carbon/25 text-carbon/40`}>
      <StageGlyph id={id} />
    </span>
  );
}

function StageGlyph({ id }: { id: StageId }) {
  switch (id) {
    case "confirmed":
      return <IconCheck />;
    case "production":
      return <IconGem />;
    case "inspection":
      return <IconLoupe />;
    case "dispatched":
      return <IconTruck />;
    case "delivered":
      return <IconHome />;
  }
}

/** Stylised origin → destination map (placeholder, no external embed). */
function RouteMap({ delivered }: { delivered: boolean }) {
  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-[color:var(--divider)]">
      <svg viewBox="0 0 600 180" className="block h-auto w-full" role="img" aria-label="Shipment route map">
        <rect width="600" height="180" fill="#eef2ef" />
        {/* faux landmasses */}
        <path d="M-20 120 Q 120 80 260 110 T 620 96 L620 200 L-20 200 Z" fill="#dde7e0" />
        <path d="M-20 150 Q 200 120 380 150 T 620 140 L620 200 L-20 200 Z" fill="#d2ddd5" />
        {/* route arc */}
        <path
          d="M110 120 Q 300 30 490 90"
          fill="none"
          stroke="#b8962e"
          strokeWidth="2"
          strokeDasharray="6 7"
        />
        {/* origin pin */}
        <g>
          <circle cx="110" cy="120" r="6" fill="#1a1a18" />
          <text x="110" y="148" textAnchor="middle" fontFamily="monospace" fontSize="13" fill="#3a3a36">
            Atelier
          </text>
        </g>
        {/* destination pin */}
        <g>
          <circle cx="490" cy="90" r="6" fill={delivered ? "#b8962e" : "#1a1a18"} />
          <text x="490" y="70" textAnchor="middle" fontFamily="monospace" fontSize="13" fill="#3a3a36">
            {delivered ? "Delivered" : "You"}
          </text>
        </g>
      </svg>
    </div>
  );
}

function QRMock({ value, size = 100 }: { value: string; size?: number }) {
  const n = 21;
  const cells: boolean[] = useMemo(() => {
    let seed = 0;
    for (let i = 0; i < value.length; i++)
      seed = (seed * 31 + value.charCodeAt(i)) >>> 0;
    const rng = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const out: boolean[] = [];
    const inFinder = (r: number, c: number) =>
      (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (inFinder(r, c)) {
          // 7×7 finder: solid border + 3×3 centre
          const lr = r >= n - 7 ? r - (n - 7) : r;
          const lc = c >= n - 7 ? c - (n - 7) : c;
          const edge = lr === 0 || lr === 6 || lc === 0 || lc === 6;
          const core = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
          out.push(edge || core);
        } else {
          out.push(rng() > 0.52);
        }
      }
    }
    return out;
  }, [value]);

  const cell = size / n;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0 rounded-lg bg-white p-2 shadow-sm"
      role="img"
      aria-label="Certificate QR code"
    >
      {cells.map((on, i) =>
        on ? (
          <rect
            key={i}
            x={(i % n) * cell}
            y={Math.floor(i / n) * cell}
            width={cell + 0.5}
            height={cell + 0.5}
            fill="#1a1a18"
          />
        ) : null
      )}
    </svg>
  );
}

function SupportCTA({ url }: { url: string }) {
  return (
    <>
      {/* Desktop — floating right card */}
      <aside className="fixed bottom-6 right-6 z-40 hidden w-64 rounded-2xl border border-[color:var(--divider)] bg-ivory p-5 shadow-xl lg:block">
        <p className="font-display text-h3 text-obsidian">Need help with your order?</p>
        <p className="mt-1 text-caption text-carbon/70">
          Our concierge replies within the hour.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-button bg-[#25D366] px-5 py-3 font-mono text-caption uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
        >
          <IconWhatsApp />
          WhatsApp Us
        </a>
      </aside>

      {/* Mobile — floating bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-[color:var(--divider)] bg-ivory/95 px-5 py-3 backdrop-blur lg:hidden">
        <span className="font-sans text-body text-obsidian">
          Need help with your order?
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-2 rounded-button bg-[#25D366] px-4 py-2.5 font-mono text-caption uppercase tracking-[0.12em] text-white"
        >
          <IconWhatsApp />
          WhatsApp
        </a>
      </div>
    </>
  );
}

/* ---- icons ---- */
function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconGem() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M6 4h12l3 5-9 11L3 9l3-5z" strokeLinejoin="round" />
      <path d="M3 9h18M9 4l-3 5 6 11 6-11-3-5" strokeLinejoin="round" />
    </svg>
  );
}
function IconLoupe() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4-4" strokeLinecap="round" />
    </svg>
  );
}
function IconTruck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 6h10v9H3zM13 9h4l3 3v3h-7z" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </svg>
  );
}
function IconHome() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 11l8-6 8 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9h12v-9" strokeLinejoin="round" />
    </svg>
  );
}
function IconDownload() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M12 3v12" strokeLinecap="round" />
      <path d="M7 11l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 21h14" strokeLinecap="round" />
    </svg>
  );
}
function IconWhatsApp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 0 1 6.9 12.6l-.3.5.6 2.1-2.2-.6-.5.3A8.2 8.2 0 1 1 12 3.8zm-3 3.6c-.2 0-.5 0-.7.4-.2.4-.9 1-.9 2.3 0 1.4 1 2.7 1.1 2.9.2.2 2 3.1 4.9 4.2 2.4 1 2.9.8 3.4.7.5 0 1.6-.6 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.4-.3-.1-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.1-.3 0-.4.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.4-.4-.6-.4h-.5z" />
    </svg>
  );
}
