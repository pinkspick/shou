/**
 * Lumière — static product catalogue + filter taxonomy.
 * Placeholder data for the shop experience (no backend yet). All stones
 * are lab-grown by definition of the maison.
 */

/* ---------------------------------------------------------------
   Taxonomy — single source of truth for filters + routing
   --------------------------------------------------------------- */
export const CATEGORIES = [
  { value: "rings", label: "Rings" },
  { value: "necklaces", label: "Necklaces" },
  { value: "bracelets", label: "Bracelets" },
  { value: "earrings", label: "Earrings" },
] as const;

export const CARATS = ["10K", "14K", "18K", "22K", "Platinum"] as const;

/** Gold purities offered in the configurator (Platinum is a metal, not a carat). */
export const GOLD_CARATS = ["10K", "14K", "18K", "22K"] as const;

export const STONES = [
  "White Diamond",
  "Yellow Diamond",
  "Pink Diamond",
  "Emerald",
  "Sapphire",
  "Ruby",
] as const;

export const CUTS = [
  "Round",
  "Princess",
  "Cushion",
  "Oval",
  "Pear",
  "Emerald Cut",
] as const;

export const METALS = [
  { value: "Yellow Gold", hex: "#d4af37" },
  { value: "White Gold", hex: "#e6e6e1" },
  { value: "Rose Gold", hex: "#c8aa96" },
  { value: "Platinum", hex: "#cfd2d4" },
] as const;

export const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Self-Purchase",
] as const;

export const PRICE_MIN = 500;
export const PRICE_MAX = 25000;

export const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "best", label: "Best Seller" },
] as const;

/* ---------------------------------------------------------------
   Derived types
   --------------------------------------------------------------- */
export type Category = (typeof CATEGORIES)[number]["value"];
export type Carat = (typeof CARATS)[number];
export type Stone = (typeof STONES)[number];
export type Cut = (typeof CUTS)[number];
export type Metal = (typeof METALS)[number]["value"];
export type Occasion = (typeof OCCASIONS)[number];
export type SortValue = (typeof SORTS)[number]["value"];

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  descriptor: string;
  price: number;
  carat: Carat;
  stone: Stone;
  cut: Cut;
  metal: Metal;
  occasions: Occasion[];
  /** higher = stronger seller (Best Seller sort) */
  popularity: number;
  /** higher = more recently added (Newest sort) */
  added: number;
  featured?: boolean;
  bestSeller?: boolean;
  labGrown: true;
  /** Optional product photograph (served from /public). When absent, the
   *  shop renders a Van Cleef-inspired crystal-figurine motif instead. */
  image?: string;
  /** Optional override for the crystal-figurine motif (else derived from id). */
  motif?: GemMotif;
};

/** The four Van Cleef-inspired crystal figurines GemArt can render. */
export type GemMotif = "clover" | "bloom" | "butterfly" | "lotus";

export const CATEGORY_LABELS: Record<Category, string> = {
  rings: "Rings",
  necklaces: "Necklaces",
  bracelets: "Bracelets",
  earrings: "Earrings",
};

export function isCategory(value: string): value is Category {
  return CATEGORIES.some((c) => c.value === value);
}

/** Overline shown above the page title (editorial framing). */
export const SHOP_OVERLINE = "Jewellery & High Jewellery";

/** Foreword — an editorial paragraph that precedes the product grid. */
export const ALL_FOREWORD =
  "A house of cultivated light. Every Lumière piece begins as carbon and ends as a diamond grown, not mined — identical in fire and brilliance to the earth's own, certified to the same IGI standard, and gentler on the world that wears it.";

export const CATEGORY_FOREWORD: Record<Category, string> = {
  rings:
    "From a single line of brilliance to a halo set ablaze, our rings dress the hand in cultivated light. Each stone is grown in our atelier and set by hand — a vow rendered in carbon and fire.",
  necklaces:
    "Worn close, where the light gathers. Pendants and rivières that trace the collarbone in cultivated diamonds — quiet by day, luminous by candlelight.",
  bracelets:
    "A line of brilliance along the wrist. Tennis bracelets and bangles articulated link by link, each stone matched for colour and cut, finished to move with you.",
  earrings:
    "Two small constellations, framed by you. Studs, drops and huggies in cultivated diamonds — the closest light to the face, and the easiest to love.",
};

export const formatPrice = (n: number) => "$" + n.toLocaleString("en-US");

/** Find a single piece by its category + slug (PDP lookup). */
export function getProduct(
  category: string,
  slug: string
): Product | undefined {
  return PRODUCTS.find((p) => p.category === category && p.slug === slug);
}

