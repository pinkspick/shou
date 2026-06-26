"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const luxe = [0.25, 0.46, 0.45, 0.94] as const;

/* ---------------------------------------------------------------
   Animated count-up — runs once when the number enters view.
   --------------------------------------------------------------- */
function CountUp({
  to,
  suffix = "",
  duration = 1600,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduce]);

  return (
    <span ref={ref} className="numeric font-mono tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

/* ---------------------------------------------------------------
   Panel wrapper — fades + lifts on scroll entry.
   --------------------------------------------------------------- */
function Panel({
  index,
  eyebrow,
  title,
  children,
  visual,
}: {
  index: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  visual: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.7, ease: luxe }}
      className="flex flex-col items-center text-center"
    >
      <div className="mb-8 flex h-28 w-28 items-center justify-center text-gold">
        {visual}
      </div>
      <span className="overline">
        {index} · {eyebrow}
      </span>
      <h3 className="mt-3 font-display text-h3 text-obsidian">{title}</h3>
      <p className="mt-3 max-w-xs font-sans text-body text-carbon">{children}</p>
    </motion.div>
  );
}

/* ---------------------------------------------------------------
   SVG visuals
   --------------------------------------------------------------- */
function ProcessDiagram() {
  return (
    <svg viewBox="0 0 96 96" fill="none" className="h-full w-full" aria-hidden>
      {/* seed → reactor → diamond */}
      <circle cx="20" cy="48" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M28 48h16" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
      <rect x="44" y="34" width="28" height="28" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M52 48l6-7 6 7-6 7-6-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M76 48h6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
      <path d="M82 48l8-6v12l-8-6z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

function LeafStat() {
  return (
    <svg viewBox="0 0 96 96" fill="none" className="h-full w-full" aria-hidden>
      <path
        d="M48 18C30 26 22 42 26 64c0 0 24 8 38-12 12-18 6-30-16-34z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M40 60c6-14 14-22 24-28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CertificateSeal() {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 96 96"
      fill="none"
      className="h-full w-full"
      aria-hidden
      animate={reduce ? undefined : { rotate: 360 }}
      transition={{ duration: 14, ease: "linear", repeat: Infinity }}
    >
      <circle cx="48" cy="48" r="30" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 5" />
      <circle cx="48" cy="48" r="22" stroke="currentColor" strokeWidth="1.5" />
      <path d="M48 36l5 7 8-2-4 8 4 8-8-2-5 7-5-7-8 2 4-8-4-8 8 2 5-7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </motion.svg>
  );
}

/* ---------------------------------------------------------------
   SECTION 3 — EARTH STORYLINE
   --------------------------------------------------------------- */
export function EarthStory() {
  return (
    <section className="bg-ivory py-24">
      <div className="mx-auto max-w-content px-6 md:px-8">
        <div className="mb-16 text-center">
          <span className="overline text-gold">The Earth Storyline</span>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-h2 text-obsidian">
            Brilliance without the burden.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-12">
          <Panel
            index="A"
            eyebrow="Origin"
            title="Conflict-Free, by Design"
            visual={<ProcessDiagram />}
          >
            Grown in a reactor, not torn from the ground. Every Lumière stone is
            traceable from seed to setting.
          </Panel>

          <Panel
            index="B"
            eyebrow="Impact"
            title="10× Less Carbon"
            visual={<LeafStat />}
          >
            <span className="font-display text-h1 text-gold">
              <CountUp to={10} suffix="×" />
            </span>
            <span className="mt-1 block">
              lower carbon footprint than a mined equivalent, gram for gram.
            </span>
          </Panel>

          <Panel
            index="C"
            eyebrow="Assurance"
            title="IGI Certified. Every Stone."
            visual={<CertificateSeal />}
          >
            Independently graded and laser-inscribed. Your certificate travels
            with your diamond, always.
          </Panel>
        </div>
      </div>
    </section>
  );
}
