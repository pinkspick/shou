import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { Placeholder } from "@/components/editorial/Placeholder";
import { Counter } from "@/components/editorial/Counter";

export const metadata: Metadata = {
  title: "Craftsmanship — Where Science Meets Savoir-Faire",
  description:
    "From seed crystal to final inspection: the Lumière atelier process, the artisans behind every piece, and the numbers that define our savoir-faire.",
};

/* The five-step journey from raw carbon to finished piece. */
const STEPS: {
  no: string;
  title: string;
  body: string;
  tone: "champagne" | "glacial";
}[] = [
  {
    no: "01",
    title: "Seed Crystal",
    body: "Every Lumière diamond begins as a wafer-thin sliver of pure carbon — a seed no larger than a fingernail. It carries the exact lattice the finished stone will inherit, atom for atom.",
    tone: "glacial",
  },
  {
    no: "02",
    title: "CVD Growth",
    body: "Inside a plasma reactor, carbon-rich gas is heated until it rains onto the seed, layer by crystalline layer. Over weeks the diamond thickens — grown, never mined, and identical to anything the earth makes.",
    tone: "champagne",
  },
  {
    no: "03",
    title: "Rough Cut",
    body: "The rough crystal is mapped in three dimensions to find the brightest stone hidden inside. A master cutter then cleaves and blocks it, surrendering carats in pursuit of perfect light return.",
    tone: "glacial",
  },
  {
    no: "04",
    title: "Master Setting",
    body: "Goldsmiths raise each setting by hand, tightening prongs under a loupe until the stone sits without a whisper of movement. Metal and mineral become a single, seamless object.",
    tone: "champagne",
  },
  {
    no: "05",
    title: "Final Inspection",
    body: "The finished piece passes beneath ten-times magnification and a gemologist's trained eye. Only once it is flawless to hand and instrument alike is it laser-inscribed and certified.",
    tone: "glacial",
  },
];

/* Fictional artisans — placeholder portraits until real photography is wired. */
const ARTISANS: { name: string; role: string }[] = [
  { name: "Élodie Marchand", role: "Master Cutter" },
  { name: "Tomás Rivera", role: "Head Goldsmith" },
  { name: "Naoko Ishikawa", role: "Gemologist, Quality" },
  { name: "Amara Diallo", role: "Setting Artisan" },
];

/* Animated savoir-faire metrics. */
const NUMBERS: {
  to: number;
  decimals?: number;
  suffix?: string;
  label: string;
}[] = [
  { to: 12, label: "artisan steps" },
  { to: 72, suffix: "h", label: "hours per piece" },
  { to: 0.001, decimals: 3, suffix: "mm", label: "tolerance" },
  { to: 100, suffix: "%", label: "traceable" },
];

export default function CraftsmanshipPage() {
  return (
    <div className="bg-ivory">
      {/* ---------------------------------------------------------------
          HERO
          --------------------------------------------------------------- */}
      <section className="relative">
        <Placeholder
          label="Atelier — wide editorial"
          ratio="aspect-[16/9] md:aspect-[21/9]"
          tone="obsidian"
          className="min-h-[60vh]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-obsidian/30 px-6 text-center">
          <Reveal>
            <span className="overline text-ivory/70">The Atelier</span>
            <h1 className="mt-4 max-w-3xl font-display text-h1 text-ivory md:text-[3.75rem] md:leading-[1.05]">
              Where Science Meets Savoir-Faire
            </h1>
            <p className="mx-auto mt-5 max-w-xl font-sans text-body-lg text-ivory/80">
              A diamond grown in weeks, finished over days, and judged in a
              lifetime of trained seconds. This is how a Lumière piece is made.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          THE ATELIER PROCESS — 5 steps
          --------------------------------------------------------------- */}
      <section className="mx-auto max-w-content px-6 py-24 md:px-8">
        <div className="mb-16 text-center">
          <span className="overline text-gold">From Carbon to Couture</span>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-h2 text-obsidian">
            The Atelier Process
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-body text-carbon">
            Five movements take a single seed of carbon to a piece worn for a
            lifetime — each step measured, deliberate, and done by hand.
          </p>
        </div>

        <div className="flex flex-col gap-20 md:gap-28">
          {STEPS.map((step, i) => {
            const flip = i % 2 === 1;
            return (
              <Reveal key={step.no}>
                <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
                  <div className={flip ? "md:order-2" : ""}>
                    <Placeholder
                      label={`${step.no} · ${step.title}`}
                      ratio="aspect-[4/3]"
                      tone={step.tone}
                    />
                  </div>
                  <div className={flip ? "md:order-1" : ""}>
                    <span className="font-mono text-[3.5rem] leading-none text-champagne md:text-[4.5rem]">
                      {step.no}
                    </span>
                    <h3 className="mt-4 font-display text-h3 text-obsidian">
                      {step.title}
                    </h3>
                    <p className="mt-4 max-w-md font-sans text-body text-carbon">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------------
          THE HUMAN TOUCH — artisan portraits
          --------------------------------------------------------------- */}
      <section className="bg-champagne/30 py-24">
        <div className="mx-auto max-w-content px-6 md:px-8">
          <div className="mb-16 text-center">
            <span className="overline text-gold">Hands Behind the Light</span>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-h2 text-obsidian">
              The Human Touch
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-sans text-body text-carbon">
              Technology grows the crystal. People give it meaning — the cutters,
              setters and gemologists who sign off on every Lumière.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {ARTISANS.map((person, i) => (
              <Reveal key={person.name} delay={i * 0.05}>
                <figure>
                  <Placeholder
                    label={person.name}
                    ratio="aspect-[3/4]"
                    tone="champagne"
                  />
                  <figcaption className="mt-4">
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
        </div>
      </section>

      {/* ---------------------------------------------------------------
          VIDEO — watch a stone come to life
          --------------------------------------------------------------- */}
      <section className="mx-auto max-w-content px-6 py-24 md:px-8">
        <div className="mb-12 text-center">
          <span className="overline text-gold">In Motion</span>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-h2 text-obsidian">
            Watch a stone come to life
          </h2>
        </div>
        <Reveal>
          <div className="relative aspect-video w-full overflow-hidden rounded-card border border-[color:var(--border-soft)] bg-obsidian">
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
              title="Watch a Lumière stone come to life"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Reveal>
      </section>

      {/* ---------------------------------------------------------------
          SAVOIR-FAIRE NUMBERS — animated counters
          --------------------------------------------------------------- */}
      <section className="bg-obsidian py-24 text-ivory">
        <div className="mx-auto max-w-content px-6 md:px-8">
          <div className="mb-16 text-center">
            <span className="overline text-gold">By the Numbers</span>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-h2 text-ivory">
              Savoir-Faire, Measured
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
            {NUMBERS.map((n) => (
              <Reveal key={n.label} className="text-center">
                <div className="font-display text-[3rem] leading-none text-gold md:text-[3.5rem]">
                  <Counter to={n.to} decimals={n.decimals} suffix={n.suffix} />
                </div>
                <p className="mt-3 font-mono text-caption uppercase tracking-[0.18em] text-ivory/70">
                  {n.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
