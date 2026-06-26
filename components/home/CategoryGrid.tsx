import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

/**
 * SECTION 5 — CATEGORY ENTRY POINTS
 * Four full-bleed cards. All route to /shop for now (filtered routes
 * come with page work). Champagne fields stand in for product photography.
 */
type Category = { name: string; href: string };

const CATEGORIES: Category[] = [
  { name: "Rings", href: "/shop" },
  { name: "Necklaces", href: "/shop" },
  { name: "Bracelets", href: "/shop" },
  { name: "Earrings", href: "/shop" },
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
      </div>
    </section>
  );
}
