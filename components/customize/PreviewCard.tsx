"use client";

import { cn } from "@/lib/utils";
import { CutDiagram } from "./CutDiagram";
import { ShareButtons } from "@/components/social/ShareButtons";
import { formatPrice, METALS, type Metal } from "@/lib/products";
import {
  STONE_HEX,
  metalLabel,
  sizeLabelFor,
  type CustomConfig,
} from "@/lib/customize";

const METAL_HEX: Record<Metal, string> = METALS.reduce(
  (acc, m) => ({ ...acc, [m.value]: m.hex }),
  {} as Record<Metal, string>
);

/**
 * Live preview of the build — a gem rendered in the chosen cut + stone colour,
 * floated over a metal-tinted field, with a running spec list and price. Sticky
 * alongside the wizard on desktop.
 */
export function PreviewCard({
  config,
  price,
  complete,
  copied,
  onAddToCart,
  onShare,
}: {
  config: CustomConfig;
  price: number;
  complete: boolean;
  copied: boolean;
  onAddToCart: () => void;
  onShare: () => void;
}) {
  const metalTint = config.metal ? METAL_HEX[config.metal] : "#e8e2d6";
  const gemColor = config.stone ? STONE_HEX[config.stone] : "#dfe6ec";

  const rows: Array<[string, string | null]> = [
    ["Piece", config.piece ? config.piece.replace(/s$/, "") : null],
    ["Occasion", config.occasion],
    ["Metal", config.metal ? metalLabel(config) : null],
    ["Stone", config.stone],
    ["Cut", config.cut],
    ["Size", config.piece && config.size ? sizeLabelFor(config.piece, config.size) : null],
  ];

  return (
    <div className="overflow-hidden border border-[color:var(--border-soft)] bg-white">
      {/* Visual field */}
      <div
        className="relative flex aspect-square items-center justify-center"
        style={{
          background: `radial-gradient(120% 120% at 50% 30%, #ffffff 0%, ${metalTint}33 55%, ${metalTint}66 100%)`,
        }}
      >
        {config.cut ? (
          <CutDiagram cut={config.cut} fill={gemColor} size={180} />
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="text-3xl text-gold">◆</span>
            <span className="max-w-[12rem] font-mono text-caption uppercase tracking-[0.18em] text-carbon/50">
              Your piece takes shape here
            </span>
          </div>
        )}

        {/* Metal ring framing the gem (only once a metal is chosen) */}
        {config.metal && (
          <span
            className="pointer-events-none absolute bottom-4 left-4 rounded-full px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-obsidian/70"
            style={{ background: "rgba(255,255,255,0.7)" }}
          >
            {metalLabel(config)}
          </span>
        )}
      </div>

      {/* Spec list */}
      <div className="px-6 py-6">
        <span className="overline text-carbon/60">Your Configuration</span>
        <dl className="mt-4 divide-y divide-[color:var(--border-soft)]">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-2.5">
              <dt className="font-mono text-caption uppercase tracking-[0.14em] text-carbon/60">
                {label}
              </dt>
              <dd
                className={cn(
                  "font-sans text-body",
                  value ? "text-obsidian" : "text-carbon/30"
                )}
              >
                {value ?? "—"}
              </dd>
            </div>
          ))}
        </dl>

        {/* Price */}
        <div className="mt-5 flex items-baseline justify-between border-t border-obsidian pt-5">
          <span className="font-mono text-caption uppercase tracking-[0.16em] text-carbon">
            {complete ? "Total" : "From"}
          </span>
          <span className="numeric font-mono text-gold" style={{ fontSize: "1.5rem" }}>
            {formatPrice(price)}
          </span>
        </div>

        {/* CTAs */}
        <button
          type="button"
          onClick={onAddToCart}
          disabled={!complete}
          className={cn(
            "mt-5 w-full rounded-button py-3.5 font-mono text-caption uppercase tracking-[0.2em] transition-colors",
            complete
              ? "bg-obsidian text-ivory hover:bg-gold"
              : "cursor-not-allowed bg-champagne text-carbon/40"
          )}
        >
          {complete ? "Add to Cart" : "Complete every step"}
        </button>
        <button
          type="button"
          onClick={onShare}
          className="mt-3 w-full rounded-button border border-obsidian py-3 font-mono text-caption uppercase tracking-[0.18em] text-obsidian transition-colors hover:border-gold hover:text-gold"
        >
          {copied ? "Link Copied ✓" : "Copy Design Link"}
        </button>

        {/* Social share */}
        <div className="mt-5 border-t border-[color:var(--border-soft)] pt-5">
          <ShareButtons
            label="Share your design"
            text={`I designed my own ${config.piece ? config.piece.replace(/s$/, "") : "piece"} at Lumière ✨`}
          />
        </div>
      </div>
    </div>
  );
}
