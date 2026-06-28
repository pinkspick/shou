import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { PackagingReveal } from "@/components/packaging/PackagingReveal";

export const metadata: Metadata = {
  title: "Packaging — Part of the Gift",
  description:
    "Recycled matte black, cream satin, seed-embedded tissue you can plant, FSC-certified ribbon and a reusable tray. Lumière packaging is 100% plastic-free and biodegradable.",
  openGraph: {
    title: "Opening a Lumière Box Is Part of the Gift",
    description:
      "Plastic-free, biodegradable, and made to be reopened. The Lumière unboxing, by design.",
    type: "website",
    images: [{ url: "/og/packaging.jpg", width: 1200, height: 630, alt: "The Lumière jewellery box" }],
  },
};

/* The materials list — each a deliberate, low-impact choice. */
const MATERIALS: { title: string; body: string }[] = [
  {
    title: "Recycled matte exterior",
    body: "Black paper-wrapped board, soft to the touch, made from post-consumer waste.",
  },
  {
    title: "Cream satin interior",
    body: "A hand-set cushion that holds your piece without a single plastic clip.",
  },
  {
    title: "Seed-embedded tissue",
    body: "Plant the wrapping tissue and wildflowers grow — the gift that keeps giving back.",
  },
  {
    title: "FSC-certified ribbon",
    body: "Responsibly sourced, beautifully finished, and entirely compostable.",
  },
  {
    title: "Reusable inner tray",
    body: "Built to be kept — for the next piece, or a small treasure of your own.",
  },
];

export default function PackagingPage() {
  return (
    <div className="bg-ivory">
      {/* ---------------------------------------------------------------
          HEADLINE + 3D BOX REVEAL
          --------------------------------------------------------------- */}
      <section className="mx-auto max-w-content px-6 pt-24 text-center md:px-8">
        <Reveal>
          <span className="overline text-gold">The Unboxing</span>
          <h1 className="mx-auto mt-4 max-w-4xl font-display text-[2.75rem] leading-[1.05] text-obsidian md:text-[4rem]">
            Opening a Lumière Box Is Part of the Gift.
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-sans text-body-lg text-carbon">
            The moment before the moment — considered down to the last fibre.
          </p>
        </Reveal>
      </section>

      <section className="flex min-h-[60vh] items-center justify-center px-6 py-16">
        <PackagingReveal />
      </section>

      {/* ---------------------------------------------------------------
          MATERIALS
          --------------------------------------------------------------- */}
      <section className="bg-champagne/30 py-24">
        <div className="mx-auto max-w-content px-6 md:px-8">
          <div className="mb-14 text-center">
            <span className="overline text-gold">Considered, Inside and Out</span>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-h2 text-obsidian">
              Every Layer, on Purpose
            </h2>
          </div>
          <ul className="mx-auto grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-card border border-[color:var(--border-soft)] bg-[color:var(--border-soft)] sm:grid-cols-2">
            {MATERIALS.map((m) => (
              <li key={m.title} className="bg-ivory p-7">
                <h3 className="font-display text-h3 text-obsidian">{m.title}</h3>
                <p className="mt-2 font-sans text-body text-carbon">{m.body}</p>
              </li>
            ))}
            <li className="flex items-center justify-center bg-obsidian p-7 text-center">
              <p className="font-display text-h3 text-gold">
                Plant it. Wildflowers grow.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          SUSTAINABILITY NOTE
          --------------------------------------------------------------- */}
      <section className="mx-auto max-w-2xl px-6 py-24 text-center md:px-8">
        <Reveal>
          <p className="font-display text-h2 leading-snug text-obsidian">
            Our packaging is 100% plastic-free and biodegradable.
          </p>
          <p className="mx-auto mt-5 max-w-md font-sans text-body text-carbon">
            From the board to the bow, every element returns safely to the
            earth — or stays beautiful in your home for years.
          </p>
        </Reveal>
      </section>

      {/* ---------------------------------------------------------------
          ADD-ON CTA — links back to gift packaging in cart
          --------------------------------------------------------------- */}
      <section className="mx-auto max-w-content px-6 pb-24 md:px-8">
        <div className="rounded-card border border-[color:var(--divider)] bg-white/50 px-8 py-12 text-center">
          <h2 className="font-display text-h3 text-obsidian">
            Add gift packaging at checkout
          </h2>
          <p className="mx-auto mt-3 max-w-md font-sans text-body text-carbon">
            Every order can arrive in the signature box, ribbon-tied and ready
            to give. Choose it on the product page or in your cart.
          </p>
          <Link
            href="/shop"
            className="mt-7 inline-flex items-center gap-2 rounded-button bg-obsidian px-7 py-4 font-mono text-caption uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Shop the collection →
          </Link>
        </div>
      </section>
    </div>
  );
}
