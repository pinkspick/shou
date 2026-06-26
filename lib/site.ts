/**
 * Lumière — site-wide configuration + small helpers.
 */

/** Placeholder concierge line. Replace with the real number before launch. */
export const WHATSAPP_NUMBER = "15551234567";

/** Build a wa.me deep link with a prefilled message. */
export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
