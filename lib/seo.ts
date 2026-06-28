/**
 * Lumière — structured-data (JSON-LD) builders.
 * Pure functions returning schema.org objects for <JsonLd /> blocks.
 */
import { SITE_ORIGIN, INSTAGRAM_URL } from "@/lib/site";
import { formatPrice, type Product } from "@/lib/products";

/** Organization — sitewide, injected once in the root layout. */
export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Lumière",
    legalName: "Lumière Maison",
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/icon.png`,
    description:
      "Maison of cultivated diamonds — lab-grown brilliance, born of science, shaped by hand, kind to the earth.",
    sameAs: [INSTAGRAM_URL],
  };
}

/** Product — for a single PDP. */
export function productJsonLd(product: Product): Record<string, unknown> {
  const url = `${SITE_ORIGIN}/shop/${product.category}/${product.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.descriptor,
    sku: product.id,
    category: product.category,
    material: `${product.carat} ${product.metal}`,
    brand: { "@type": "Brand", name: "Lumière" },
    url,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
      url,
      seller: { "@type": "Organization", name: "Lumière" },
    },
  };
}

/** BreadcrumbList — pass ordered [name, path] pairs (paths relative to origin). */
export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_ORIGIN}${item.path}`,
    })),
  };
}

/** Small convenience re-export so callers can format prices alongside JSON-LD. */
export { formatPrice };
