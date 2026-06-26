"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/products";

const luxe = [0.25, 0.46, 0.45, 0.94] as const;

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 transition-transform duration-300"
      style={{ transform: open ? "rotate(180deg)" : "none" }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function sections(product: Product) {
  return [
    {
      title: "Material & Craftsmanship",
      body: `Hand-set ${product.stone.toLowerCase()} in ${product.metal.toLowerCase()}, finished to a ${product.cut.toLowerCase()} cut. Every stone is cultivated, not mined — chemically and optically identical to earth-grown, graded to the same IGI standard. Settings are assembled and polished by hand in our atelier.`,
    },
    {
      title: "Sizing & Fit",
      body: "Complimentary resizing within the first 60 days. Ring sizes are offered in half steps from 4 to 12; if you're between sizes, our concierge can guide you. Necklace lengths and bracelet links can be adjusted on request.",
    },
    {
      title: "Lifetime Service Guarantee",
      body: "Each Lumière piece is covered by a lifetime guarantee against manufacturing defects, with complimentary cleaning, inspection, and prong re-tipping for life. Book a service any time through your concierge.",
    },
    {
      title: "Packaging & Delivery",
      body: "Presented in a signed Lumière case with its original IGI certificate and a certificate of authenticity. Fully insured carbon-neutral shipping, signature on delivery, and 30-day returns on unworn pieces.",
    },
  ];
}

function Item({ title, body }: { title: string; body: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[color:var(--border-soft)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-display text-body-lg text-obsidian">{title}</span>
        <IconChevron open={open} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: luxe }}
            className="overflow-hidden"
          >
            <p className="max-w-prose pb-5 font-sans text-body leading-relaxed text-carbon">
              {body}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DetailsAccordion({ product }: { product: Product }) {
  return (
    <div>
      {sections(product).map((s) => (
        <Item key={s.title} title={s.title} body={s.body} />
      ))}
    </div>
  );
}
