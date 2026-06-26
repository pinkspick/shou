import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

/**
 * SECTION 4 — ON-MODEL EDITORIAL STRIP
 * Horizontal scroll of lifestyle frames (3:4). Champagne placeholders
 * stand in for photography until assets are wired.
 */
type Look = { name: string; price: string };

const LOOKS: Look[] = [
  { name: "Solstice Solitaire Ring", price: "$2,400" },
  { name: "Aurora Tennis Bracelet", price: "$3,900" },
  { name: "Lumen Drop Earrings", price: "$1,650" },
  { name: "Méridienne Necklace", price: "$4,200" },
  { name: "Halo Pavé Band", price: "$1,980" },
];

export function EditorialStrip() {
  return (
    <section className="bg-ivory py-24">
      <div className="mx-auto mb-12 flex max-w-content items-end justify-between px-6 md:px-8">
        <div>
          <span className="overline text-gold">On Model</span>
          <h2 className="mt-4 font-display text-h2 text-obsidian">
            Worn. Not worn out.
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden font-mono text-caption uppercase tracking-[0.16em] text-obsidian link-underline md:inline-block"
        >
          View all
        </Link>
      </div>

      {/* Horizontal scroller — snaps, hides scrollbar visually via thin track */}
      <Reveal>
        <div className="flex gap-6 overflow-x-auto px-6 pb-4 [scrollbar-width:thin] snap-x snap-mandatory md:px-8">
          {LOOKS.map((look) => (
            <Link
              key={look.name}
              href="/shop"
              className="group block shrink-0 snap-start"
            >
              <div className="relative aspect-[3/4] w-64 overflow-hidden rounded-none bg-champagne md:w-72">
                {/* placeholder shimmer mark */}
                <span className="absolute inset-0 flex items-center justify-center font-mono text-caption uppercase tracking-[0.2em] text-carbon/40">
                  Lumière
                </span>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-obsidian/0 transition-colors duration-400 ease-luxe group-hover:bg-obsidian/5"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="font-display text-body-lg text-obsidian">
                  {look.name}
                </span>
                <span className="numeric font-mono text-body text-gold">
                  {look.price}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
