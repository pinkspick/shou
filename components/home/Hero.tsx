"use client";

import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

/**
 * SECTION 1 — HERO
 * Full-viewport stage. A muted/looping video is the intended background;
 * until an asset is wired, we fall back to a calm --ivory field so the
 * page still reads as editorial rather than broken.
 *
 * To enable video later: drop a file at /public/hero.mp4 and uncomment
 * the <video> block below.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ivory">
      {/* --- Video background (placeholder disabled until asset exists) --- */}
      {/*
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-obsidian/20" aria-hidden />
      */}

      {/* Soft light gradient to give the ivory field depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,rgba(255,255,255,0.9),transparent_60%)]"
      />

      {/* --- Overlaid headline --- */}
      <Stagger className="relative z-10 mx-auto flex max-w-content flex-col items-center px-6 text-center">
        <StaggerItem>
          <span className="overline">Cultivated Diamonds · Est. Lumière</span>
        </StaggerItem>

        <StaggerItem className="mt-6">
          <h1 className="font-display text-display text-obsidian">
            Born from Light.
            <br />
            Built for the Earth.
          </h1>
        </StaggerItem>

        <StaggerItem className="mt-5">
          <p className="font-sans text-body-lg text-carbon">
            Lab-grown diamonds. Zero compromise.
          </p>
        </StaggerItem>

        <StaggerItem className="mt-10">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-button bg-gold px-8 py-4 font-mono text-body uppercase tracking-[0.2em] text-white transition-all duration-400 ease-luxe hover:bg-obsidian focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          >
            Explore the Collection
          </Link>
        </StaggerItem>
      </Stagger>

      {/* --- Bottom-left editorial credit --- */}
      <p className="absolute bottom-8 left-6 z-10 font-mono text-caption uppercase tracking-[0.18em] text-carbon/70 md:left-8">
        Sustainably grown. Ethically set. Certified.
      </p>
    </section>
  );
}
