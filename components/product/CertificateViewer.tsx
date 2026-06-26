"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { certificateId, type Product } from "@/lib/products";

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

/** A faux QR code — deterministic dot grid so it looks plausible. */
function QrMock({ seed }: { seed: string }) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 33 + seed.charCodeAt(i)) >>> 0;
  const cells = Array.from({ length: 49 }, (_, i) => {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    return (h >> (i % 16)) & 1;
  });
  return (
    <div className="grid h-24 w-24 grid-cols-7 gap-px bg-white p-1.5">
      {cells.map((on, i) => (
        <span key={i} className={on ? "bg-obsidian" : "bg-white"} />
      ))}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[color:var(--border-soft)] py-2.5">
      <span className="font-mono text-caption uppercase tracking-[0.14em] text-carbon">
        {label}
      </span>
      <span className="font-sans text-body text-obsidian">{value}</span>
    </div>
  );
}

export function CertificateViewer({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const id = certificateId(product);

  return (
    <div className="border-t border-[color:var(--border-soft)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-display text-h3 text-obsidian">View Certificate</span>
        <IconChevron open={open} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: luxe }}
            className="overflow-hidden"
          >
            <div className="mb-6 rounded-none border border-[color:var(--border-soft)] bg-white/60 p-6">
              {/* Cert header */}
              <div className="mb-6 flex items-start justify-between gap-6">
                <div>
                  <p className="font-display text-h3 text-obsidian">
                    IGI Diamond Report
                  </p>
                  <p className="mt-1 font-sans text-body text-carbon">
                    International Gemological Institute
                  </p>
                  <p className="numeric mt-4 font-mono text-caption uppercase tracking-[0.18em] text-gold">
                    {id}
                  </p>
                </div>
                <QrMock seed={id} />
              </div>

              {/* Cert body */}
              <div>
                <Row label="Origin" value="Laboratory Grown" />
                <Row label="Shape & Cut" value={product.cut} />
                <Row label="Stone" value={product.stone} />
                <Row label="Carat / Metal" value={`${product.carat} · ${product.metal}`} />
                <Row label="Clarity" value="VS1" />
                <Row label="Colour Grade" value="F" />
                <Row label="Cut Grade" value="Excellent" />
                <Row label="Polish / Symmetry" value="Excellent · Excellent" />
              </div>

              <p className="mt-5 font-sans text-caption text-carbon/70">
                Each Lumière piece ships with its original IGI report. Scan the
                code to verify this stone in the IGI global database.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
