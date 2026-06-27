"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const luxe = [0.25, 0.46, 0.45, 0.94] as const;

type Stone = {
  name: string;
  /** Swatch colour for the chip. */
  color: string;
  origin: string;
  mohs: string;
  symbolism: string;
  bestCut: string;
};

const STONES: Stone[] = [
  {
    name: "White Diamond",
    color: "#f4f4f2",
    origin: "Grown by CVD from a pure carbon seed",
    mohs: "10",
    symbolism: "Clarity, devotion, the unbreakable promise",
    bestCut: "Round Brilliant",
  },
  {
    name: "Yellow Diamond",
    color: "#e7c84e",
    origin: "Nitrogen introduced during crystal growth",
    mohs: "10",
    symbolism: "Optimism, warmth, joyful beginnings",
    bestCut: "Cushion",
  },
  {
    name: "Pink Diamond",
    color: "#e7a9bd",
    origin: "Lattice distortion engineered post-growth",
    mohs: "10",
    symbolism: "Tenderness, romance, rare affection",
    bestCut: "Radiant",
  },
  {
    name: "Emerald",
    color: "#2f7d5b",
    origin: "Hydrothermally grown beryl with chromium",
    mohs: "7.5–8",
    symbolism: "Renewal, growth, enduring hope",
    bestCut: "Emerald (step)",
  },
  {
    name: "Sapphire",
    color: "#2b4a8b",
    origin: "Flame-fusion corundum with titanium & iron",
    mohs: "9",
    symbolism: "Wisdom, loyalty, noble truth",
    bestCut: "Oval",
  },
  {
    name: "Ruby",
    color: "#9b1c2e",
    origin: "Corundum coloured by trace chromium",
    mohs: "9",
    symbolism: "Passion, vitality, courage of the heart",
    bestCut: "Cushion",
  },
];

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-carbon/60">
        {label}
      </dt>
      <dd className="mt-1 font-sans text-body text-obsidian">{value}</dd>
    </div>
  );
}

/**
 * Interactive stone guide. Tap a tile to expand its origin, hardness,
 * symbolism and ideal cut. One open at a time; reduced-motion aware.
 */
export function StoneGuide() {
  const [open, setOpen] = useState<string | null>(null);
  const reduce = useReducedMotion();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {STONES.map((stone) => {
        const isOpen = open === stone.name;
        return (
          <div
            key={stone.name}
            className={`overflow-hidden rounded-card border transition-colors ${
              isOpen
                ? "border-gold bg-white"
                : "border-[color:var(--border-soft)] bg-white/40"
            }`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : stone.name)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left"
            >
              <span
                aria-hidden
                className="h-8 w-8 shrink-0 rounded-full border border-[color:var(--border-soft)] shadow-inner"
                style={{ backgroundColor: stone.color }}
              />
              <span className="flex-1 font-display text-body-lg text-obsidian">
                {stone.name}
              </span>
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-carbon transition-transform duration-300"
                style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M6 9l6 6 6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="body"
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: luxe }}
                  className="overflow-hidden"
                >
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[color:var(--border-soft)] px-5 py-5">
                    <Detail label="Origin" value={stone.origin} />
                    <Detail label="Hardness (Mohs)" value={stone.mohs} />
                    <Detail label="Symbolism" value={stone.symbolism} />
                    <Detail label="Best Cut" value={stone.bestCut} />
                  </dl>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
