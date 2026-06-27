import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Placeholder } from "@/components/editorial/Placeholder";
import { StoneGuide } from "@/components/materials/StoneGuide";

export const metadata: Metadata = {
  title: "Materials — The Science of Brilliance",
  description:
    "Gold carats explained, lab-grown versus mined, a guide to coloured stones, and what IGI and GIA certification really mean. The science behind every Lumière piece.",
};

/* Gold purity tiers. `purity` drives the CSS fill bar (out of 100). */
const GOLD: {
  k: string;
  purity: number;
  swatch: string;
  durability: string;
  price: string;
  bestFor: string;
}[] = [
  {
    k: "10K",
    purity: 41.7,
    swatch: "#e6cfa3",
    durability: "Hardest",
    price: "$",
    bestFor: "Everyday pieces that take knocks",
  },
  {
    k: "14K",
    purity: 58.3,
    swatch: "#e8c98a",
    durability: "Very durable",
    price: "$$",
    bestFor: "Engagement rings & daily wear",
  },
  {
    k: "18K",
    purity: 75,
    swatch: "#eac06a",
    durability: "Balanced",
    price: "$$$",
    bestFor: "Fine jewellery with rich colour",
  },
  {
    k: "22K",
    purity: 91.7,
    swatch: "#f0b94a",
    durability: "Softest",
    price: "$$$$",
    bestFor: "Heirloom & ceremonial pieces",
  },
];

/* Lab-grown vs mined — identical where it counts, kinder where it matters. */
const COMPARISON: { trait: string; lab: string; mined: string }[] = [
  { trait: "Chemical composition", lab: "Pure crystallised carbon", mined: "Pure crystallised carbon" },
  { trait: "Hardness (Mohs)", lab: "10", mined: "10" },
  { trait: "Optical brilliance", lab: "Identical", mined: "Identical" },
  { trait: "Origin", lab: "Grown in weeks, fully traceable", mined: "Formed over aeons, opaque supply chain" },
  { trait: "Ethical sourcing", lab: "Conflict-free by design", mined: "Difficult to guarantee" },
  { trait: "Carbon footprint", lab: "Up to 10× lower", mined: "Significant extraction impact" },
  { trait: "Price for same quality", lab: "30–40% less", mined: "Premium" },
];

