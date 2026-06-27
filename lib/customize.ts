/**
 * Lumière — custom configurator (/customize) data + URL (de)serialization.
 *
 * The build is held in a single CustomConfig object. It round-trips to the
 * query string so a configuration is shareable, e.g.
 *   /customize?piece=ring&occasion=anniversary&metal=18k-rose&stone=pink-diamond&cut=oval&size=6.5
 */
import {
  CUTS,
  GOLD_CARATS,
  METALS,
  STONES,
  type Carat,
  type Category,
  type Cut,
  type Metal,
  type Stone,
} from "./products";

export type CustomOccasion =
  | "Birthday"
  | "Anniversary"
  | "Wedding"
  | "Self-Purchase"
  | "Gift";

export type CustomConfig = {
  piece: Category | null;
  occasion: CustomOccasion | null;
  metal: Metal | null;
  carat: Carat | null; // gold purity; "Platinum" when the metal is platinum
  stone: Stone | null;
  cut: Cut | null;
  size: string | null; // ring size / chain length / closure (per piece)
};

export const EMPTY_CONFIG: CustomConfig = {
  piece: null,
  occasion: null,
  metal: null,
  carat: null,
  stone: null,
  cut: null,
  size: null,
};

/* ---- Step 1 — piece type ---- */
type PieceOption = { value: Category; slug: string; label: string; blurb: string };
export const PIECE_OPTIONS: PieceOption[] = [
  { value: "rings", slug: "ring", label: "Ring", blurb: "A vow rendered for the hand." },
  { value: "necklaces", slug: "necklace", label: "Necklace", blurb: "Light gathered at the collarbone." },
  { value: "bracelets", slug: "bracelet", label: "Bracelet", blurb: "A line of brilliance along the wrist." },
  { value: "earrings", slug: "earring", label: "Earring", blurb: "The closest light to the face." },
];

/* ---- Step 2 — occasion ---- */
type OccasionOption = {
  value: CustomOccasion;
  slug: string;
  label: string;
  blurb: string;
  page: "birthday" | "anniversary" | "wedding" | null;
};
export const OCCASION_OPTIONS: OccasionOption[] = [
  { value: "Birthday", slug: "birthday", label: "Birthday", blurb: "A year brighter — marked in light.", page: "birthday" },
  { value: "Anniversary", slug: "anniversary", label: "Anniversary", blurb: "Another orbit, together.", page: "anniversary" },
  { value: "Wedding", slug: "wedding", label: "Wedding", blurb: "The promise made permanent.", page: "wedding" },
  { value: "Self-Purchase", slug: "self", label: "Self-Purchase", blurb: "For no approval but your own.", page: null },
  { value: "Gift", slug: "gift", label: "Gift", blurb: "Wrapped, ready, unforgettable.", page: null },
];

/* ---- Step 4 — stone colour previews ---- */
export const STONE_SWATCH: Record<Stone, string> = {
  "White Diamond": "linear-gradient(135deg,#ffffff,#e9eef2 45%,#cfd6dc)",
  "Yellow Diamond": "linear-gradient(135deg,#fff6cf,#f3d469 55%,#d8af2e)",
  "Pink Diamond": "linear-gradient(135deg,#ffe5ec,#f4b9c7 55%,#e487a0)",
  Emerald: "linear-gradient(135deg,#9fe6c8,#2e8b6f 55%,#1e5e4b)",
  Sapphire: "linear-gradient(135deg,#9db8f0,#2b4f9e 55%,#1b346e)",
  Ruby: "linear-gradient(135deg,#f0a3b1,#b3243b 55%,#7e1528)",
};

/** Solid representative colour (for SVG gem fills). */
export const STONE_HEX: Record<Stone, string> = {
  "White Diamond": "#dfe6ec",
  "Yellow Diamond": "#f3d469",
  "Pink Diamond": "#f4b9c7",
  Emerald: "#2e8b6f",
  Sapphire: "#2b4f9e",
  Ruby: "#b3243b",
};

