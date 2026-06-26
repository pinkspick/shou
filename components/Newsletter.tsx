"use client";

import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Newsletter sign-up band — sits at the foot of editorial pages, above
 * the global footer. No backend yet; submitting shows a quiet confirmation.
 */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="border-t border-[color:var(--border-soft)] bg-ivory">
      <div className="mx-auto max-w-content px-6 py-20 text-center md:px-8">
        <Reveal>
          <span className="overline text-gold">Stay in the Light</span>
          <h2 className="mx-auto mt-4 max-w-xl font-display text-h2 text-obsidian">
            The Lumière Newsletter
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-body text-carbon">
            Collections, atelier stories and private events — be the first to
            know. No noise, only light.
          </p>

          {sent ? (
            <p className="mx-auto mt-8 max-w-md font-mono text-caption uppercase tracking-[0.16em] text-gold">
              Thank you — your invitation is on its way.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setSent(true);
              }}
              className="mx-auto mt-8 flex max-w-md flex-col items-center gap-4 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                aria-label="Email address"
                className="w-full flex-1 border-b border-obsidian bg-transparent py-3 font-sans text-body text-obsidian placeholder:text-carbon/50 focus:border-gold focus:outline-none"
              />
              <button
                type="submit"
                className="w-full shrink-0 rounded-button bg-obsidian px-8 py-3 font-mono text-caption uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold sm:w-auto"
              >
                Subscribe
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