export default function MaterialsPage() {
  return (
    <div className="bg-ivory">
      {/* ---------------------------------------------------------------
          HERO — macro facets
          --------------------------------------------------------------- */}
      <section className="relative">
        <Placeholder
          label="Macro — diamond facets"
          ratio="aspect-[16/9] md:aspect-[21/9]"
          tone="glacial"
          className="min-h-[55vh]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-obsidian/15 px-6 text-center">
          <Reveal>
            <span className="overline text-obsidian/60">Materials</span>
            <h1 className="mt-4 max-w-3xl font-display text-h1 text-obsidian md:text-[3.75rem] md:leading-[1.05]">
              The Science of Brilliance
            </h1>
            <p className="mx-auto mt-5 max-w-xl font-sans text-body-lg text-carbon">
              What a stone is made of, how it is graded, and why grown diamonds
              shine exactly like the earth&rsquo;s — only cleaner.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          GOLD CARATS EXPLAINED
          --------------------------------------------------------------- */}
      <section className="mx-auto max-w-content px-6 py-24 md:px-8">
        <div className="mb-16 text-center">
          <span className="overline text-gold">Metal</span>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-h2 text-obsidian">
            Gold Carats Explained
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-body text-carbon">
            Carat measures purity — the share of pure gold in the alloy. More
            gold means richer colour; less gold means greater hardness.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GOLD.map((g, i) => (
            <Reveal key={g.k} delay={i * 0.05}>
              <div className="flex h-full flex-col rounded-card border border-[color:var(--border-soft)] bg-white/50 p-6">
                <div className="flex items-center justify-between">
                  <span className="font-display text-h3 text-obsidian">{g.k}</span>
                  <span
                    aria-hidden
                    className="h-9 w-9 rounded-full border border-[color:var(--border-soft)] shadow-inner"
                    style={{ backgroundColor: g.swatch }}
                  />
                </div>

                {/* CSS purity bar */}
                <div className="mt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-carbon/60">
                      Purity
                    </span>
                    <span className="numeric font-mono text-caption text-gold">
                      {g.purity}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-champagne">
                    <div
                      className="h-full rounded-full bg-gold"
                      style={{ width: `${g.purity}%` }}
                    />
                  </div>
                </div>

                <dl className="mt-5 space-y-3 border-t border-[color:var(--border-soft)] pt-5">
                  <div className="flex items-center justify-between">
                    <dt className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-carbon/60">
                      Durability
                    </dt>
                    <dd className="font-sans text-caption text-obsidian">
                      {g.durability}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-carbon/60">
                      Price
                    </dt>
                    <dd className="font-mono text-caption tracking-[0.1em]">
                      <span className="text-gold">{g.price}</span>
                      <span className="text-carbon/30">
                        {"$$$$".slice(g.price.length)}
                      </span>
                    </dd>
                  </div>
                </dl>

                <p className="mt-5 font-sans text-caption text-carbon">
                  <span className="font-mono uppercase tracking-[0.16em] text-carbon/50">
                    Best for —{" "}
                  </span>
                  {g.bestFor}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------
          LAB-GROWN VS MINED — comparison table
          --------------------------------------------------------------- */}
      <section className="bg-glacial/40 py-24">
        <div className="mx-auto max-w-content px-6 md:px-8">
          <div className="mb-16 text-center">
            <span className="overline text-gold">Identical, Not Imitation</span>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-h2 text-obsidian">
              Lab-Grown vs Mined
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-sans text-body text-carbon">
              Chemically identical, optically indistinguishable — without the
              ethical compromise or the carbon cost.
            </p>
          </div>

          <Reveal>
            <div className="overflow-hidden rounded-card border border-[color:var(--border-soft)] bg-white/60">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[color:var(--divider)]">
                    <th className="px-5 py-4 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-carbon/60">
                      Property
                    </th>
                    <th className="px-5 py-4 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-gold">
                      Lumière Lab-Grown
                    </th>
                    <th className="px-5 py-4 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-carbon/60">
                      Mined
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr
                      key={row.trait}
                      className={
                        i % 2 === 1
                          ? "bg-white/40"
                          : "bg-transparent"
                      }
                    >
                      <td className="px-5 py-4 font-sans text-body text-obsidian">
                        {row.trait}
                      </td>
                      <td className="px-5 py-4 font-sans text-body text-carbon">
                        {row.lab}
                      </td>
                      <td className="px-5 py-4 font-sans text-body text-carbon/70">
                        {row.mined}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          STONE GUIDE — interactive grid
          --------------------------------------------------------------- */}
      <section className="mx-auto max-w-content px-6 py-24 md:px-8">
        <div className="mb-16 text-center">
          <span className="overline text-gold">Spectrum</span>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-h2 text-obsidian">
            Stone Guide
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-body text-carbon">
            Tap any stone to reveal its origin, hardness, symbolism and the cut
            that flatters it most.
          </p>
        </div>
        <Reveal>
          <StoneGuide />
        </Reveal>
      </section>

      {/* ---------------------------------------------------------------
          CERTIFICATION
          --------------------------------------------------------------- */}
      <section className="bg-obsidian py-24 text-ivory">
        <div className="mx-auto max-w-content px-6 md:px-8">
          <div className="mb-16 text-center">
            <span className="overline text-gold">Proof in Hand</span>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-h2 text-ivory">
              Certification
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-sans text-body text-ivory/70">
              Independent laboratories grade every stone so you never take our
              word for it — you take theirs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Reveal>
              <div className="rounded-card border border-ivory/15 p-7">
                <span className="font-mono text-caption uppercase tracking-[0.2em] text-gold">
                  IGI
                </span>
                <h3 className="mt-3 font-display text-h3 text-ivory">
                  International Gemological Institute
                </h3>
                <p className="mt-3 font-sans text-body text-ivory/70">
                  The world&rsquo;s largest independent lab for lab-grown
                  diamonds. Each Lumière stone is laser-inscribed with its IGI
                  report number for life.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="rounded-card border border-ivory/15 p-7">
                <span className="font-mono text-caption uppercase tracking-[0.2em] text-gold">
                  GIA
                </span>
                <h3 className="mt-3 font-display text-h3 text-ivory">
                  Gemological Institute of America
                </h3>
                <p className="mt-3 font-sans text-body text-ivory/70">
                  Creator of the 4Cs and the global benchmark for grading
                  consistency. Available on request for select centre stones.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-card border border-ivory/15 p-7">
                <span className="font-mono text-caption uppercase tracking-[0.2em] text-gold">
                  4Cs
                </span>
                <h3 className="mt-3 font-display text-h3 text-ivory">
                  What the grades mean
                </h3>
                <p className="mt-3 font-sans text-body text-ivory/70">
                  Cut, Colour, Clarity and Carat — the four measures that define
                  a diamond&rsquo;s beauty and value, printed plainly on your
                  certificate.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-14 text-center">
            <p className="font-display text-h3 text-ivory">
              Every Lumière stone ships with a certificate.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-block rounded-button bg-gold px-8 py-4 font-mono text-caption uppercase tracking-[0.2em] text-obsidian transition-colors hover:bg-ivory"
            >
              Explore Certified Pieces
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
