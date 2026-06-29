import type { Product, Stone } from "@/lib/products";

/**
 * GemArt — a Van Cleef-inspired crystal figurine, drawn from faceted
 * marquise "gems" on an ethereal radiant ground. Used as the product
 * visual wherever a photograph isn't supplied. Pure SVG + CSS so it can
 * render inside server or client components; motion comes from gentle
 * float + shimmer keyframes defined in globals.css.
 *
 * Each piece is deterministic: the motif (clover · bloom · butterfly ·
 * lotus) and palette are derived from the product so a given piece always
 * shows the same figurine.
 */

type Palette = { light: string; deep: string; glow: string };

const STONE_PALETTE: Record<Stone, Palette> = {
  "White Diamond": { light: "#f4f9fb", deep: "#cddee6", glow: "#e8f2f6" },
  "Yellow Diamond": { light: "#f8edbf", deep: "#e3c560", glow: "#f3e3a0" },
  "Pink Diamond": { light: "#f8dde4", deep: "#e3a6bd", glow: "#f1ccd8" },
  Emerald: { light: "#d4ece0", deep: "#6aae8c", glow: "#bfe3cf" },
  Sapphire: { light: "#d3e2f4", deep: "#6f93c8", glow: "#c0d4ef" },
  Ruby: { light: "#f4ccd3", deep: "#c66c7e", glow: "#eeb9c2" },
};

type Motif = "clover" | "bloom" | "butterfly" | "lotus";
const MOTIFS: Motif[] = ["clover", "bloom", "butterfly", "lotus"];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** A faceted marquise petal whose base sits at the origin, tip pointing up. */
function Petal({
  length,
  width,
  fill,
  facet,
}: {
  length: number;
  width: number;
  fill: string;
  facet: string;
}) {
  const L = length;
  const W = width;
  return (
    <g>
      <path
        d={`M0 0 C ${W} ${-L * 0.32} ${W} ${-L * 0.72} 0 ${-L} C ${-W} ${-L * 0.72} ${-W} ${-L * 0.32} 0 0 Z`}
        fill={fill}
        stroke={facet}
        strokeWidth="0.6"
      />
      {/* central facet ridge */}
      <path d={`M0 0 L0 ${-L}`} stroke={facet} strokeWidth="0.5" opacity="0.55" />
      <path
        d={`M0 ${-L * 0.5} L ${W * 0.62} ${-L * 0.42} M0 ${-L * 0.5} L ${-W * 0.62} ${-L * 0.42}`}
        stroke={facet}
        strokeWidth="0.4"
        opacity="0.45"
      />
    </g>
  );
}

function RoundStone({ r, fill, facet }: { r: number; fill: string; facet: string }) {
  return (
    <g>
      <circle r={r} fill={fill} stroke={facet} strokeWidth="0.6" />
      <path
        d={`M${-r} 0 L${r} 0 M0 ${-r} L0 ${r} M${-r * 0.7} ${-r * 0.7} L${r * 0.7} ${r * 0.7} M${-r * 0.7} ${r * 0.7} L${r * 0.7} ${-r * 0.7}`}
        stroke={facet}
        strokeWidth="0.3"
        opacity="0.4"
      />
    </g>
  );
}

function Figurine({ motif, p }: { motif: Motif; p: Palette }) {
  const petalFill = `url(#petalGrad)`;
  const facet = p.deep;

  if (motif === "butterfly") {
    return (
      <g>
        {/* upper wings */}
        <g transform="rotate(-32) translate(0 -2)">
          <Petal length={42} width={20} fill={petalFill} facet={facet} />
        </g>
        <g transform="rotate(32) translate(0 -2)">
          <Petal length={42} width={20} fill={petalFill} facet={facet} />
        </g>
        {/* lower wings */}
        <g transform="rotate(150) translate(0 -2)">
          <Petal length={30} width={16} fill={petalFill} facet={facet} />
        </g>
        <g transform="rotate(-150) translate(0 -2)">
          <Petal length={30} width={16} fill={petalFill} facet={facet} />
        </g>
        {/* body + antennae */}
        <path d="M0 -22 L0 20" stroke={facet} strokeWidth="1.4" strokeLinecap="round" />
        <path
          d="M0 -22 C 8 -34 12 -36 16 -40 M0 -22 C -8 -34 -12 -36 -16 -40"
          stroke={facet}
          strokeWidth="0.9"
          fill="none"
          strokeLinecap="round"
        />
        <g transform="translate(0 -4)">
          <RoundStone r={4.5} fill={p.light} facet={facet} />
        </g>
      </g>
    );
  }

  // Radial floral motifs: clover (4), bloom (5), lotus (8)
  const count = motif === "clover" ? 4 : motif === "bloom" ? 5 : 8;
  const len = motif === "clover" ? 40 : motif === "lotus" ? 34 : 42;
  const wid = motif === "clover" ? 26 : motif === "lotus" ? 12 : 16;

  return (
    <g>
      {Array.from({ length: count }).map((_, i) => (
        <g key={i} transform={`rotate(${(360 / count) * i})`}>
          <Petal length={len} width={wid} fill={petalFill} facet={facet} />
        </g>
      ))}
      <RoundStone r={motif === "clover" ? 8 : 6.5} fill={p.light} facet={facet} />
    </g>
  );
}

export function GemArt({
  product,
  className,
  label,
}: {
  product: Product;
  className?: string;
  label?: string;
}) {
  const seed = hash(product.id + product.slug);
  const motif = MOTIFS[seed % MOTIFS.length];
  const p = STONE_PALETTE[product.stone] ?? STONE_PALETTE["White Diamond"];
  const gid = `g-${product.id}`;

  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 200 200"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
      >
        <defs>
          <radialGradient id={`bg-${gid}`} cx="50%" cy="42%" r="72%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#ffffff" />
            <stop offset="100%" stopColor={p.glow} stopOpacity="0.55" />
          </radialGradient>
          <linearGradient id="petalGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={p.light} />
            <stop offset="100%" stopColor={p.deep} stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id={`shine-${gid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ethereal ground */}
        <rect width="200" height="200" fill={`url(#bg-${gid})`} />

        {/* Faint van-cleef vine flourishes in the corners */}
        <g stroke={p.deep} strokeWidth="0.7" fill="none" opacity="0.22" className="gem-drift">
          <path d="M14 30 C 30 22 40 34 34 50 C 30 40 22 38 14 44" />
          <path d="M186 168 C 170 176 160 164 166 148 C 170 158 178 160 186 154" />
          <circle cx="38" cy="22" r="1.4" fill={p.deep} stroke="none" />
          <circle cx="162" cy="176" r="1.4" fill={p.deep} stroke="none" />
        </g>

        {/* Crystal figurine */}
        <g transform="translate(100 100)">
          <g className="gem-float">
            <Figurine motif={motif} p={p} />
          </g>
        </g>

        {/* slow shimmer sweep */}
        <rect
          width="200"
          height="200"
          fill={`url(#shine-${gid})`}
          className="gem-shimmer"
          style={{ mixBlendMode: "screen" }}
        />
      </svg>
      {label && (
        <span className="pointer-events-none absolute bottom-4 left-4 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-carbon/45">
          {label}
        </span>
      )}
    </div>
  );
}
