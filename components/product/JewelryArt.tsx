import type { Cut, Metal, Product, Stone } from "@/lib/products";

/**
 * JewelryArt — every catalogue piece, rendered in code. A faceted gem
 * (cut-aware) is mounted into a category-specific setting (ring band,
 * pendant + chain, earring pair, tennis line / bangle) finished in the
 * piece's metal. Pure SVG + CSS so it renders in server or client trees;
 * motion reuses the gem-float / gem-shimmer keyframes in globals.css.
 */

type StonePalette = { light: string; deep: string; glow: string };
type MetalPalette = { light: string; base: string; shadow: string };

const STONE_PALETTE: Record<Stone, StonePalette> = {
  "White Diamond": { light: "#f6fbfd", deep: "#bcd3dd", glow: "#e8f2f6" },
  "Yellow Diamond": { light: "#faf0c4", deep: "#dcbb52", glow: "#f3e3a0" },
  "Pink Diamond": { light: "#fbe3ea", deep: "#dd97b0", glow: "#f1ccd8" },
  Emerald: { light: "#dcf0e6", deep: "#4f9d77", glow: "#bfe3cf" },
  Sapphire: { light: "#dde9f8", deep: "#5a82bf", glow: "#c0d4ef" },
  Ruby: { light: "#f8d3da", deep: "#bd5366", glow: "#eeb9c2" },
};

const METAL_PALETTE: Record<Metal, MetalPalette> = {
  "Yellow Gold": { light: "#f2e2a4", base: "#d4af37", shadow: "#9c7b1f" },
  "White Gold": { light: "#ffffff", base: "#e7e7e1", shadow: "#b4b4ac" },
  "Rose Gold": { light: "#eeccc0", base: "#c8aa96", shadow: "#9d7c6b" },
  Platinum: { light: "#ffffff", base: "#d0d3d5", shadow: "#a4a9ac" },
};

/* ----------------------------------------------------------------------
   Gem — a faceted stone of a given cut, centred at the origin.
   ---------------------------------------------------------------------- */
function starLines(inner: number, outer: number, n: number, facet: string) {
  return Array.from({ length: n }).map((_, i) => {
    const a = (i / n) * Math.PI * 2;
    return (
      <line
        key={i}
        x1={Math.cos(a) * inner}
        y1={Math.sin(a) * inner}
        x2={Math.cos(a) * outer}
        y2={Math.sin(a) * outer}
        stroke={facet}
        strokeWidth="0.5"
        opacity="0.5"
      />
    );
  });
}

function Gem({
  cut,
  r,
  fill,
  facet,
}: {
  cut: Cut;
  r: number;
  fill: string;
  facet: string;
}) {
  const stroke = { stroke: facet, strokeWidth: 0.9 } as const;

  if (cut === "Princess") {
    const s = r * 0.95;
    return (
      <g>
        <rect x={-s} y={-s} width={s * 2} height={s * 2} fill={fill} {...stroke} />
        <rect x={-s * 0.5} y={-s * 0.5} width={s} height={s} fill="none" stroke={facet} strokeWidth="0.5" opacity="0.5" />
        <line x1={-s} y1={-s} x2={-s * 0.5} y2={-s * 0.5} stroke={facet} strokeWidth="0.5" opacity="0.5" />
        <line x1={s} y1={-s} x2={s * 0.5} y2={-s * 0.5} stroke={facet} strokeWidth="0.5" opacity="0.5" />
        <line x1={-s} y1={s} x2={-s * 0.5} y2={s * 0.5} stroke={facet} strokeWidth="0.5" opacity="0.5" />
        <line x1={s} y1={s} x2={s * 0.5} y2={s * 0.5} stroke={facet} strokeWidth="0.5" opacity="0.5" />
      </g>
    );
  }

  if (cut === "Cushion") {
    const s = r * 0.95;
    return (
      <g>
        <rect x={-s} y={-s} width={s * 2} height={s * 2} rx={s * 0.34} fill={fill} {...stroke} />
        <rect x={-s * 0.52} y={-s * 0.52} width={s * 1.04} height={s * 1.04} rx={s * 0.2} fill="none" stroke={facet} strokeWidth="0.5" opacity="0.5" />
        {starLines(s * 0.55, s * 0.92, 4, facet)}
      </g>
    );
  }

  if (cut === "Oval") {
    return (
      <g>
        <ellipse rx={r * 0.82} ry={r * 1.18} fill={fill} {...stroke} />
        <ellipse rx={r * 0.5} ry={r * 0.72} fill="none" stroke={facet} strokeWidth="0.5" opacity="0.5" />
        {starLines(r * 0.5, r * 0.95, 6, facet)}
      </g>
    );
  }

  if (cut === "Pear") {
    const R = r;
    return (
      <g>
        <path
          d={`M0 ${-R * 1.28} C ${R * 0.92} ${-R * 0.62} ${R * 0.98} ${R * 0.5} 0 ${R * 0.92} C ${-R * 0.98} ${R * 0.5} ${-R * 0.92} ${-R * 0.62} 0 ${-R * 1.28} Z`}
          fill={fill}
          {...stroke}
        />
        <path d={`M0 ${-R * 1.1} L0 ${R * 0.8}`} stroke={facet} strokeWidth="0.5" opacity="0.5" />
        <path d={`M0 ${R * 0.1} L ${R * 0.6} ${-R * 0.2} M0 ${R * 0.1} L ${-R * 0.6} ${-R * 0.2}`} stroke={facet} strokeWidth="0.5" opacity="0.5" />
      </g>
    );
  }

  if (cut === "Emerald Cut") {
    const w = r * 0.78;
    const h = r * 1.05;
    const c = r * 0.34;
    const pts = [
      [-w + c, -h], [w - c, -h], [w, -h + c], [w, h - c],
      [w - c, h], [-w + c, h], [-w, h - c], [-w, -h + c],
    ];
    const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ") + " Z";
    return (
      <g>
        <path d={d} fill={fill} {...stroke} />
        <rect x={-w * 0.62} y={-h * 0.62} width={w * 1.24} height={h * 1.24} fill="none" stroke={facet} strokeWidth="0.5" opacity="0.5" />
        <rect x={-w * 0.34} y={-h * 0.34} width={w * 0.68} height={h * 0.68} fill="none" stroke={facet} strokeWidth="0.45" opacity="0.45" />
      </g>
    );
  }

  // Round (default)
  return (
    <g>
      <circle r={r} fill={fill} {...stroke} />
      <circle r={r * 0.6} fill="none" stroke={facet} strokeWidth="0.5" opacity="0.5" />
      {starLines(r * 0.6, r * 0.98, 8, facet)}
    </g>
  );
}

