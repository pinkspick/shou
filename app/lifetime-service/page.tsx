import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { BookAppointment } from "@/components/service/BookAppointment";

export const metadata: Metadata = {
  title: "Lifetime Service — Yours, Forever.",
  description:
    "Free cleaning, inspection and resizing; prong retipping and full restoration. Every Lumière piece is cared for, for life — insured both ways and certified after every service.",
};

/* Four service tiles. */
const TILES: { title: string; price: string; body: string }[] = [
  {
    title: "Cleaning + Inspection",
    price: "Free",
    body: "Ultrasonic cleaning and a full prong-and-setting check, returning the original fire to your piece. Bring it in or post it to us as often as you like.",
  },
  {
    title: "Resizing",
    price: "Free",
    body: "Fingers change; your ring shouldn't have to be replaced. Up or down, we resize the first time at no cost and at cost thereafter.",
  },
  {
    title: "Prong Retipping",
    price: "$0–$75",
    body: "Worn prongs are rebuilt and re-polished so your stone stays secure for decades. Complimentary within the first two years.",
  },
  {
    title: "Full Restoration",
    price: "By quote",
    body: "Heirloom revival — re-shanking, re-plating, stone replacement and complete refinishing. We assess and quote before any work begins.",
  },
];

/* How-to-book steps. */
const STEPS: { no: string; title: string; body: string }[] = [
  {
    no: "01",
    title: "Contact us",
    body: "Message us on WhatsApp or email with your order number and what your piece needs. We'll confirm the service and timing.",
  },
  {
    no: "02",
    title: "Ship or visit",
    body: "Post your piece with our prepaid, fully insured label — or visit the atelier in person if you'd prefer to hand it over.",
  },
  {
    no: "03",
    title: "We return it polished",
    body: "Our artisans restore it to certificate condition and return it insured, with a fresh certificate of service in the box.",
  },
];

/* Trust badges. */
const BADGES: { label: string; icon: "shield" | "seal" | "return" }[] = [
  { label: "Insured shipping", icon: "shield" },
  { label: "Certificate of service", icon: "seal" },
  { label: "30-day return", icon: "return" },
];

export default function LifetimeServicePage() {
  return (
    <div className="bg-ivory">
      {/* ---------------------------------------------------------------
          PLEDGE
          --------------------------------------------------------------- */}
      <section className="mx-auto max-w-content px-6 pb-16 pt-32 md:px-8">
        <Reveal className="text-center">
          <span className="overline text-gold">Lifetime Service</span>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-h1 text-obsidian md:text-[3.75rem] md:leading-[1.05]">
            Yours, Forever.
          </h1>
        </Reveal>

        <Reveal className="mt-12">
          <div className="mx-auto max-w-3xl rounded-card border border-[color:var(--divider)] bg-champagne/40 px-8 py-12 text-center md:px-16">
            <p className="font-display text-h2 italic text-obsidian">
              &ldquo;We stand behind every piece, for life.&rdquo;
            </p>
            <p className="mx-auto mt-5 max-w-xl font-sans text-body-lg text-carbon">
              A Lumière piece is made to be worn every day and handed down. When
              it needs care, we&rsquo;re here — no receipts to dig up, no warranty
              clock to beat. Ownership is the only proof we ask for.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ---------------------------------------------------------------
          FOUR SERVICE TILES
          --------------------------------------------------------------- */}
      <section className="mx-auto max-w-content px-6 py-16 md:px-8">
        <div className="mb-14 text-center">
          <span className="overline text-gold">What&rsquo;s Covered</span>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-h2 text-obsidian">
            Care for the life of the piece
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TILES.map((tile, i) => (
            <Reveal key={tile.title} delay={i * 0.05}>
              <div className="flex h-full flex-col rounded-card border border-[color:var(--border-soft)] bg-white/50 p-6">
                <span className="inline-flex w-fit rounded-full bg-gold/10 px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-gold">
                  {tile.price}
                </span>
                <h3 className="mt-4 font-display text-h3 text-obsidian">
                  {tile.title}
                </h3>
                <p className="mt-3 font-sans text-body text-carbon">
                  {tile.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------
          HOW TO BOOK — 3 steps
          --------------------------------------------------------------- */}
      <section className="bg-champagne/30 py-24">
        <div className="mx-auto max-w-content px-6 md:px-8">
          <div className="mb-16 text-center">
            <span className="overline text-gold">Simple as That</span>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-h2 text-obsidian">
              How to book
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, i) => (
              <Reveal key={step.no} delay={i * 0.05} className="text-center">
                <span className="font-mono text-[3rem] leading-none text-champagne md:text-[3.5rem]">
                  {step.no}
                </span>
                <h3 className="mt-4 font-display text-h3 text-obsidian">
                  {step.title}
                </h3>
                <p className="mx-auto mt-3 max-w-xs font-sans text-body text-carbon">
                  {step.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          BOOK APPOINTMENT — WhatsApp + email form
          --------------------------------------------------------------- */}
      <section className="mx-auto max-w-2xl px-6 py-24 md:px-8">
        <div className="mb-12 text-center">
          <span className="overline text-gold">Begin</span>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-h2 text-obsidian">
            Book an appointment
          </h2>
          <p className="mx-auto mt-4 max-w-md font-sans text-body text-carbon">
            Tell us a little about your piece and we&rsquo;ll take it from there —
            choose WhatsApp for a quick reply, or email if you prefer.
          </p>
        </div>
        <Reveal>
          <BookAppointment />
        </Reveal>
      </section>

      {/* ---------------------------------------------------------------
          TRUST BADGES
          --------------------------------------------------------------- */}
      <section className="border-t border-[color:var(--border-soft)] bg-ivory py-16">
        <div className="mx-auto flex max-w-content flex-col items-center justify-center gap-10 px-6 md:flex-row md:gap-20 md:px-8">
          {BADGES.map((badge) => (
            <Reveal key={badge.label} className="flex items-center gap-3">
              <span className="text-gold">
                <BadgeIcon icon={badge.icon} />
              </span>
              <span className="font-mono text-caption uppercase tracking-[0.18em] text-obsidian">
                {badge.label}
              </span>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

function BadgeIcon({ icon }: { icon: "shield" | "seal" | "return" }) {
  if (icon === "shield") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (icon === "seal") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <circle cx="12" cy="10" r="6" />
        <path d="M12 7l1.2 2.4 2.6.4-1.9 1.8.4 2.6L12 13.4 9.7 14.2l.4-2.6L8.2 9.8l2.6-.4L12 7z" strokeLinejoin="round" />
        <path d="M9 15l-1 6 4-2 4 2-1-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M4 9a8 8 0 0 1 14-3l2 2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 4v5h-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 15a8 8 0 0 1-14 3l-2-2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 20v-5h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
