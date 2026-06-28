/**
 * Lumière — site-wide configuration + small helpers.
 */

/** Placeholder concierge line. Replace with the real number before launch. */
export const WHATSAPP_NUMBER = "15551234567";

/** Instagram handle (without the @) and profile URL. */
export const INSTAGRAM_HANDLE = "lumiere.maison";
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`;

/** Public site origin — used as a share-URL fallback during SSR. */
export const SITE_ORIGIN = "https://lumiere.example";

/** Atelier address (placeholder until the real boutique is wired). */
export const ATELIER_ADDRESS = {
  line1: "18 Rue de la Lumière",
  line2: "75008 Paris, France",
  /** Used by the embedded map placeholder. */
  query: "18 Rue de la Lumiere, 75008 Paris, France",
};

/** Build a wa.me deep link with a prefilled message. */
export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
