"use client";

/**
 * A pure-CSS mockup of the Lumière presentation box — matte obsidian shell,
 * gold-embossed monogram, satin interior. When `open`, the lid lifts on a 3D
 * hinge to reveal the satin bed (used on the confirmation page). When closed,
 * it's a flat-lidded box for the cart's "every order, beautifully wrapped"
 * callout.
 *
 * No images, no canvas — just transforms, so it animates on the GPU and scales
 * crisply at any size. Sized via the `size` prop (the box is square-ish).
 */
export function LumiereBox({
  open = false,
  size = 180,
  className,
}: {
  open?: boolean;
  size?: number;
  className?: string;
}) {
  const lidH = Math.round(size * 0.34);
  const baseH = Math.round(size * 0.5);

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        perspective: size * 3,
        perspectiveOrigin: "50% 30%",
      }}
      aria-hidden="true"
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: "rotateX(52deg) rotateZ(-2deg)",
          transition: "transform 1.2s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      >
        {/* Base — the satin-lined well */}
        <div
          style={{
            position: "absolute",
            left: "12%",
            top: "26%",
            width: "76%",
            height: baseH,
            borderRadius: 8,
            background:
              "linear-gradient(150deg, #232320 0%, #15150f 60%, #0d0d09 100%)",
            boxShadow:
              "inset 0 2px 10px rgba(0,0,0,0.6), 0 18px 40px rgba(0,0,0,0.45)",
          }}
        >
          {/* Satin interior */}
          <div
            style={{
              position: "absolute",
              inset: "10%",
              borderRadius: 5,
              background:
                "radial-gradient(120% 120% at 50% 0%, #efe6d6 0%, #d8cbb2 55%, #b8a98a 100%)",
              boxShadow: "inset 0 0 14px rgba(0,0,0,0.18)",
            }}
          >
            {/* Pillow seam */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "12%",
                bottom: "12%",
                width: 1,
                transform: "translateX(-0.5px)",
                background:
                  "linear-gradient(to bottom, transparent, rgba(120,100,70,0.35), transparent)",
              }}
            />
            {/* A whisper of the ring inside */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: size * 0.12,
                height: size * 0.12,
                marginLeft: -(size * 0.06),
                marginTop: -(size * 0.06),
                borderRadius: "50%",
                border: `${Math.max(2, size * 0.018)}px solid #cdb36a`,
                boxShadow:
                  "0 0 10px rgba(205,179,106,0.7), inset 0 0 4px rgba(255,255,255,0.5)",
              }}
            />
          </div>
        </div>

        {/* Lid — hinged at the back, lifts when open */}
        <div
          style={{
            position: "absolute",
            left: "10%",
            top: "22%",
            width: "80%",
            height: lidH,
            transformOrigin: "50% 0%",
            transformStyle: "preserve-3d",
            transform: open ? "rotateX(-118deg)" : "rotateX(0deg)",
            transition: "transform 1.1s cubic-bezier(0.34,1.2,0.5,1)",
          }}
        >
          {/* Lid top face */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 8,
              background:
                "linear-gradient(150deg, #2a2a26 0%, #1a1a16 55%, #111110 100%)",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Gold-embossed monogram */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: size * 0.03,
                color: "#cdb36a",
                textShadow: "0 1px 0 rgba(0,0,0,0.5)",
              }}
            >
              <span style={{ fontSize: size * 0.13, lineHeight: 1 }}>◆</span>
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: size * 0.055,
                  letterSpacing: size * 0.012,
                  textTransform: "uppercase",
                }}
              >
                Lumière
              </span>
            </div>
          </div>
          {/* Lid underside (seen when open) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 8,
              transform: "rotateX(180deg)",
              backfaceVisibility: "hidden",
              background:
                "linear-gradient(150deg, #efe6d6 0%, #d8cbb2 100%)",
              boxShadow: "inset 0 0 12px rgba(0,0,0,0.15)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
