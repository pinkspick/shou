"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/shop/ProductCard";
import { Newsletter } from "@/components/Newsletter";
import { buildWhatsAppUrl } from "@/lib/site";
import { productsByIds, type OccasionPage } from "@/lib/occasions";

const luxe = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * Occasion landing page — hero, poem, "for her / for them" curated edit,
 * gift-wrapping callout, budget guide and a consultation prompt.
 */
export function OccasionView({ page }: { page: OccasionPage }) {
  const [recipient, setRecipient] = useState<"her" | "them">("her");

  const ids = recipient === "her" ? page.forHer : page.forThem;
  const products = productsByIds(ids);

  const consultUrl = buildWhatsAppUrl(
    `Hello Lumière — I'd like guidance choosing a ${page.slug} gift.`
  );

  return (
    <>
      {/* ---- Hero ---- */}
      <section className="relative flex min-h-[78vh] items-end overflow-hidden">
        {/* Ambient gradient (stands in for a video loop) */}
        <div className="absolute inset-0" style={{ background: page.heroGradient }} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(26,26,24,0.55) 0%, rgba(26,26,24,0.12) 38%, transparent 70%)",
          }}
        />
        {/* Soft grain to read as film */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.5] mix-blend-soft-light"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.4), transparent 45%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-content px-6 pb-16 md:px-8 md:pb-24">
          <Reveal>
            <span className="font-mono text-caption uppercase tracking-[0.28em] text-ivory/80">
              {page.overline}
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-5 max-w-3xl whitespace-pre-line font-display text-[clamp(2.6rem,6vw,4.75rem)] leading-[1.04] text-ivory">
              {page.headline}
            </h1>
          </Reveal>
        </div>
      </section>

      {/* ---- Poem ---- */}
      <section className="border-b border-[color:var(--border-soft)] bg-ivory">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center md:px-8 md:py-28">
          <Reveal>
            <span className="text-gold">◆</span>
            <p className="mt-6 font-display text-[clamp(1.35rem,2.6vw,1.85rem)] leading-relaxed text-obsidian">
              {page.poem}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- Curated edit ---- */}
      <section className="mx-auto max-w-content px-6 py-20 md:px-8 md:py-24">
        <header className="mb-12 flex flex-col items-center gap-6 text-center">
          <Reveal>
            <span className="overline text-carbon/70">The Edit</span>
            <h2 className="mt-3 font-display text-h2 text-obsidian">
              Chosen for the occasion
            </h2>
          </Reveal>

          {/* For her / For them toggle */}
          <Reveal delay={0.05}>
            <div
              role="tablist"
              aria-label="Recipient"
              className="relative inline-flex rounded-full border border-[color:var(--border-soft)] bg-white p-1"
            >
              {(
                [
                  ["her", page.herLabel],
                  ["them", page.themLabel],
                ] as const
              ).map(([key, label]) => {
                const active = recipient === key;
                return (
                  <button
                    key={key}
                    role="tab"
                    aria-selected={active}
                    type="button"
                    onClick={() => setRecipient(key)}
                    className="relative z-10 rounded-full px-6 py-2 font-mono text-caption uppercase tracking-[0.16em] transition-colors"
                  >
                    {active && (
                      <motion.span
                        layoutId="recipient-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-obsidian"
                        transition={{ duration: 0.4, ease: luxe }}
                      />
                    )}
                    <span className={active ? "text-ivory" : "text-carbon"}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={recipient}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: luxe }}
            className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3"
          >
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onModel={false} />
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ---- Gift wrapping callout ---- */}
      <section className="bg-champagne/50">
        <div className="mx-auto flex max-w-content flex-col items-center gap-4 px-6 py-16 text-center md:px-8">
          <Reveal>
            <span className="text-gold text-2xl">✦</span>
            <h3 className="mt-3 font-display text-h3 text-obsidian">
              Wrapped, ready, unforgettable
            </h3>
            <p className="mx-auto mt-3 max-w-xl font-sans text-body text-carbon">
              Complimentary gift packaging accompanies every occasion order — a
              lacquered case, a hand-tied ribbon, and a card penned in your words.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- Budget guide ---- */}
      <section className="mx-auto max-w-content px-6 py-20 md:px-8 md:py-24">
        <header className="mb-12 text-center">
          <Reveal>
            <span className="overline text-carbon/70">A Guide</span>
            <h2 className="mt-3 font-display text-h2 text-obsidian">Shop by budget</h2>
          </Reveal>
        </header>

        <div className="grid gap-6 sm:grid-cols-3">
          {page.budget.map((tier, i) => (
            <Reveal key={tier.label} delay={i * 0.06}>
              <Link
                href={tier.href}
                className="group flex h-full flex-col justify-between border border-[color:var(--border-soft)] bg-white p-8 transition-colors hover:border-gold"
              >
                <div>
                  <p className="numeric font-display text-h3 text-obsidian">
                    {tier.label}
                  </p>
                  <p className="mt-2 font-sans text-body text-carbon">{tier.note}</p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 font-mono text-caption uppercase tracking-[0.18em] text-gold">
                  Explore
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- Consultation CTA ---- */}
      <section className="bg-obsidian">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center md:px-8 md:py-24">
          <Reveal>
            <h2 className="font-display text-h2 text-ivory">Not sure where to begin?</h2>
            <p className="mx-auto mt-4 max-w-md font-sans text-body text-ivory/70">
              Our concierge will help you choose — discreetly, and without
              obligation. We are here whenever the moment calls.
            </p>
            <a
              href={consultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "mt-8 inline-block rounded-button bg-gold px-10 py-4",
                "font-mono text-caption uppercase tracking-[0.2em] text-white",
                "transition-colors hover:bg-ivory hover:text-obsidian"
              )}
            >
              Book a Consultation
            </a>
          </Reveal>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
