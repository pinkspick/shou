import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Placeholder } from "@/components/editorial/Placeholder";

export const metadata: Metadata = {
  title: "About — We Chose a Better Way",
  description:
    "Why Lumière chose cultivated diamonds: the founding story, the CVD science behind 10× less carbon, and our promise of certification and lifetime service.",
  openGraph: {
    title: "About Lumière — We Chose a Better Way",
    description:
      "Cultivated diamonds, born of science and shaped by hand. Our founding story, our technology, and our commitment.",
    type: "website",
    images: [{ url: "/og/about.jpg", width: 1200, height: 630, alt: "Inside the Lumière laboratory" }],
  },
};

/* Founding principles. */
const PRINCIPLES: { title: string; body: string }[] = [
  {
    title: "Transparent by Default",
    body: "Every price, every grade, every origin — published, never obscured. You see exactly what you pay for.",
  },
  {
    title: "Earth First, Always",
    body: "Grown, not dug. A Lumière diamond carries a fraction of the carbon and none of the conflict of a mined stone.",
  },
  {
    title: "Certified, Every Stone",
    body: "No exceptions. Each diamond ships with an independent IGI or GIA report you can verify yourself.",
  },
  {
    title: "Crafted for Generations",
    body: "Made to be repaired, resized and re-loved. We service every piece for life, so it outlives trends.",
  },
];

/* Placeholder founders / leadership. */
const TEAM: { name: string; role: string }[] = [
  { name: "Camille Aurelia", role: "Founder & Creative Director" },
  { name: "Dr. Idris Vance", role: "Head of Diamond Science" },
  { name: "Sofia Marchetti", role: "Director of Atelier" },
];

/* Press strip. */
const PRESS = ["Vogue", "WSJ", "Glamour"];

export default function AboutPage() {
  return (
    <div className="bg-ivory">
      {/* ---------------------------------------------------------------
          HERO — lab interior, editorial
          --------------------------------------------------------------- */}
      <section className="relative">
        <Placeholder
          label="The Laboratory — scientists at work"
          ratio="aspect-[16/9] md:aspect-[21/9]"
          tone="obsidian"
          className="min-h-[60vh]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-obsidian/40 px-6 text-center">
          <Reveal>
            <span className="overline text-ivory/70">Our Story</span>
            <h1 className="mt-4 max-w-3xl font-display text-h1 text-ivory md:text-[3.75rem] md:leading-[1.05]">
              We Chose a Better Way.
            </h1>
            <p className="mx-auto mt-5 max-w-xl font-sans text-body-lg text-ivory/80">
              A diamond should carry light, not weight. We built Lumière to
              prove brilliance and conscience can share the same stone.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          BRAND STATEMENT — three paragraphs
          --------------------------------------------------------------- */}
      <section className="mx-auto max-w-2xl px-6 py-24 md:px-8">
        <Reveal>
          <p className="font-display text-h3 leading-snug text-obsidian">
            It began with a question no one in the trade wanted to answer
            honestly: does a diamond have to cost the earth to mean everything?
          </p>
        </Reveal>
        <div className="mt-8 space-y-6 font-sans text-body-lg text-carbon">
          <Reveal delay={0.05}>
            <p>
              Our founder spent a decade inside the jewellery world before
              walking away from it. The moment of decision came in a mine-audit
              report she was asked to file away — a paper trail that stopped
              short of the truth. She left to build a house where the truth
              would be the product, and chose to grow diamonds instead of
              extract them.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              A Lumière diamond is grown by chemical vapour deposition — carbon
              gas condensed onto a seed crystal until a stone emerges, atom for
              atom identical to anything mined. The process uses roughly ten
              times less carbon, draws no rivers and displaces no communities.
              It is, simply, conflict-free by construction rather than by
              certificate.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p>
              Every stone we sell ships with an independent IGI or GIA report,
              and every piece is backed by lifetime service from our atelier.
              We design for the United States market and beyond — for a
              generation that asks where things come from, and expects a real
              answer.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          FOUNDING PRINCIPLES — 4 value cards
          --------------------------------------------------------------- */}
      <section className="bg-champagne/30 py-24">
        <div className="mx-auto max-w-content px-6 md:px-8">
          <div className="mb-16 text-center">
            <span className="overline text-gold">What We Stand On</span>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-h2 text-obsidian">
              Our Founding Principles
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <div className="h-full rounded-card border border-[color:var(--border-soft)] bg-white/50 p-7">
                  <span className="font-mono text-caption text-gold">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 font-display text-h3 text-obsidian">
                    {p.title}
                  </h3>
                  <p className="mt-3 font-sans text-body text-carbon">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          TEAM — 3 portraits
          --------------------------------------------------------------- */}
      <section className="mx-auto max-w-content px-6 py-24 md:px-8">
        <div className="mb-16 text-center">
          <span className="overline text-gold">The People</span>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-h2 text-obsidian">
            Behind the Maison
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {TEAM.map((person, i) => (
            <Reveal key={person.name} delay={i * 0.05}>
              <figure>
                <Placeholder
                  label={person.name}
                  ratio="aspect-[3/4]"
                  tone="glacial"
                />
                <figcaption className="mt-4 text-center">
                  <span className="block font-display text-body-lg text-obsidian">
                    {person.name}
                  </span>
                  <span className="mt-0.5 block font-mono text-caption uppercase tracking-[0.16em] text-carbon/70">
                    {person.role}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------
          PRESS — featured-in logo strip
          --------------------------------------------------------------- */}
      <section className="border-y border-[color:var(--divider)] bg-white/40 py-14">
        <div className="mx-auto max-w-content px-6 md:px-8">
          <p className="mb-8 text-center font-mono text-caption uppercase tracking-[0.2em] text-carbon/60">
            As featured in
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-5 md:gap-8">
            {PRESS.map((name) => (
              <li
                key={name}
                className="flex h-16 w-40 items-center justify-center rounded-card border border-[color:var(--border-soft)] bg-champagne/40 font-display text-h3 tracking-wide text-carbon/60"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          IMPACT REPORT CTA
          --------------------------------------------------------------- */}
      <section className="mx-auto max-w-content px-6 py-24 md:px-8">
        <div className="rounded-card border border-[color:var(--divider)] bg-obsidian px-8 py-16 text-center text-ivory">
          <span className="overline text-gold">Accountability</span>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-h2 text-ivory">
            See the numbers for yourself.
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-sans text-body text-ivory/75">
            Carbon saved, water spared, stones traced — our full-year accounting,
            published in the open.
          </p>
          <a
            href="/reports/lumiere-impact-2024.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download
            className="mt-8 inline-flex items-center gap-2 rounded-button bg-gold px-7 py-4 font-mono text-caption uppercase tracking-[0.2em] text-obsidian transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivory"
          >
            Download our 2024 Impact Report
          </a>
        </div>
      </section>

      {/* Quiet link onward */}
      <div className="mx-auto max-w-content px-6 pb-24 text-center md:px-8">
        <Link
          href="/craftsmanship"
          className="link-underline font-mono text-caption uppercase tracking-[0.2em] text-carbon"
        >
          See how a stone is made →
        </Link>
      </div>
    </div>
  );
}
