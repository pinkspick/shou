/**
 * Lumière — configurator pricing.
 *
 * The catalogue stores a single base price per piece (its "as shown"
 * configuration). When a client changes the metal / carat / stone / cut,
 * we re-derive the price from a set of multipliers + addends. This is
 * placeholder economics — plausible, not a real bill of materials.
 */
import type { Carat, Cut, Metal, Stone } from "./products";

/** Gold purity multiplier (more gold → more value). Platinum priced via metal. */
const CARAT_MULTIPLIER: Record<Carat, number> = {
  "10K": 0.9,
  "14K": 1.0,
  "18K": 1.12,
  "22K": 1.25,
  Platinum: 1.18,
};

/** Stone rarity multiplier. */
const STONE_MULTIPLIER: Record<Stone, number> = {
  "White Diamond": 1.0,
  "Yellow Diamond": 1.08,
  "Pink Diamond": 1.35,
  Emerald: 1.15,
  Sapphire: 1.1,
  Ruby: 1.2,
};

/** Cut complexity multiplier. */
const CUT_MULTIPLIER: Record<Cut, number> = {
  Round: 1.0,
  Princess: 1.02,
  Cushion: 1.04,
  Oval: 1.05,
  Pear: 1.07,
  "Emerald Cut": 1.1,
};

/** Metal multiplier (platinum carries a premium over gold). */
const METAL_MULTIPLIER: Record<Metal, number> = {
  "Yellow Gold": 1.0,
  "White Gold": 1.0,
  "Rose Gold": 1.0,
  Platinum: 1.15,
};

export type Configuration = {
  metal: Metal;
  carat: Carat;
  stone: Stone;
  cut: Cut;
};

/**
 * Re-derive a price from the base ("as shown") price. The base already
 * reflects the product's own configuration, so we divide it out and
 * re-apply the chosen options — keeping the as-shown config at base price.
 */
export function configuredPrice(
  base: number,
  shown: Configuration,
  chosen: Configuration
): number {
  const shownFactor =
    CARAT_MULTIPLIER[shown.carat] *
    STONE_MULTIPLIER[shown.stone] *
    CUT_MULTIPLIER[shown.cut] *
    METAL_MULTIPLIER[shown.metal];

  const chosenFactor =
    CARAT_MULTIPLIER[chosen.carat] *
    STONE_MULTIPLIER[chosen.stone] *
    CUT_MULTIPLIER[chosen.cut] *
    METAL_MULTIPLIER[chosen.metal];

  const raw = (base / shownFactor) * chosenFactor;
  return Math.round(raw / 10) * 10;
}

/** Summer Luminance Event — applied to the most-coveted pieces. */
export const EVENT_DISCOUNT = 0.15;

/** A piece is part of the live pricing event when it's a strong seller. */
export function isOnEvent(popularity: number): boolean {
  return popularity >= 90;
}

/** Apply the event discount, rounded to the nearest $10. */
export function eventPrice(price: number): number {
  return Math.round((price * (1 - EVENT_DISCOUNT)) / 10) * 10;
}
