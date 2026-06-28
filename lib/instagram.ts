/**
 * Instagram feed source.
 *
 * If an access token is present (INSTAGRAM_TOKEN), we pull recent media from
 * the Instagram Basic Display API on the server. Otherwise we fall back to a
 * curated set of placeholders so the homepage section always renders — the
 * same shape a real embed (or a SnapWidget drop-in) would produce.
 */

export type IGPost = {
  id: string;
  /** Image URL when real media is available; null → render a placeholder tile. */
  image: string | null;
  /** Link out — the IG permalink, or a "shop this look" destination. */
  permalink: string;
  /** Where "Shop This Look" routes to on our store. */
  shopHref: string;
  caption: string;
};

/** Curated fallback grid — six looks routed to the relevant shop entry points. */
const FALLBACK: IGPost[] = [
  { id: "ig-1", image: null, permalink: "https://instagram.com", shopHref: "/shop/rings", caption: "Aurelia Solitaire, caught in morning light" },
  { id: "ig-2", image: null, permalink: "https://instagram.com", shopHref: "/shop/necklaces", caption: "The Méridienne, layered for evening" },
  { id: "ig-3", image: null, permalink: "https://instagram.com", shopHref: "/shop/earrings", caption: "Lumen drops — small fire, big presence" },
  { id: "ig-4", image: null, permalink: "https://instagram.com", shopHref: "/shop/bracelets", caption: "Aurora tennis bracelet on the wrist" },
  { id: "ig-5", image: null, permalink: "https://instagram.com", shopHref: "/customize", caption: "A bespoke commission, start to finish" },
  { id: "ig-6", image: null, permalink: "https://instagram.com", shopHref: "/shop/rings", caption: "Étoile halo — a reader's engagement" },
];

type IGApiMedia = {
  id: string;
  caption?: string;
  media_url?: string;
  permalink?: string;
  media_type?: string;
};

/**
 * Returns up to six recent posts. Network/credential failures degrade
 * silently to the curated fallback — this never throws.
 */
export async function getInstagramPosts(): Promise<IGPost[]> {
  const token = process.env.INSTAGRAM_TOKEN;
  if (!token) return FALLBACK;

  try {
    const fields = "id,caption,media_url,permalink,media_type";
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=${fields}&limit=6&access_token=${token}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return FALLBACK;
    const data = (await res.json()) as { data?: IGApiMedia[] };
    const items = (data.data ?? [])
      .filter((m) => m.media_type !== "VIDEO" && m.media_url)
      .slice(0, 6);
    if (items.length === 0) return FALLBACK;

    return items.map((m, i) => ({
      id: m.id,
      image: m.media_url ?? null,
      permalink: m.permalink ?? "https://instagram.com",
      // Without product tagging we route the look to the catalogue.
      shopHref: "/shop",
      caption: m.caption?.split("\n")[0]?.slice(0, 80) ?? `Lumière look ${i + 1}`,
    }));
  } catch {
    return FALLBACK;
  }
}
