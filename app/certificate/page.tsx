import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { SpinningDiamond } from "@/components/product/SpinningDiamond";
import { VerifyForm } from "@/components/certificate/VerifyForm";

export const metadata: Metadata = {
  title: "Certification — Every Stone Certified",
  description:
    "Every Lumière diamond ships with an independent IGI report. Learn what the certificate contains, how to read it, and how to verify your stone in the IGI database.",
  openGraph: {
    title: "Every Diamond. Every Stone. Certified.",
    description:
      "What an IGI report contains, how to read it, and how to verify your Lumière stone.",
    type: "website",
    images: [{ url: "/og/certificate.jpg", width: 1200, height: 630, alt: "A Lumière IGI diamond certificate" }],
  },
};

/* The annotated anatomy of a report. */
const ANATOMY: { label: string; value: string; note: string }[] = [
  {
    label: "Stone ID",
    value: "LG-1234567890",
    note: "A unique number laser-inscribed on the girdle, matching this report.",
  },
  {
    label: "Cut Grade",
    value: "Excellent",
    note: "How well the stone returns light — the single biggest driver of sparkle.",
  },
  {
    label: "Carat",
    value: "1.50 ct",
    note: "The precise weight, measured to the hundredth of a carat.",
  },
  {
    label: "Colour",
    value: "F",
    note: "Graded D–Z; F sits in the rare, near-colourless top tier.",
  },
  {
    label: "Clarity",
    value: "VS1",
    note: "Inclusions invisible to the eye, faint even under 10× magnification.",
  },
  {
    label: "Origin",
    value: "Laboratory Grown",
    note: "Stated plainly on every report — grown by CVD, never mined.",
  },
];

export default function CertificatePage() {
  return (
    <div className="bg-ivory">
      {/* ---------------------------------------------------------------
          HERO — spinning diamond
          --------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-obsidian py-24 text-ivory md:py-32">
        <div className="mx-auto flex max-w-content flex-col items-center px-6 text-center md:px-8">
          <SpinningDiamond size={200} />
          <Reveal>
            <span className="overline mt-12 block text-gold">
              Independent Certification
            </span>
            <h1 className="mt-4 max-w-3xl font-display text-h1 text-ivory md:text-[3.75rem] md:leading-[1.05]">
              Every Diamond. Every Stone. Certified.
            </h1>
            <p className="mx-auto mt-5 max-w-xl font-sans text-body-lg text-ivory/80">
              No promises you can&rsquo;t check. Each Lumière stone is graded by
              an independent laboratory and ships with the paperwork to prove it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          WHAT IS IGI / WHAT'S IN A CERTIFICATE
          --------------------------------------------------------------- */}
      <section className="mx-auto max-w-content px-6 py-24 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <div>
              <span className="overline text-gold">The Authority</span>
              <h2 className="mt-4 font-display text-h2 text-obsidian">
                What is IGI?
              </h2>
              <p className="mt-4 font-sans text-body-lg text-carbon">
                The International Gemological Institute is one of the world&rsquo;s
                largest independent gem laboratories, founded in 1975. Its
                gemologists grade each stone with no stake in the sale — an
                impartial second opinion on exactly what you&rsquo;re buying.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div>
              <span className="overline text-gold">The Document</span>
              <h2 className="mt-4 font-display text-h2 text-obsidian">
                What does it contain?
              </h2>
              <p className="mt-4 font-sans text-body-lg text-carbon">
                A full scientific profile of your diamond: the famous 4Cs — cut,
                colour, clarity and carat — alongside polish, symmetry,
                measurements, fluorescence, and a unique ID matching the
                inscription on the stone itself.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          CERTIFICATE ANATOMY — annotated static report
          --------------------------------------------------------------- */}
      <section className="bg-champagne/30 py-24">
        <div className="mx-auto max-w-content px-6 md:px-8">
          <div className="mb-16 text-center">
            <span className="overline text-gold">Read It Like a Gemologist</span>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-h2 text-obsidian">
              The Anatomy of a Certificate
            </h2>
          </div>

          <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            {/* Static mock report */}
            <Reveal>
              <div className="rounded-card border border-[color:var(--border-soft)] bg-white p-7 shadow-sm">
                <div className="flex items-start justify-between border-b border-[color:var(--border-soft)] pb-4">
                  <div>
                    <p className="font-display text-h3 text-obsidian">
                      IGI Diamond Report
                    </p>
                    <p className="mt-1 font-sans text-caption text-carbon">
                      International Gemological Institute
                    </p>
                  </div>
                  <span className="numeric font-mono text-caption uppercase tracking-[0.16em] text-gold">
                    LG-1234567890
                  </span>
                </div>
                <dl className="mt-4">
                  {ANATOMY.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between border-b border-[color:var(--border-soft)] py-3"
                    >
                      <dt className="font-mono text-caption uppercase tracking-[0.14em] text-carbon">
                        {row.label}
                      </dt>
                      <dd className="font-sans text-body text-obsidian">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            {/* Annotations */}
            <Reveal delay={0.05}>
              <ol className="space-y-5">
                {ANATOMY.map((row, i) => (
                  <li key={row.label} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold font-mono text-caption text-gold">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-h3 text-obsidian">
                        {row.label}
                      </h3>
                      <p className="mt-1 font-sans text-body text-carbon">
                        {row.note}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          VERIFY YOUR CERTIFICATE
          --------------------------------------------------------------- */}
      <section className="mx-auto max-w-content px-6 py-24 text-center md:px-8">
        <span className="overline text-gold">Trust, but Verify</span>
        <h2 className="mx-auto mt-4 max-w-2xl font-display text-h2 text-obsidian">
          Verify your certificate
        </h2>
        <p className="mx-auto mb-8 mt-4 max-w-lg font-sans text-body text-carbon">
          Enter the certificate ID from your report and we&rsquo;ll take you
          straight to the IGI database to confirm it, independently.
        </p>
        <VerifyForm />
      </section>

      {/* ---------------------------------------------------------------
          CLOSING NOTE
          --------------------------------------------------------------- */}
      <section className="border-t border-[color:var(--divider)] bg-white/40 py-16">
        <p className="mx-auto max-w-2xl px-6 text-center font-display text-h3 text-obsidian md:px-8">
          Every Lumière piece ships with a physical certificate in the box.
        </p>
      </section>
    </div>
  );
}
