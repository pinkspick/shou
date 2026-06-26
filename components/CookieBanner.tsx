"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

const STORAGE_KEY = "lumiere-consent";

/**
 * Minimal one-line GDPR strip pinned to the bottom of the viewport.
 * Persists the choice in localStorage so it shows only once.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      /* storage unavailable — stay hidden */
    }
  }, []);

  const decide = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Cookie consent"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-[color:var(--divider)] bg-obsidian text-ivory"
        >
          <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-3 px-6 py-3 md:flex-row md:px-8">
            <p className="text-center font-sans text-caption text-ivory/80 md:text-left">
              We use cookies to refine your experience and remember your light.{" "}
              <Link href="/cookies" className="text-gold underline-offset-2 hover:underline">
                Learn more
              </Link>
              .
            </p>
            <div className="flex shrink-0 items-center gap-4">
              <button
                onClick={() => decide("declined")}
                className="font-mono text-caption uppercase tracking-[0.18em] text-ivory/70 transition-colors duration-400 hover:text-ivory"
              >
                Decline
              </button>
              <button
                onClick={() => decide("accepted")}
                className="rounded-button bg-gold px-5 py-2 font-mono text-caption uppercase tracking-[0.18em] text-white transition-colors duration-400 hover:bg-ivory hover:text-obsidian"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
