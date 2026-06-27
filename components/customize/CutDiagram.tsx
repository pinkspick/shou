import type { Cut } from "@/lib/products";

/**
 * Schematic facet diagrams for the six cuts. Each is a top-view outline with
 * a table + crown facets, rendered in the chosen stone colour. Deliberately
 * geometric (line art) rather than photoreal — it reads as a spec drawing.
 */
export function CutDiagram({
  cut,
  fill,
  size = 96,
  className,
}: {
  cut: Cut;
  fill: string;
  size?: number;
  className?: string;
}) {
  const stroke = "rgba(26,26,24,0.55)";
  const common = {
    fill,
    stroke,
    strokeWidth: 1,
    strokeLinejoin: "round" as const,
  };
  const facet = {
    fill: "none",
    stroke: "rgba(26,26,24,0.32)",
    strokeWidth: 0.8,
  };

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={`${cut} cut`}
    >
      {/* soft glow behind the gem */}
      <defs>
        <radialGradient id={`glow-${cut.replace(/\s/g, "")}`} cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {cut === "Round" && (
        <g>
          <circle cx="50" cy="50" r="40" {...common} />
          <circle cx="50" cy="50" r="22" {...facet} />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            const a2 = ((i + 0.5) / 8) * Math.PI * 2;
            return (
              <g key={i}>
                <line
                  x1={50 + 22 * Math.cos(a)}
                  y1={50 + 22 * Math.sin(a)}
                  x2={50 + 40 * Math.cos(a)}
                  y2={50 + 40 * Math.sin(a)}
                  {...facet}
                />
                <line
                  x1={50 + 22 * Math.cos(a2)}
                  y1={50 + 22 * Math.sin(a2)}
                  x2={50 + 40 * Math.cos(a2)}
                  y2={50 + 40 * Math.sin(a2)}
                  {...facet}
                />
              </g>
            );
          })}
        </g>
      )}

      {cut === "Princess" && (
        <g>
          <rect x="14" y="14" width="72" height="72" {...common} />
          <rect x="30" y="30" width="40" height="40" {...facet} />
          <line x1="14" y1="14" x2="30" y2="30" {...facet} />
          <line x1="86" y1="14" x2="70" y2="30" {...facet} />
          <line x1="14" y1="86" x2="30" y2="70" {...facet} />
          <line x1="86" y1="86" x2="70" y2="70" {...facet} />
        </g>
      )}

      {cut === "Cushion" && (
        <g>
          <rect x="14" y="14" width="72" height="72" rx="20" {...common} />
          <rect x="30" y="30" width="40" height="40" rx="10" {...facet} />
          <line x1="20" y1="20" x2="33" y2="33" {...facet} />
          <line x1="80" y1="20" x2="67" y2="33" {...facet} />
          <line x1="20" y1="80" x2="33" y2="67" {...facet} />
          <line x1="80" y1="80" x2="67" y2="67" {...facet} />
        </g>
      )}

      {cut === "Oval" && (
        <g>
          <ellipse cx="50" cy="50" rx="28" ry="40" {...common} />
          <ellipse cx="50" cy="50" rx="15" ry="22" {...facet} />
          <line x1="50" y1="10" x2="50" y2="28" {...facet} />
          <line x1="50" y1="72" x2="50" y2="90" {...facet} />
          <line x1="22" y1="50" x2="35" y2="50" {...facet} />
          <line x1="65" y1="50" x2="78" y2="50" {...facet} />
        </g>
      )}

      {cut === "Pear" && (
        <g>
          <path
            d="M50 10 C66 30 78 46 78 62 A28 28 0 0 1 22 62 C22 46 34 30 50 10 Z"
            {...common}
          />
          <ellipse cx="50" cy="58" rx="15" ry="18" {...facet} />
          <line x1="50" y1="18" x2="50" y2="40" {...facet} />
          <line x1="28" y1="62" x2="35" y2="58" {...facet} />
          <line x1="72" y1="62" x2="65" y2="58" {...facet} />
        </g>
      )}

      {cut === "Emerald Cut" && (
        <g>
          <path
            d="M30 12 H70 L88 30 V70 L70 88 H30 L12 70 V30 Z"
            {...common}
          />
          <path
            d="M36 26 H64 L74 36 V64 L64 74 H36 L26 64 V36 Z"
            {...facet}
          />
          <rect x="40" y="40" width="20" height="20" {...facet} />
          <line x1="50" y1="30" x2="50" y2="40" {...facet} />
          <line x1="50" y1="60" x2="50" y2="70" {...facet} />
        </g>
      )}

      <rect x="0" y="0" width="100" height="100" fill={`url(#glow-${cut.replace(/\s/g, "")})`} pointerEvents="none" />
    </svg>
  );
}
