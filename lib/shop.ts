/**
 * Shop filtering + sorting + URL-param (de)serialization.
 * Filters live in the query string so every view is shareable, e.g.
 *   /shop?category=rings&carat=18K&stone=White%20Diamond&min=1000&max=8000
 */
import {
  CARATS,
  CUTS,
  isCategory,
  METALS,
  OCCASIONS,
  PRICE_MAX,
  PRICE_MIN,
  STONES,
  type Carat,
  type Category,
  type Cut,
  type Metal,
  type Occasion,
  type Product,
  type SortValue,
} from "./products";

export const PARAM = {
  category: "category",
  carat: "carat",
  stone: "stone",
  cut: "cut",
  metal: "metal",
  occasion: "occasion",
  min: "min",
  max: "max",
  sort: "sort",
  cols: "cols",
  model: "model",
} as const;

export type Filters = {
  categories: Category[];
  carat: Carat | null;
  stones: Stone[];
  cuts: Cut[];
  metals: Metal[];
  occasions: Occasion[];
  min: number;
  max: number;
};

type Stone = (typeof STONES)[number];

const METAL_VALUES = METALS.map((m) => m.value);

function csv(sp: URLSearchParams, key: string): string[] {
  const raw = sp.get(key);
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function clampNum(value: string | null, fallback: number): number {
  const n = value ? Number(value) : NaN;
  if (Number.isNaN(n)) return fallback;
  return Math.min(PRICE_MAX, Math.max(PRICE_MIN, n));
}

/**
 * Parse filters from the URL. When `routeCategory` is provided (the
 * /shop/[category] route), it hard-scopes the category and the query
 * `category` param is ignored.
 */
export function parseFilters(
  sp: URLSearchParams,
  routeCategory?: Category
): Filters {
  const caratRaw = sp.get(PARAM.carat);
  return {
    categories: routeCategory
      ? [routeCategory]
      : (csv(sp, PARAM.category).filter(isCategory) as Category[]),
    carat: caratRaw && (CARATS as readonly string[]).includes(caratRaw)
      ? (caratRaw as Carat)
      : null,
    stones: csv(sp, PARAM.stone).filter((s) =>
      (STONES as readonly string[]).includes(s)
    ) as Stone[],
    cuts: csv(sp, PARAM.cut).filter((s) =>
      (CUTS as readonly string[]).includes(s)
    ) as Cut[],
    metals: csv(sp, PARAM.metal).filter((s) =>
      METAL_VALUES.includes(s as Metal)
    ) as Metal[],
    occasions: csv(sp, PARAM.occasion).filter((s) =>
      (OCCASIONS as readonly string[]).includes(s)
    ) as Occasion[],
    min: clampNum(sp.get(PARAM.min), PRICE_MIN),
    max: clampNum(sp.get(PARAM.max), PRICE_MAX),
  };
}

export function filterProducts(products: Product[], f: Filters): Product[] {
  return products.filter((p) => {
    if (f.categories.length && !f.categories.includes(p.category)) return false;
    if (f.carat && p.carat !== f.carat) return false;
    if (f.stones.length && !f.stones.includes(p.stone)) return false;
    if (f.cuts.length && !f.cuts.includes(p.cut)) return false;
    if (f.metals.length && !f.metals.includes(p.metal)) return false;
    if (
      f.occasions.length &&
      !p.occasions.some((o) => f.occasions.includes(o))
    )
      return false;
    if (p.price < f.min || p.price > f.max) return false;
    return true;
  });
}

export function sortProducts(products: Product[], sort: SortValue): Product[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "newest":
      return list.sort((a, b) => b.added - a.added);
    case "best":
      return list.sort((a, b) => b.popularity - a.popularity);
    case "featured":
    default:
      return list.sort((a, b) => {
        const fa = a.featured ? 1 : 0;
        const fb = b.featured ? 1 : 0;
        if (fa !== fb) return fb - fa;
        return b.popularity - a.popularity;
      });
  }
}

/** Count of active filter facets — for the mobile "Filter (n)" badge. */
export function activeFilterCount(f: Filters, hasRouteCategory: boolean): number {
  let n = 0;
  if (!hasRouteCategory) n += f.categories.length;
  if (f.carat) n += 1;
  n += f.stones.length + f.cuts.length + f.metals.length + f.occasions.length;
  if (f.min > PRICE_MIN || f.max < PRICE_MAX) n += 1;
  return n;
}

export function isSortValue(v: string | null): v is SortValue {
  return (
    v === "featured" ||
    v === "price-asc" ||
    v === "price-desc" ||
    v === "newest" ||
    v === "best"
  );
}
