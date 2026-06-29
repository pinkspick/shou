import Link from "next/link";
import type { GemMotif, Stone } from "@/lib/products";
import { CrystalMotif } from "@/components/product/GemArt";

/**
 * The Crystal Atelier — an art-forward band that puts the house's
 * faceted-figurine motifs front and centre on the homepage. Each tile is a
 * living crystal (float + shimmer) and links into the relevant edit.
 */
const TILES: {
  motif: GemMotif;
  stone: Stone;
  name: string;
  caption: string;
  href: string;
}[] = [
  {
    motif: "clover",
    stone: "Pink Diamond",
    name: "Le Trèfle",
    caption: "Four petals, for fortune",
    href: "/shop/rings/trefle-crystal-ring",
  },
  {
    motif: "butterfly",
    stone: "Sapphire",
    name: "Le Papillon",
    caption: "Wings cut from light",
    href: "/shop/earrings/papillon-crystal-studs",
  },
  {
    motif: "bloom",
    stone: "Emerald",
    name: "La Fleur",
    caption: "A garden in bloom",
    href: "/shop/bracelets/fleur-emeraude-bracelet",
  },
  {
    motif: "lotus",
    stone: "White Diamond",
    name: "Le Lotus",
    caption: "Eight petals of grace",
    href: "/shop/necklaces/lotus-saphir-pendant",
  },
];

export function CrystalGallery() {
  return (
    <section className="border-t border-[color:var(--divider)] bg-ivory py-24">
      <div className="mx-auto max-w-content px-6 md:px-8">
        <div className="mb-14 text-center">
          <span className="overline text-gold">The Crystal Atelier</span>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-h2 text-obsidian">
            Nature, Cut in Cultivated Light
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-body text-carbon">
            Our signature figurines — clover, butterfly, bloom and lotus — each
            faceted from lab-grown stones and rendered entirely in light.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {TILES.map((t) => (
            <Link
              key={t.motif}
              href={t.href}
              className="group flex flex-col overflow-hidden rounded-card border border-[color:var(--border-soft)] transition-transform duration-500 ease-luxe hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-white">
                <CrystalMotif
                  motif={t.motif}
                  stone={t.stone}
                  uid={`gallery-${t.motif}`}
                  ground
                  className="h-full w-full transition-transform duration-700 ease-luxe group-hover:scale-105"
                />
              </div>
              <div className="px-5 py-5 text-center">
                <h3 className="font-display text-body-lg text-obsidian">{t.name}</h3>
                <p className="mt-1 font-sans text-caption text-carbon">{t.caption}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
