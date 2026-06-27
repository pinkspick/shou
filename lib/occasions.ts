/**
 * Lumière — occasion pages (/occasions/[slug]).
 *
 * Three editorial landing pages — birthday, anniversary, wedding — each with a
 * hero, a short poem, a "for her / for them" curated edit, a budget guide and a
 * consultation prompt. Products are referenced by id so the catalogue stays the
 * single source of truth.
 */
import { PRODUCTS, type Product } from "./products";

export type OccasionSlug = "birthday" | "anniversary" | "wedding";

export type BudgetTier = {
  label: string;
  note: string;
  href: string;
};

export type OccasionPage = {
  slug: OccasionSlug;
  /** Small mono overline above the hero headline. */
  overline: string;
  /** Cormorant hero headline (may break across lines via \n). */
  headline: string;
  /** 2–3 sentence poem beneath the headline. */
  poem: string;
  /** Ambient hero gradient (stands in for the video loop). */
  heroGradient: string;
  /** Curated edit, split by recipient. Ordered, by product id. */
  forHer: string[];
  forThem: string[];
  /** "For her / For them" toggle labels. */
  herLabel: string;
  themLabel: string;
  /** Budget guide tiers. */
  budget: BudgetTier[];
};

export const OCCASION_PAGES: Record<OccasionSlug, OccasionPage> = {
  birthday: {
    slug: "birthday",
    overline: "The Birthday Edit",
    headline: "A year brighter —\nmarked in light.",
    poem: "Another orbit complete, and the light is yours to keep. Celebrate the day she arrived with a piece grown to outlast the candles — fire that does not fade by morning.",
    heroGradient:
      "radial-gradient(120% 120% at 20% 10%, #f6e7c9 0%, #efe6d6 35%, #e6d3c4 70%, #d8b9a8 100%)",
    forHer: ["e1", "n1", "n5", "b3", "r5", "e4"],
    forThem: ["r4", "n3", "b5", "b4"],
    herLabel: "For Her",
    themLabel: "For Them",
    budget: [
      { label: "Under $2,000", note: "Studs, huggies & charms", href: "/shop?max=2000" },
      { label: "$2,000 – $7,500", note: "Pendants & coloured stones", href: "/shop?min=2000&max=7500" },
      { label: "$7,500 +", note: "Statement & high jewellery", href: "/shop?min=7500" },
    ],
  },
  anniversary: {
    slug: "anniversary",
    overline: "The Anniversary Edit",
    headline: "Another orbit,\ntogether.",
    poem: "Time, measured not in years but in light kept close. For the promise renewed and the road still ahead — a brilliance that deepens, as you have, with every turn around the sun.",
    heroGradient:
      "radial-gradient(120% 120% at 80% 10%, #f3e0e6 0%, #efe6d6 35%, #ddd2c8 70%, #c8aa96 100%)",
    forHer: ["r3", "r5", "n3", "n5", "e2", "b4"],
    forThem: ["r1", "r6", "n2", "b1", "b2", "e3"],
    herLabel: "For Her",
    themLabel: "For Them",
    budget: [
      { label: "Under $2,000", note: "Tokens & everyday brilliance", href: "/shop?max=2000" },
      { label: "$2,000 – $7,500", note: "Halos, drops & rivières", href: "/shop?min=2000&max=7500" },
      { label: "$7,500 +", note: "Milestone high jewellery", href: "/shop?min=7500" },
    ],
  },
  wedding: {
    slug: "wedding",
    overline: "The Wedding Edit",
    headline: "The promise\nmade permanent.",
    poem: "One light, two hands. The day asks for something equal to forever — a stone grown with intention, certified, and set to be passed down long after the vows are spoken.",
    heroGradient:
      "radial-gradient(120% 120% at 50% 0%, #ffffff 0%, #f4f1ea 35%, #e7eced 70%, #d8e8e4 100%)",
    forHer: ["r1", "r3", "n4", "e2"],
    forThem: ["r2", "r6", "n2", "b2"],
    herLabel: "For the Bride",
    themLabel: "For the Partner",
    budget: [
      { label: "Under $2,000", note: "Bands & pavé", href: "/shop?max=2000" },
      { label: "$2,000 – $7,500", note: "Solitaires & halos", href: "/shop?min=2000&max=7500" },
      { label: "$7,500 +", note: "Rivières & high jewellery", href: "/shop?min=7500" },
    ],
  },
};

export const OCCASION_SLUGS = Object.keys(OCCASION_PAGES) as OccasionSlug[];

export function isOccasionSlug(value: string): value is OccasionSlug {
  return value in OCCASION_PAGES;
}

export function getOccasionPage(slug: string): OccasionPage | undefined {
  return isOccasionSlug(slug) ? OCCASION_PAGES[slug] : undefined;
}

/** Resolve an ordered id list to products (dropping any unknown ids). */
export function productsByIds(ids: string[]): Product[] {
  return ids
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
}