/* ---- Step 6 — size, per piece ---- */
export type SizeOption = { value: string; label: string; note?: string };
export function sizeStepFor(piece: Category): {
  heading: string;
  helper: string;
  options: SizeOption[];
} {
  switch (piece) {
    case "rings": {
      const options: SizeOption[] = [];
      for (let s = 4; s <= 12; s += 0.5) {
        options.push({
          value: String(s),
          label: Number.isInteger(s) ? String(s) : s.toFixed(1),
        });
      }
      return {
        heading: "Choose Your Ring Size",
        helper: "US sizing, 4–12 in half steps. Unsure? Book a complimentary sizing.",
        options,
      };
    }
    case "necklaces":
      return {
        heading: "Choose Chain Length",
        helper: "Measured in inches, from choker to opera.",
        options: [
          { value: "16in", label: '16"', note: "Choker" },
          { value: "18in", label: '18"', note: "Princess" },
          { value: "20in", label: '20"', note: "Matinee" },
          { value: "22in", label: '22"', note: "Matinee" },
          { value: "24in", label: '24"', note: "Opera" },
        ],
      };
    case "bracelets":
      return {
        heading: "Choose Bracelet Length",
        helper: "Measured in inches around the wrist.",
        options: [
          { value: "6.5in", label: '6.5"', note: "Petite" },
          { value: "7in", label: '7"', note: "Standard" },
          { value: "7.5in", label: '7.5"', note: "Comfort" },
          { value: "8in", label: '8"', note: "Large" },
        ],
      };
    case "earrings":
    default:
      return {
        heading: "Choose Closure",
        helper: "How the earring secures to the ear.",
        options: [
          { value: "push", label: "Push Back", note: "Everyday" },
          { value: "lever", label: "Lever Back", note: "Secure" },
          { value: "screw", label: "Screw Back", note: "Most secure" },
        ],
      };
  }
}

export function sizeLabelFor(piece: Category, value: string): string {
  const opt = sizeStepFor(piece).options.find((o) => o.value === value);
  if (!opt) return value;
  return opt.note ? `${opt.label} · ${opt.note}` : opt.label;
}

export function metalLabel(config: CustomConfig): string {
  if (!config.metal) return "";
  if (config.metal === "Platinum") return "Platinum";
  return `${config.carat ?? "18K"} ${config.metal}`;
}

/* ---- URL (de)serialization ---- */
const COLOR_SLUG: Record<Metal, string> = {
  "Yellow Gold": "yellow",
  "White Gold": "white",
  "Rose Gold": "rose",
  Platinum: "platinum",
};
const caratSlug = (k: Carat) => k.toLowerCase();
const stoneSlug = (s: Stone) => s.toLowerCase().replace(/ /g, "-");
const cutSlug = (c: Cut) => c.toLowerCase().replace(/ /g, "-");
const pieceSlug = (p: Category) =>
  PIECE_OPTIONS.find((o) => o.value === p)?.slug ?? p;
const occSlug = (o: CustomOccasion) =>
  OCCASION_OPTIONS.find((x) => x.value === o)?.slug ?? "";

export function configToParams(c: CustomConfig): string {
  const p = new URLSearchParams();
  if (c.piece) p.set("piece", pieceSlug(c.piece));
  if (c.occasion) p.set("occasion", occSlug(c.occasion));
  if (c.metal) {
    p.set(
      "metal",
      c.metal === "Platinum"
        ? "platinum"
        : `${caratSlug(c.carat ?? "18K")}-${COLOR_SLUG[c.metal]}`
    );
  }
  if (c.stone) p.set("stone", stoneSlug(c.stone));
  if (c.cut) p.set("cut", cutSlug(c.cut));
  if (c.size) p.set("size", c.size);
  return p.toString();
}

export function paramsToConfig(sp: URLSearchParams): CustomConfig {
  const piece = PIECE_OPTIONS.find((o) => o.slug === sp.get("piece"))?.value ?? null;
  const occasion =
    OCCASION_OPTIONS.find((o) => o.slug === sp.get("occasion"))?.value ?? null;

  let metal: Metal | null = null;
  let carat: Carat | null = null;
  const m = sp.get("metal");
  if (m === "platinum") {
    metal = "Platinum";
    carat = "Platinum";
  } else if (m) {
    const [ck, color] = m.split("-");
    metal = METALS.find((x) => COLOR_SLUG[x.value] === color)?.value ?? null;
    carat = (GOLD_CARATS.find((g) => caratSlug(g) === ck) as Carat) ?? null;
  }

  const stone = STONES.find((s) => stoneSlug(s) === sp.get("stone")) ?? null;
  const cut = CUTS.find((c) => cutSlug(c) === sp.get("cut")) ?? null;
  const size = sp.get("size");

  return { piece, occasion, metal, carat, stone, cut, size };
}

/** First incomplete step (1–7) — where to resume the builder. */
export function furthestStep(c: CustomConfig): number {
  const done = [
    !!c.piece,
    !!c.occasion,
    !!(c.metal && (c.metal === "Platinum" || c.carat)),
    !!c.stone,
    !!c.cut,
    !!c.size,
  ];
  let n = 1;
  for (const d of done) {
    if (d) n++;
    else break;
  }
  return Math.min(n, 7);
}

/** Step completion flags for steps 1–6. */
export function stepDone(c: CustomConfig): boolean[] {
  return [
    !!c.piece,
    !!c.occasion,
    !!(c.metal && (c.metal === "Platinum" || c.carat)),
    !!c.stone,
    !!c.cut,
    !!c.size,
  ];
}