/** Four claw prongs around a gem of radius r. */
function Prongs({ r, metal }: { r: number; metal: string }) {
  const d = r * 0.82;
  return (
    <g fill={metal} stroke="rgba(0,0,0,0.12)" strokeWidth="0.4">
      <circle cx={-d} cy={-d} r={r * 0.16} />
      <circle cx={d} cy={-d} r={r * 0.16} />
      <circle cx={-d} cy={d} r={r * 0.16} />
      <circle cx={d} cy={d} r={r * 0.16} />
    </g>
  );
}

/* ----------------------------------------------------------------------
   Category settings
   ---------------------------------------------------------------------- */
function Ring({ cut, stone, metal }: { cut: Cut; stone: string; metal: string }) {
  return (
    <g>
      <ellipse cx={100} cy={168} rx={38} ry={6} fill="rgba(26,26,24,0.06)" />
      {/* band */}
      <ellipse cx={100} cy={120} rx={40} ry={45} fill="none" stroke={metal} strokeWidth="13" strokeLinecap="round" />
      <ellipse cx={100} cy={120} rx={40} ry={45} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
      {/* head + stone */}
      <g transform="translate(100 70)">
        <Prongs r={22} metal={metal} />
        <Gem cut={cut as Cut} r={22} fill={stone} facet="currentColor" />
      </g>
    </g>
  );
}

function Necklace({ cut, stone, metal }: { cut: Cut; stone: string; metal: string }) {
  return (
    <g>
      {/* chain drape */}
      <path d="M34 52 Q100 150 166 52" fill="none" stroke={metal} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M34 52 Q100 150 166 52" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
      {/* bail */}
      <circle cx={100} cy={100} r={5} fill="none" stroke={metal} strokeWidth="3" />
      {/* pendant */}
      <g transform="translate(100 124)">
        <Prongs r={19} metal={metal} />
        <Gem cut={cut as Cut} r={19} fill={stone} facet="currentColor" />
      </g>
    </g>
  );
}

function Earrings({ cut, stone, metal }: { cut: Cut; stone: string; metal: string }) {
  const drop = cut === "Pear" || cut === "Oval";
  const One = ({ x }: { x: number }) =>
    drop ? (
      <g transform={`translate(${x} 0)`}>
        <g transform="translate(0 70)">
          <Prongs r={9} metal={metal} />
          <Gem cut="Round" r={9} fill={stone} facet="currentColor" />
        </g>
        <line x1={0} y1={79} x2={0} y2={92} stroke={metal} strokeWidth="2" />
        <g transform="translate(0 112)">
          <Prongs r={17} metal={metal} />
          <Gem cut={cut as Cut} r={17} fill={stone} facet="currentColor" />
        </g>
      </g>
    ) : (
      <g transform={`translate(${x} 96)`}>
        <Prongs r={18} metal={metal} />
        <Gem cut={cut as Cut} r={18} fill={stone} facet="currentColor" />
      </g>
    );
  return (
    <g>
      <One x={70} />
      <One x={130} />
    </g>
  );
}

