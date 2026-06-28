"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LumiereBox } from "@/components/cart/LumiereBox";
import { ShareButtons } from "@/components/social/ShareButtons";
import { formatPrice } from "@/lib/products";

export type PlacedOrder = {
  number: string;
  email: string;
  fullName: string;
  total: number;
  deliveryName: string;
  firstProductName: string;
  itemCount: number;
};

/**
 * Step 3 — confirmation. The presentation box unfolds, the order number is set
 * in DM Mono, and the client is invited to track the order or share the moment.
 */
export function ConfirmationStep({ order }: { order: PlacedOrder }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 450);
    return () => clearTimeout(t);
  }, []);

  const shareText = `I just got my ${order.firstProductName} from Lumière ✨`;

  return (
    <motion.div
      className="mx-auto max-w-xl text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex justify-center py-4">
        <LumiereBox open={open} size={220} />
      </div>

      <span className="overline text-gold">Order Confirmed</span>
      <h1 className="mt-3 font-display text-h1 text-obsidian">
        Beautifully done.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-body-lg text-carbon">
        Thank you, {order.fullName.split(" ")[0] || "friend"}. Your{" "}
        {order.itemCount > 1 ? "pieces are" : "piece is"} being prepared by hand
        and wrapped in the signature Lumière box.
      </p>

      <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-[color:var(--divider)] bg-white/40 p-6">
        <span className="overline text-carbon/60">Order Number</span>
        <p className="numeric mt-1 font-mono text-h3 tracking-[0.12em] text-obsidian">
          {order.number}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-[color:var(--divider)] pt-4 text-body text-carbon">
          <span>{order.deliveryName}</span>
          <span className="numeric font-mono text-obsidian">
            {formatPrice(order.total)}
          </span>
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-md font-mono text-caption text-carbon/70">
        A confirmation has been sent to{" "}
        <span className="text-obsidian">{order.email || "your inbox"}</span>.
        Your IGI certificate will arrive with it.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href={`/orders/${encodeURIComponent(order.number)}`}
          className="rounded-button bg-obsidian px-7 py-4 font-mono text-caption uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold"
        >
          Track Your Order
        </Link>
      </div>

      <div className="mt-8 flex justify-center">
        <ShareButtons label="Share the moment" text={shareText} />
      </div>

      <Link
        href="/shop"
        className="mt-8 inline-block font-mono text-caption uppercase tracking-[0.16em] text-carbon/70 link-underline"
      >
        Continue exploring
      </Link>
    </motion.div>
  );
}
