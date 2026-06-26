"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * SpinningDiamond — a pure-CSS 3D faceted gem.
 *
 * Construction: two square-based pyramids joined at a girdle (an
 * octahedron). The crown (top) has 4 triangular facets, the pavilion
 * (bottom) another 4. Each facet is a thin triangle made with clip-path,
 * absolutely stacked and rotated around the vertical axis, then folded
 * up/down. The whole assembly auto-rotates on Y (8s loop). Pointer drag
 * adds a manual yaw/pitch offset and pauses the idle spin.
 *
 * No WebGL, no dependencies — it degrades gracefully and respects
 * prefers-reduced-motion (the keyframe simply doesn't run).
 */
export function SpinningDiamond({ size = 220 }: { size?: number }) {
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(-12);
  const [dragging, setDragging] = useState(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => {
      if (!last.current) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };
      setYaw((y) => y + dx * 0.6);
      setPitch((p) => Math.max(-60, Math.min(60, p - dy * 0.4)));
    };
    const onUp = () => {
      setDragging(false);
      last.current = null;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging]);

  const half = size / 2;
  // Crown facets sit just above the girdle; pavilion mirror below.
  const facets = [0, 1, 2, 3];

  return (
    <div
      className="flex items-center justify-center"
      style={{ perspective: `${size * 4}px` }}
    >
      <div
        role="img"
        aria-label="Interactive 3D view of the diamond"
        onPointerDown={(e) => {
          setDragging(true);
          last.current = { x: e.clientX, y: e.clientY };
        }}
        className={cn(
          "relative touch-none select-none",
          dragging ? "cursor-grabbing" : "cursor-grab"
        )}
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
          transform: `rotateX(${pitch}deg) rotateY(${yaw}deg)`,
        }}
      >
        <div
          className={dragging ? "" : "diamond-spin"}
          style={{
            width: size,
            height: size,
            transformStyle: "preserve-3d",
            position: "relative",
          }}
        >
          {/* Crown — 4 facets folded upward to a top apex */}
          {facets.map((i) => (
            <span
              key={`c${i}`}
              className="diamond-facet"
              style={{
                width: size,
                height: half,
                left: 0,
                top: 0,
                clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                transformOrigin: "bottom center",
                transform: `translateY(0) rotateY(${i * 90}deg) rotateX(38deg)`,
                background:
                  i % 2 === 0
                    ? "linear-gradient(160deg, rgba(255,255,255,0.92), rgba(212,175,55,0.45) 55%, rgba(120,150,200,0.55))"
                    : "linear-gradient(200deg, rgba(230,238,255,0.85), rgba(200,170,150,0.4) 60%, rgba(212,175,55,0.4))",
              }}
            />
          ))}
          {/* Pavilion — 4 facets folded downward to a bottom culet */}
          {facets.map((i) => (
            <span
              key={`p${i}`}
              className="diamond-facet"
              style={{
                width: size,
                height: size * 0.72,
                left: 0,
                top: half,
                clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
                transformOrigin: "top center",
                transform: `rotateY(${i * 90}deg) rotateX(-32deg)`,
                background:
                  i % 2 === 0
                    ? "linear-gradient(20deg, rgba(120,150,200,0.6), rgba(212,175,55,0.35) 50%, rgba(255,255,255,0.85))"
                    : "linear-gradient(340deg, rgba(212,175,55,0.45), rgba(200,170,150,0.4) 50%, rgba(230,238,255,0.8))",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
