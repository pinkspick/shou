import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/site";
import { CATEGORIES, PRODUCTS } from "@/lib/products";

/**
 * Sitemap — generated at build time. Covers editorial pages, shop
 * category listings, and every product detail page.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    "/",
    "/shop",
    "/about",
    "/craftsmanship",
    "/materials",
    "/packaging",
    "/certificate",
    "/lifetime-service",
    "/book-appointment",
    "/customize",
    "/try-on",
    "/occasions",
    "/track",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${SITE_ORIGIN}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE_ORIGIN}/shop/${c.value}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const productEntries: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    url: `${SITE_ORIGIN}/shop/${p.category}/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
