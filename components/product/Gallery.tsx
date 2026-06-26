"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";
import type { Product } from "@/lib/products";
import { SpinningDiamond } from "./SpinningDiamond";

const luxe = [0.25, 0.46, 0.45, 0.94] as const;

/* Five placeholder "shots" per piece. Real photography drops in later;
   for now each frame is a labelled tonal panel so the strip reads clearly. */
type Frame = { id: string; label: string; tone: string; onModel?: boolean };

function framesFor(product: Product): Frame[] {
  return [
    { id: "front", label: "Front", tone: "bg-champagne" },
    { id: "angle", label: "Three-Quarter", tone: "bg-[#ece2d0]" },
    { id: "detail", label: "Stone Detail", tone: "bg-[#e7ddcb]" },
    { id: "scale", label: "On the Hand", tone: "bg-glacial", onModel: true },
    { id: "model", label: "On Model", tone: "bg-[#dfe4e6]", onModel: true },
  ].map((f) => ({ ...f, id: `${product.id}-${f.id}` }));
}

function IconCube() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2.5l8 4.5v9l-8 4.5-8-4.5v-9l8-4.5z" strokeLinejoin="round" />
      <path d="M4 7l8 4.5L20 7M12 11.5V21" strokeLinejoin="round" />
    </svg>
  );
}

export function Gallery({ product }: { product: Product }) {
  const frames = framesFor(product);
  const [active, setActive] = useState(0);
  const [onModel, setOnModel] = useState(false);
  const [spin, setSpin] = useState(false);

  // When On-Model is on, prefer the first lifestyle frame at rest.
  const visibleFrames = frames;
  const current = visibleFrames[active];

  return (
    <div className="flex flex-col gap-4">
      {/* Main stage */}
      <div className="relative aspect-square w-full overflow-hidden rounded-none bg-champagne">
        <AnimatePresence mode="wait">
          {spin ? (
            <motion.div
              key="spin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-obsidian"
            >
              <SpinningDiamond size={240} />
              <p className="mt-8 font-mono text-caption uppercase tracking-[0.18em] text-ivory/60">
                Drag to rotate
              </p>
              <button
                type="button"
                onClick={() => setSpin(false)}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-caption uppercase tracking-[0.18em] text-ivory link-underline"
              >
                Return to photos
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: luxe }}
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                current.tone
              )}
            >
              <span className="font-mono text-caption uppercase tracking-[0.2em] text-carbon/35">
                {current.onModel ? "On Model" : "Lumière"}
              </span>
              <span className="absolute bottom-4 left-4 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-carbon/45">
                {current.label}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lab Grown badge */}
        {!spin && (
          <Badge variant="eco" className="absolute right-4 top-4">
            Lab Grown
          </Badge>
        )}
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        {/* On-model / product toggle */}
        <button
          type="button"
          onClick={() => {
            setOnModel((v) => {
              const next = !v;
              // Jump to a representative frame for the chosen mode.
              setActive(next ? frames.findIndex((f) => f.onModel) : 0);
              return next;
            });
            setSpin(false);
          }}
          aria-pressed={onModel}
          className="inline-flex items-center gap-2 font-mono text-caption uppercase tracking-[0.16em] text-carbon transition-colors hover:text-obsidian"
        >
          <span
            className={cn(
              "relative h-4 w-7 rounded-full transition-colors duration-300",
              onModel ? "bg-gold" : "bg-rose-gold/50"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all duration-300",
                onModel ? "left-3.5" : "left-0.5"
              )}
            />
          </span>
          On-Model
        </button>

        {/* 360 view */}
        <button
          type="button"
          onClick={() => setSpin((v) => !v)}
          aria-pressed={spin}
          className={cn(
            "inline-flex items-center gap-2 rounded-button border px-4 py-2 font-mono text-caption uppercase tracking-[0.16em] transition-colors",
            spin
              ? "border-gold text-gold"
              : "border-obsidian text-obsidian hover:bg-obsidian hover:text-ivory"
          )}
        >
          <IconCube />
          360° View
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="grid grid-cols-5 gap-3">
        {visibleFrames.map((f, i) => (
          <button
            key={f.id}
            type="button"
            aria-label={f.label}
            aria-pressed={!spin && active === i}
            onClick={() => {
              setActive(i);
              setSpin(false);
              setOnModel(Boolean(f.onModel));
            }}
            className={cn(
              "relative aspect-square overflow-hidden border transition-colors",
              !spin && active === i ? "border-gold" : "border-transparent hover:border-rose-gold"
            )}
          >
            <span className={cn("absolute inset-0 flex items-center justify-center", f.tone)}>
              <span className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-carbon/40">
                {f.onModel ? "Model" : "View"}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