function Bracelet({
  cut,
  stone,
  metal,
  bangle,
}: {
  cut: Cut;
  stone: string;
  metal: string;
  bangle: boolean;
}) {
  if (bangle) {
    return (
      <g>
        <ellipse cx={100} cy={106} rx={62} ry={44} fill="none" stroke={metal} strokeWidth="12" />
        <ellipse cx={100} cy={106} rx={62} ry={44} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
        <g transform="translate(100 62)">
          <Prongs r={15} metal={metal} />
          <Gem cut={cut as Cut} r={15} fill={stone} facet="currentColor" />
        </g>
      </g>
    );
  }
  // Tennis line — a gentle arc of set stones
  const n = 7;
  const items = Array.from({ length: n }).map((_, i) => {
    const t = i / (n - 1);
    const x = 36 + t * 128;
    const y = 104 + Math.sin(t * Math.PI) * 26; // shallow downward arc
    return { x, y };
  });
  return (
    <g>
      {/* link rail */}
      <path
        d={`M${items[0].x} ${items[0].y} ${items
          .slice(1)
          .map((p) => `L${p.x} ${p.y}`)
          .join(" ")}`}
        fill="none"
        stroke={metal}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {items.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y})`}>
          <rect x={-8} y={-8} width={16} height={16} rx={2} fill="none" stroke={metal} strokeWidth="2" />
          <Gem cut={cut as Cut} r={7.5} fill={stone} facet="currentColor" />
        </g>
      ))}
    </g>
  );
}

/* ----------------------------------------------------------------------
   JewelryArt
   ---------------------------------------------------------------------- */
export function JewelryArt({
  product,
  className,
  label,
}: {
  product: Product;
  className?: string;
  label?: string;
}) {
  const uid = `jwl-${product.id}`;
  const sp = STONE_PALETTE[product.stone] ?? STONE_PALETTE["White Diamond"];
  const mp = METAL_PALETTE[product.metal] ?? METAL_PALETTE["White Gold"];
  const stoneFill = `url(#stone-${uid})`;
  const metalStroke = `url(#metal-${uid})`;
  const bangle = /bangle/i.test(product.name) || /bangle/i.test(product.descriptor);

  let setting: React.ReactNode;
  if (product.category === "rings") {
    setting = <Ring cut={product.cut} stone={stoneFill} metal={metalStroke} />;
  } else if (product.category === "necklaces") {
    setting = <Necklace cut={product.cut} stone={stoneFill} metal={metalStroke} />;
  } else if (product.category === "earrings") {
    setting = <Earrings cut={product.cut} stone={stoneFill} metal={metalStroke} />;
  } else {
    setting = <Bracelet cut={product.cut} stone={stoneFill} metal={metalStroke} bangle={bangle} />;
  }

  return (
    <div className={`relative ${className ?? ""}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="h-full w-full" role="presentation">
        <defs>
          <radialGradient id={`bg-${uid}`} cx="50%" cy="40%" r="72%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="58%" stopColor="#ffffff" />
            <stop offset="100%" stopColor={sp.glow} stopOpacity="0.5" />
          </radialGradient>
          <linearGradient id={`stone-${uid}`} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor={sp.light} />
            <stop offset="100%" stopColor={sp.deep} stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id={`metal-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={mp.light} />
            <stop offset="50%" stopColor={mp.base} />
            <stop offset="100%" stopColor={mp.shadow} />
          </linearGradient>
          <linearGradient id={`shine-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="200" height="200" fill={`url(#bg-${uid})`} />

        {/* faint corner flourishes */}
        <g stroke={sp.deep} strokeWidth="0.7" fill="none" opacity="0.18" className="gem-drift">
          <path d="M16 30 C 30 22 40 34 34 50 C 30 40 22 38 16 44" />
          <circle cx="38" cy="22" r="1.3" fill={sp.deep} stroke="none" />
          <path d="M184 170 C 170 178 160 166 166 150 C 170 160 178 162 184 156" />
        </g>

        {/* the piece — gentle float; facet ink = stone deep tone */}
        <g className="gem-float" style={{ color: sp.deep }}>
          {setting}
        </g>

        <rect
          width="200"
          height="200"
          fill={`url(#shine-${uid})`}
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
