import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { getInstagramPosts, type IGPost } from "@/lib/instagram";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/site";

/**
 * SECTION — AS SEEN ON INSTAGRAM
 * 3×2 shoppable grid on desktop; a horizontal snap strip (~2.5 tiles visible)
 * on mobile. Each tile reveals a "Shop This Look" overlay on hover/focus and
 * links to the relevant catalogue entry. Async server component — pulls from
 * the Instagram Basic Display API when a token is set, else curated fallbacks.
 */
export async function InstagramFeed() {
  const posts = await getInstagramPosts();

  return (
    <section className="bg-ivory py-24">
      <div className="mx-auto max-w-content px-6 md:px-8">
        <div className="mb-12 text-center">
          <span className="overline text-gold">@{INSTAGRAM_HANDLE}</span>
          <h2 className="mt-4 font-display text-h2 text-obsidian">
            As Seen on Instagram
          </h2>
          <p className="mx-auto mt-4 max-w-md font-sans text-body text-carbon">
            Real pieces, real light, worn by the Lumière community. Tap a frame
            to shop the look.
          </p>
        </div>

        {/* Mobile: horizontal snap strip · Desktop: 3×2 grid */}
        <Reveal>
          <div
            className="
              -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6
              pb-4 [scrollbar-width:thin]
              md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0
            "
          >
            {posts.map((post) => (
              <FeedTile key={post.id} post={post} />
            ))}
          </div>
        </Reveal>

        <div className="mt-12 text-center">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-button border border-obsidian px-7 py-4 font-mono text-caption uppercase tracking-[0.2em] text-obsidian transition-colors hover:bg-obsidian hover:text-ivory"
          >
            <IconInstagram />
            Follow @{INSTAGRAM_HANDLE}
          </a>
        </div>
      </div>
    </section>
  );
}

function FeedTile({ post }: { post: IGPost }) {
  return (
    <Link
      href={post.shopHref}
      aria-label={`Shop this look — ${post.caption}`}
      className="group relative block w-[68vw] shrink-0 snap-start overflow-hidden bg-champagne sm:w-[40vw] md:w-auto"
    >
      <div className="relative aspect-square w-full">
        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image}
            alt={post.caption}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-luxe group-hover:scale-105"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-mono text-caption uppercase tracking-[0.3em] text-carbon/40">
            Lumière
          </span>
        )}

        {/* Hover / focus overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-obsidian/70 via-obsidian/0 to-obsidian/0 opacity-0 transition-opacity duration-400 ease-luxe group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="m-4 font-mono text-caption uppercase tracking-[0.18em] text-ivory">
            Shop This Look →
          </span>
        </div>
      </div>
    </Link>
  );
}

function IconInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
