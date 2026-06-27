import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

/**
 * SECTION 5 — CATEGORY ENTRY POINTS
 * Four full-bleed cards. All route to /shop for now (filtered routes
 * come with page work). Champagne fields stand in for product photography.
 */
type Category = { name: string; href: string };

const CATEGORIES: Category[] = [
  { name: "Rings", href: "/shop/rings" },
  { name: "Necklaces", href: "/shop/necklaces" },
  { name: "Bracelets", href: "/shop/bracelets" },
  { name: "Earrings", href: "/shop/earrings" },
];

/** Occasion landing pages — a second row of editorial entry points. */
type OccasionEntry = { name: string; href: string; blurb: string };
const OCCASIONS: OccasionEntry[] = [
  { name: "Birthday", href: "/occasions/birthday", blurb: "A year brighter — marked in light." },
  { name: "Anniversary", href: "/occasions/anniversary", blurb: "Another orbit, together." },
  { name: "Wedding", href: "/occasions/wedding", blurb: "The promise made permanent." },
];

export function CategoryGrid() {
  return (
    <section className="bg-ivory pb-24">
      <div className="mx-auto max-w-content px-6 md:px-8">
        <div className="mb-12 text-center">
          <span className="overline text-gold">The Collection</span>
          <h2 className="mt-4 font-display text-h2 text-obsidian">
            Find your light.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.name} delay={i * 0.08}>
              <Link
                href={cat.href}
                className="group relative block aspect-[3/4] overflow-hidden rounded-none bg-champagne"
              >
                {/* placeholder field */}
                <span className="absolute inset-0 flex items-center justify-center font-mono text-caption uppercase tracking-[0.2em] text-carbon/30">
                  {cat.name}
                </span>

                {/* hover veil */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-obsidian/0 transition-colors duration-400 ease-luxe group-hover:bg-obsidian/30"
                />

                {/* label block */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <span className="font-display text-h3 text-obsidian transition-colors duration-400 ease-luxe group-hover:text-ivory">
                    {cat.name}
                  </span>
                  <span className="font-mono text-caption uppercase tracking-[0.16em] text-carbon opacity-0 transition-all duration-400 ease-luxe group-hover:text-ivory group-hover:opacity-100">
                    Shop Now →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Shop by occasion */}
        <div className="mt-24">
          <div className="mb-12 text-center">
            <span className="overline text-gold">Shop by Occasion</span>
            <h2 className="mt-4 font-display text-h2 text-obsidian">
              For every reason to shine.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {OCCASIONS.map((occ, i) => (
              <Reveal key={occ.name} delay={i * 0.08}>
                <Link
                  href={occ.href}
                  className="group relative block aspect-[5/3] overflow-hidden rounded-none bg-glacial"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-obsidian/0 transition-colors duration-400 ease-luxe group-hover:bg-obsidian/25"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <span className="font-display text-h3 text-obsidian transition-colors duration-400 ease-luxe group-hover:text-ivory">
                      {occ.name}
                    </span>
                    <span className="mt-1 max-w-[18rem] font-sans text-caption text-carbon transition-colors duration-400 ease-luxe group-hover:text-ivory/80">
                      {occ.blurb}
                    </span>
                    <span className="mt-3 font-mono text-caption uppercase tracking-[0.16em] text-carbon opacity-0 transition-all duration-400 ease-luxe group-hover:text-ivory group-hover:opacity-100">
                      Explore the Edit →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Bespoke prompt */}
          <div className="mt-12 text-center">
            <Reveal>
              <p className="font-display text-body-lg text-carbon">
                Or begin with a blank canvas.
              </p>
              <Link
                href="/customize"
                className="mt-4 inline-block rounded-button bg-obsidian px-10 py-4 font-mono text-caption uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold"
              >
                Design Your Own
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
