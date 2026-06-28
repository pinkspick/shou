"use client";

import { useEffect, useState } from "react";

/**
 * SECTION 2 — PRICING EVENT TAG + COUNTDOWN
 * Full-width obsidian strip below the hero, above the categories.
 * Live DD:HH:MM:SS countdown to a fixed target. Clamps at zero when the
 * event has passed (never shows negative time).
 */
const TARGET = new Date("2026-09-01T00:00:00").getTime();

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function getRemaining(): Remaining {
  const diff = Math.max(0, TARGET - Date.now());
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function CountdownBanner() {
  // Start null so server and first client render match (avoids hydration drift).
  const [time, setTime] = useState<Remaining | null>(null);

  useEffect(() => {
    setTime(getRemaining());
    const id = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const units: { label: string; value: number }[] = [
    { label: "Days", value: time?.days ?? 0 },
    { label: "Hrs", value: time?.hours ?? 0 },
    { label: "Min", value: time?.minutes ?? 0 },
    { label: "Sec", value: time?.seconds ?? 0 },
  ];

  return (
    <section className="w-full bg-obsidian text-ivory">
      <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-6 px-6 py-6 md:flex-row md:px-8">
        {/* Left — event label */}
        <div className="text-center md:text-left">
          <span className="overline text-gold">Limited Event</span>
          <p className="mt-1 font-display text-h3 text-ivory">
            Summer Luminance Event
            <span className="block font-sans text-body text-ivory/70 md:inline md:before:px-2 md:before:content-['—']">
              Up to 20% off select pieces
            </span>
          </p>
        </div>

        {/* Right — live timer */}
        <div
          className="flex shrink-0 items-start gap-4"
          role="timer"
          aria-label="Time remaining in the Summer Luminance Event"
        >
          {units.map((u, i) => (
            <div key={u.label} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <span
                  className="numeric font-mono text-h2 leading-none text-gold"
                  suppressHydrationWarning
                >
                  {pad(u.value)}
                </span>
                <span className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ivory/50">
                  {u.label}
                </span>
              </div>
              {i < units.length - 1 && (
                <span className="font-mono text-h2 leading-none text-ivory/30" aria-hidden>
                  :
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
