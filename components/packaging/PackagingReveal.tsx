"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * PackagingReveal — a pure-CSS 3D jewellery box that opens its lid.
 *
 * Construction: a five-face box (four walls + floor) holds a cream satin
 * interior with a small "gem". A hinged lid sits on top and rotates open
 * around its back edge. The reveal fires when the box scrolls into view
 * (respecting reduced-motion via CSS), and a button lets you replay it.
 *
 * No WebGL, no dependencies — transforms + transitions only.
 */
export function PackagingReveal() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: false, margin: "-15% 0px" });
  const [open, setOpen] = useState(false);

  // Open automatically the first time it enters the viewport.
  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setOpen(true), 350);
      return () => clearTimeout(t);
    }
  }, [inView]);

  return (
    <div ref={wrapRef} className="flex flex-col items-center">
      <div
        className="relative"
        style={{ perspective: "1100px", width: 280, height: 260 }}
      >
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: 200,
            height: 140,
            transformStyle: "preserve-3d",
            transform: "translate(-50%, -50%) rotateX(58deg) rotateZ(-38deg)",
          }}
        >
          {/* Floor */}
          <Face
            w={200}
            h={140}
            className="bg-obsidian"
            style={{ transform: "translateZ(0px)" }}
          >
            {/* Cream satin interior + gem */}
            <span className="absolute inset-[6px] bg-[#efe6d6]" />
            <span
              className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gradient-to-br from-white via-glacial to-gold"
              aria-hidden
            />
          </Face>

          {/* Walls */}
          <Wall side="front" boxW={200} boxH={140} depth={44} />
          <Wall side="back" boxW={200} boxH={140} depth={44} />
          <Wall side="left" boxW={200} boxH={140} depth={44} />
          <Wall side="right" boxW={200} boxH={140} depth={44} />

          {/* Lid — hinged at the back edge, lifts up + back when open */}
          <div
            className="absolute left-0 top-0"
            style={{
              width: 200,
              height: 140,
              transformStyle: "preserve-3d",
              transformOrigin: "top center",
              transition: "transform 1100ms cubic-bezier(0.25,0.46,0.45,0.94)",
              transform: `translateZ(44px) rotateX(${open ? -118 : 0}deg)`,
            }}
          >
            <Face
              w={200}
              h={140}
              className="flex items-center justify-center bg-[#141414]"
              style={{ transform: "translateZ(8px)" }}
            >
              {/* Embossed gold wordmark */}
              <span className="font-display text-[1.5rem] tracking-[0.12em] text-gold/90 drop-shadow-[0_1px_0_rgba(0,0,0,0.6)]">
                Lumière
              </span>
            </Face>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close the box" : "Open the box"}
        className="mt-6 rounded-button border border-[color:var(--border-soft)] px-6 py-3 font-mono text-caption uppercase tracking-[0.2em] text-carbon transition-colors hover:border-obsidian focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        {open ? "Close" : "Open"} the box
      </button>
    </div>
  );
}

function Face({
  w,
  h,
  className,
  style,
  children,
}: {
  w: number;
  h: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`absolute left-0 top-0 ${className ?? ""}`}
      style={{ width: w, height: h, ...style }}
    >
      {children}
    </div>
  );
}

/** One vertical wall of the box, placed by side. */
function Wall({
  side,
  boxW,
  boxH,
  depth,
}: {
  side: "front" | "back" | "left" | "right";
  boxW: number;
  boxH: number;
  depth: number;
}) {
  const common = "absolute left-0 top-0 bg-[#1f1f1d]";
  if (side === "front") {
    return (
      <div
        className={common}
        style={{
          width: boxW,
          height: depth,
          transformOrigin: "top center",
          transform: `translateY(${boxH}px) rotateX(-90deg)`,
        }}
      />
    );
  }
  if (side === "back") {
    return (
      <div
        className={common}
        style={{
          width: boxW,
          height: depth,
          transformOrigin: "top center",
          transform: `rotateX(-90deg)`,
        }}
      />
    );
  }
  if (side === "left") {
    return (
      <div
        className={common}
        style={{
          width: depth,
          height: boxH,
          transformOrigin: "left center",
          transform: `rotateY(90deg)`,
        }}
      />
    );
  }
  return (
    <div
      className={common}
      style={{
        width: depth,
        height: boxH,
        transformOrigin: "left center",
        transform: `translateX(${boxW}px) rotateY(90deg)`,
      }}
    />
  );
}
