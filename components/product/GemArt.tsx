import type { GemMotif, Product, Stone } from "@/lib/products";

/**
 * Crystal figurines — a Van Cleef-inspired house motif drawn from faceted
 * marquise "gems". `CrystalMotif` is the reusable primitive (used as
 * decorative art across the site); `GemArt` wraps it for a product, adding
 * the ethereal ground + label and choosing the figurine from the piece.
 *
 * Pure SVG + CSS so it renders in server or client components; motion comes
 * from the gem-float / gem-drift / gem-shimmer keyframes in globals.css.
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

const MOTIFS: GemMotif[] = ["clover", "bloom", "butterfly", "lotus"];

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

function Figurine({
  motif,
  p,
  gradId,
}: {
  motif: GemMotif;
  p: Palette;
  gradId: string;
}) {
  const petalFill = `url(#${gradId})`;
  const facet = p.deep;

  if (motif === "butterfly") {
    return (
      <g>
        <g transform="rotate(-32) translate(0 -2)">
          <Petal length={42} width={20} fill={petalFill} facet={facet} />
        </g>
        <g transform="rotate(32) translate(0 -2)">
          <Petal length={42} width={20} fill={petalFill} facet={facet} />
        </g>
        <g transform="rotate(150) translate(0 -2)">
          <Petal length={30} width={16} fill={petalFill} facet={facet} />
        </g>
        <g transform="rotate(-150) translate(0 -2)">
          <Petal length={30} width={16} fill={petalFill} facet={facet} />
        </g>
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

/**
 * Reusable crystal figurine. Provide a unique `uid` per instance on a page
 * (gradient IDs are namespaced from it). `ground` paints the ethereal
 * radial backdrop + corner vines; omit it for a transparent decorative
 * overlay.
 */
export function CrystalMotif({
  motif = "bloom",
  stone = "White Diamond",
  uid,
  ground = false,
  className,
}: {
  motif?: GemMotif;
  stone?: Stone;
  uid: string;
  ground?: boolean;
  className?: string;
}) {
  const p = STONE_PALETTE[stone] ?? STONE_PALETTE["White Diamond"];
  const petalId = `petal-${uid}`;

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`bg-${uid}`} cx="50%" cy="42%" r="72%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={p.glow} stopOpacity="0.55" />
        </radialGradient>
        <linearGradient id={petalId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.light} />
          <stop offset="100%" stopColor={p.deep} stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={`shine-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {ground && <rect width="200" height="200" fill={`url(#bg-${uid})`} />}

      <g stroke={p.deep} strokeWidth="0.7" fill="none" opacity="0.22" className="gem-drift">
        <path d="M14 30 C 30 22 40 34 34 50 C 30 40 22 38 14 44" />
        <path d="M186 168 C 170 176 160 164 166 148 C 170 158 178 160 186 154" />
        <circle cx="38" cy="22" r="1.4" fill={p.deep} stroke="none" />
        <circle cx="162" cy="176" r="1.4" fill={p.deep} stroke="none" />
      </g>

      <g transform="translate(100 100)">
        <g className="gem-float">
          <Figurine motif={motif} p={p} gradId={petalId} />
        </g>
      </g>

      {ground && (
        <rect
          width="200"
          height="200"
          fill={`url(#shine-${uid})`}
          className="gem-shimmer"
          style={{ mixBlendMode: "screen" }}
        />
      )}
    </svg>
  );
}

/** Product visual — crystal figurine on the ethereal ground, with label. */
export function GemArt({
  product,
  className,
  label,
}: {
  product: Product;
  className?: string;
  label?: string;
}) {
  const motif = product.motif ?? MOTIFS[hash(product.id + product.slug) % MOTIFS.length];

  return (
    <div className={`relative ${className ?? ""}`} aria-hidden="true">
      <CrystalMotif
        motif={motif}
        stone={product.stone}
        uid={`prod-${product.id}`}
        ground
        className="h-full w-full"
      />
      {label && (
        <span className="pointer-events-none absolute bottom-4 left-4 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-carbon/45">
          {label}
        </span>
      )}
    </div>
  );
}
