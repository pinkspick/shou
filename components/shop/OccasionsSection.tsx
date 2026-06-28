import Link from "next/link";
import { OCCASION_PAGES, OCCASION_SLUGS } from "@/lib/occasions";

/**
 * Occasions — a curated entry-point strip at the foot of the collection.
 * Links to the three editorial occasion edits (birthday, anniversary,
 * wedding). Server component; pulls copy + gradient from the occasions
 * data so the catalogue stays the single source of truth.
 */
export function OccasionsSection() {
  return (
    <section
      id="occasions"
      className="scroll-mt-24 border-t border-[color:var(--divider)] bg-ivory py-24"
    >
      <div className="mx-auto max-w-content px-6 md:px-8">
        <div className="mb-14 text-center">
          <span className="overline text-gold">Shop by Occasion</span>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-h2 text-obsidian">
            For the Moments That Mark Us
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-body text-carbon">
            Curated edits for the milestones worth remembering — each a story
            told in cultivated light.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {OCCASION_SLUGS.map((slug) => {
            const o = OCCASION_PAGES[slug];
            return (
              <Link
                key={slug}
                href={`/occasions/${slug}`}
                className="group relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-card border border-[color:var(--border-soft)] p-7 transition-transform duration-500 ease-luxe hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                {/* Ambient field (stands in for the occasion's hero) */}
                <span
                  aria-hidden
                  className="absolute inset-0 transition-transform duration-700 ease-luxe group-hover:scale-105"
                  style={{ backgroundImage: o.heroGradient }}
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-obsidian/45 via-obsidian/0 to-obsidian/0"
                />
                <div className="relative">
                  <span className="font-mono text-caption uppercase tracking-[0.18em] text-obsidian/70">
                    {o.overline}
                  </span>
                  <h3 className="mt-2 font-display text-h2 leading-tight text-obsidian">
                    {o.headline.split("\n").map((line, i) => (
                      <span key={i} className="block">
                        {line}
                      </span>
                    ))}
                  </h3>
                  <span className="mt-4 inline-flex items-center gap-2 font-mono text-caption uppercase tracking-[0.2em] text-obsidian">
                    Explore
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
