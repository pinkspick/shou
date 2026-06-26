"use client";

import { useEffect, useState } from "react";
import { formatPrice, PRICE_MAX, PRICE_MIN } from "@/lib/products";

const STEP = 100;

/**
 * Dual-handle price slider. Tracks values locally while dragging and
 * commits to the parent (which writes the URL) on release, so the
 * query string isn't rewritten on every pixel of movement.
 */
export function PriceRange({
  min,
  max,
  onCommit,
}: {
  min: number;
  max: number;
  onCommit: (min: number, max: number) => void;
}) {
  const [lo, setLo] = useState(min);
  const [hi, setHi] = useState(max);

  // Re-sync if the URL changes externally (e.g. Clear all).
  useEffect(() => setLo(min), [min]);
  useEffect(() => setHi(max), [max]);

  const pct = (v: number) =>
    ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  const commit = (a: number, b: number) =>
    onCommit(Math.min(a, b), Math.max(a, b));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span className="numeric font-mono text-caption text-carbon">
          {formatPrice(Math.min(lo, hi))}
        </span>
        <span className="numeric font-mono text-caption text-carbon">
          {formatPrice(Math.max(lo, hi))}
        </span>
      </div>

      <div className="relative h-4">
        {/* base track */}
        <div className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-[color:var(--border-soft)]" />
        {/* selected range */}
        <div
          className="absolute top-1/2 h-px -translate-y-1/2 bg-gold"
          style={{
            left: `${pct(Math.min(lo, hi))}%`,
            right: `${100 - pct(Math.max(lo, hi))}%`,
          }}
        />

        <input
          type="range"
          aria-label="Minimum price"
          className="dual-range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={STEP}
          value={lo}
          onChange={(e) => setLo(Number(e.target.value))}
          onPointerUp={() => commit(lo, hi)}
          onKeyUp={() => commit(lo, hi)}
        />
        <input
          type="range"
          aria-label="Maximum price"
          className="dual-range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={STEP}
          value={hi}
          onChange={(e) => setHi(Number(e.target.value))}
          onPointerUp={() => commit(lo, hi)}
          onKeyUp={() => commit(lo, hi)}
        />
      </div>
    </div>
  );
}