/** A short, poetic one-liner for the product hero, keyed by category. */
export function productTagline(p: Product): string {
  const lines: Record<Category, string> = {
    rings: "A vow rendered in cultivated light.",
    necklaces: "Worn close, where the light gathers.",
    bracelets: "A line of brilliance along the wrist.",
    earrings: "Two small constellations, framed by you.",
  };
  return lines[p.category];
}

/**
 * Deterministic IGI-style certificate id derived from the product id, so the
 * mockup is stable across renders without storing it on every record.
 */
export function certificateId(p: Product): string {
  let h = 0;
  for (let i = 0; i < p.id.length; i++) h = (h * 31 + p.id.charCodeAt(i)) >>> 0;
  const n = (h % 9000000000) + 1000000000; // 10 digits
  return `IGI-${String(n).slice(0, 4)}-${String(n).slice(4)}`;
}

/* ---------------------------------------------------------------
   Catalogue — 20 placeholder pieces
   --------------------------------------------------------------- */
export const PRODUCTS: Product[] = [
  // ---- Rings ----
  {
    id: "r1",
    slug: "aurelia-solitaire-ring",
    name: "Aurelia Solitaire Ring",
    category: "rings",
    descriptor: "1.00ct Round Brilliant, White Diamond",
    price: 4200,
    carat: "18K",
    stone: "White Diamond",
    cut: "Round",
    metal: "White Gold",
    occasions: ["Wedding", "Anniversary"],
    popularity: 95,
    added: 12,
    featured: true,
    labGrown: true,
  },
  {
    id: "r2",
    slug: "solstice-pave-band",
    name: "Solstice Pavé Band",
    category: "rings",
    descriptor: "0.50ct Round Brilliant, White Diamond",
    price: 1980,
    carat: "14K",
    stone: "White Diamond",
    cut: "Round",
    metal: "Yellow Gold",
    occasions: ["Wedding", "Self-Purchase"],
    popularity: 90,
    added: 8,
    bestSeller: true,
    labGrown: true,
  },
  {
    id: "r3",
    slug: "etoile-cushion-halo-ring",
    name: "Étoile Cushion Halo Ring",
    category: "rings",
    descriptor: "1.25ct Cushion Cut, White Diamond",
    price: 5600,
    carat: "18K",
    stone: "White Diamond",
    cut: "Cushion",
    metal: "Rose Gold",
    occasions: ["Anniversary", "Wedding"],
    popularity: 80,
    added: 10,
    labGrown: true,
  },
  {
    id: "r4",
    slug: "marigold-yellow-diamond-ring",
    name: "Marigold Yellow Diamond Ring",
    category: "rings",
    descriptor: "0.80ct Oval, Yellow Diamond",
    price: 3400,
    carat: "18K",
    stone: "Yellow Diamond",
    cut: "Oval",
    metal: "Yellow Gold",
    occasions: ["Birthday", "Self-Purchase"],
    popularity: 60,
    added: 6,
    featured: true,
    labGrown: true,
  },
  {
    id: "r5",
    slug: "rose-pear-promise-ring",
    name: "Rosé Pear Promise Ring",
    category: "rings",
    descriptor: "0.60ct Pear, Pink Diamond",
    price: 2900,
    carat: "10K",
    stone: "Pink Diamond",
    cut: "Pear",
    metal: "Rose Gold",
    occasions: ["Anniversary", "Birthday"],
    popularity: 55,
    added: 14,
    labGrown: true,
  },
  {
    id: "r6",
    slug: "sovereign-emerald-ring",
    name: "Sovereign Emerald Ring",
    category: "rings",
    descriptor: "1.50ct Emerald Cut, Emerald",
    price: 7200,
    carat: "Platinum",
    stone: "Emerald",
    cut: "Emerald Cut",
    metal: "Platinum",
    occasions: ["Wedding", "Anniversary"],
    popularity: 70,
    added: 4,
    labGrown: true,
  },

  // ---- Necklaces ----
  {
    id: "n1",
    slug: "lumen-solitaire-pendant",
    name: "Lumen Solitaire Pendant",
    category: "necklaces",
    descriptor: "0.75ct Round Brilliant, White Diamond",
    price: 2400,
    carat: "18K",
    stone: "White Diamond",
    cut: "Round",
    metal: "White Gold",
    occasions: ["Birthday", "Self-Purchase"],
    popularity: 92,
    added: 11,
    featured: true,
    bestSeller: true,
    labGrown: true,
    image: "/products/necklace-constella-pearl.avif",
  },
  {
    id: "n2",
    slug: "meridienne-riviere-necklace",
    name: "Méridienne Rivière Necklace",
    category: "necklaces",
    descriptor: "5.00ct Round Brilliant, White Diamond",
    price: 12800,
    carat: "18K",
    stone: "White Diamond",
    cut: "Round",
    metal: "White Gold",
    occasions: ["Wedding", "Anniversary"],
    popularity: 85,
    added: 9,
    labGrown: true,
    image: "/products/necklace-constella-cluster.avif",
  },
  {
    id: "n3",
    slug: "aube-sapphire-drop-necklace",
    name: "Aube Sapphire Drop Necklace",
    category: "necklaces",
    descriptor: "1.20ct Oval, Sapphire",
    price: 3900,
    carat: "14K",
    stone: "Sapphire",
    cut: "Oval",
    metal: "Yellow Gold",
    occasions: ["Anniversary", "Birthday"],
    popularity: 50,
    added: 7,
    labGrown: true,
    image: "/products/necklace-constella-pearl.avif",
  },
  {
    id: "n4",
    slug: "brillance-princess-station-necklace",
    name: "Brillance Princess Station Necklace",
    category: "necklaces",
    descriptor: "2.00ct Princess, White Diamond",
    price: 6400,
    carat: "18K",
    stone: "White Diamond",
    cut: "Princess",
    metal: "White Gold",
    occasions: ["Self-Purchase", "Wedding"],
    popularity: 65,
    added: 5,
    labGrown: true,
    image: "/products/necklace-constella-cluster.avif",
  },
  {
    id: "n5",
    slug: "rubis-coeur-pendant",
    name: "Rubis Cœur Pendant",
    category: "necklaces",
    descriptor: "0.90ct Cushion, Ruby",
    price: 3100,
    carat: "18K",
    stone: "Ruby",
    cut: "Cushion",
    metal: "Rose Gold",
    occasions: ["Birthday", "Anniversary"],
    popularity: 48,
    added: 13,
    labGrown: true,
    image: "/products/necklace-constella-pearl.avif",
  },

  // ---- Bracelets ----
  {
    id: "b1",
    slug: "aurora-tennis-bracelet",
    name: "Aurora Tennis Bracelet",
    category: "bracelets",
    descriptor: "3.00ct Round Brilliant, White Diamond",
    price: 8900,
    carat: "18K",
    stone: "White Diamond",
    cut: "Round",
    metal: "White Gold",
    occasions: ["Anniversary", "Self-Purchase"],
    popularity: 96,
    added: 12,
    featured: true,
    bestSeller: true,
    labGrown: true,
  },
  {
    id: "b2",
    slug: "eclat-princess-tennis-bracelet",
    name: "Éclat Princess Tennis Bracelet",
    category: "bracelets",
    descriptor: "4.00ct Princess, White Diamond",
    price: 11200,
    carat: "18K",
    stone: "White Diamond",
    cut: "Princess",
    metal: "White Gold",
    occasions: ["Wedding", "Anniversary"],
    popularity: 78,
    added: 8,
    labGrown: true,
  },
  {
    id: "b3",
    slug: "petale-rose-diamond-bangle",
    name: "Pétale Rose Diamond Bangle",
    category: "bracelets",
    descriptor: "0.50ct Pear, Pink Diamond",
    price: 4300,
    carat: "14K",
    stone: "Pink Diamond",
    cut: "Pear",
    metal: "Rose Gold",
    occasions: ["Birthday", "Self-Purchase"],
    popularity: 52,
    added: 6,
    labGrown: true,
  },
  {
    id: "b4",
    slug: "saphir-ligne-bracelet",
    name: "Saphir Ligne Bracelet",
    category: "bracelets",
    descriptor: "2.40ct Oval, Sapphire",
    price: 5200,
    carat: "14K",
    stone: "Sapphire",
    cut: "Oval",
    metal: "Yellow Gold",
    occasions: ["Anniversary", "Birthday"],
    popularity: 45,
    added: 10,
    labGrown: true,
  },
  {
    id: "b5",
    slug: "citrine-soleil-bangle",
    name: "Citrine Soleil Bangle",
    category: "bracelets",
    descriptor: "1.10ct Cushion, Yellow Diamond",
    price: 3600,
    carat: "22K",
    stone: "Yellow Diamond",
    cut: "Cushion",
    metal: "Yellow Gold",
    occasions: ["Self-Purchase", "Birthday"],
    popularity: 40,
    added: 3,
    labGrown: true,
  },

  // ---- Earrings ----
  {
    id: "e1",
    slug: "lumen-stud-earrings",
    name: "Lumen Stud Earrings",
    category: "earrings",
    descriptor: "1.00ct Round Brilliant, White Diamond",
    price: 1650,
    carat: "18K",
    stone: "White Diamond",
    cut: "Round",
    metal: "White Gold",
    occasions: ["Birthday", "Self-Purchase"],
    popularity: 94,
    added: 11,
    featured: true,
    bestSeller: true,
    labGrown: true,
  },
  {
    id: "e2",
    slug: "cascade-pear-drop-earrings",
    name: "Cascade Pear Drop Earrings",
    category: "earrings",
    descriptor: "2.00ct Pear, White Diamond",
    price: 5400,
    carat: "18K",
    stone: "White Diamond",
    cut: "Pear",
    metal: "White Gold",
    occasions: ["Wedding", "Anniversary"],
    popularity: 75,
    added: 9,
    labGrown: true,
  },
  {
    id: "e3",
    slug: "emeraude-halo-earrings",
    name: "Émeraude Halo Earrings",
    category: "earrings",
    descriptor: "1.60ct Emerald Cut, Emerald",
    price: 4800,
    carat: "Platinum",
    stone: "Emerald",
    cut: "Emerald Cut",
    metal: "Platinum",
    occasions: ["Anniversary", "Self-Purchase"],
    popularity: 58,
    added: 7,
    labGrown: true,
  },
  {
    id: "e4",
    slug: "rosee-princess-huggies",
    name: "Rosée Princess Huggies",
    category: "earrings",
    descriptor: "0.40ct Princess, Pink Diamond",
    price: 2100,
    carat: "14K",
    stone: "Pink Diamond",
    cut: "Princess",
    metal: "Rose Gold",
    occasions: ["Birthday", "Self-Purchase"],
    popularity: 44,
    added: 5,
    labGrown: true,
  },

  // ---- The Crystal Atelier — art-forward figurine pieces ----
  {
    id: "c1",
    slug: "constellation-pearl-necklace",
    name: "Constellation Pearl Necklace",
    category: "necklaces",
    descriptor: "Princess Cut & Cultured Pearl, White Diamond",
    price: 3650,
    carat: "18K",
    stone: "White Diamond",
    cut: "Princess",
    metal: "White Gold",
    occasions: ["Self-Purchase", "Birthday"],
    popularity: 90,
    added: 16,
    featured: true,
    bestSeller: true,
    labGrown: true,
    image: "/products/necklace-constella-pearl.avif",
  },
  {
    id: "c2",
    slug: "galaxie-cluster-necklace",
    name: "Galaxie Cluster Necklace",
    category: "necklaces",
    descriptor: "Round, Princess & Pearl Cluster, Pink Diamond",
    price: 4200,
    carat: "18K",
    stone: "Pink Diamond",
    cut: "Round",
    metal: "White Gold",
    occasions: ["Anniversary", "Self-Purchase"],
    popularity: 88,
    added: 15,
    featured: true,
    labGrown: true,
    image: "/products/necklace-constella-cluster.avif",
  },
  {
    id: "c3",
    slug: "trefle-crystal-ring",
    name: "Trèfle Crystal Ring",
    category: "rings",
    descriptor: "Four-Petal Clover, Pink Diamond",
    price: 2950,
    carat: "18K",
    stone: "Pink Diamond",
    cut: "Round",
    metal: "Rose Gold",
    occasions: ["Birthday", "Self-Purchase"],
    popularity: 72,
    added: 14,
    featured: true,
    labGrown: true,
    motif: "clover",
  },
  {
    id: "c4",
    slug: "papillon-crystal-studs",
    name: "Papillon Crystal Studs",
    category: "earrings",
    descriptor: "Marquise Butterfly, White Diamond",
    price: 2480,
    carat: "18K",
    stone: "White Diamond",
    cut: "Pear",
    metal: "White Gold",
    occasions: ["Wedding", "Self-Purchase"],
    popularity: 70,
    added: 13,
    labGrown: true,
    motif: "butterfly",
  },
  {
    id: "c5",
    slug: "fleur-emeraude-bracelet",
    name: "Fleur Émeraude Bracelet",
    category: "bracelets",
    descriptor: "Blooming Petals, Emerald",
    price: 5200,
    carat: "Platinum",
    stone: "Emerald",
    cut: "Emerald Cut",
    metal: "Platinum",
    occasions: ["Anniversary", "Self-Purchase"],
    popularity: 64,
    added: 12,
    labGrown: true,
    motif: "bloom",
  },
  {
    id: "c6",
    slug: "lotus-saphir-pendant",
    name: "Lotus Saphir Pendant",
    category: "necklaces",
    descriptor: "Eight-Petal Lotus, Sapphire",
    price: 3380,
    carat: "18K",
    stone: "Sapphire",
    cut: "Oval",
    metal: "White Gold",
    occasions: ["Birthday", "Anniversary"],
    popularity: 66,
    added: 10,
    labGrown: true,
    motif: "lotus",
  },
];
