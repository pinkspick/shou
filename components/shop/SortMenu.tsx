"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SORTS, type SortValue } from "@/lib/products";

const luxe = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * Custom "Sort by" dropdown — replaces the native <select> so the open
 * menu inherits the maison palette instead of the OS accent colour.
 */
export function SortMenu({
  value,
  onChange,
}: {
  value: SortValue;
  onChange: (v: SortValue) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 font-mono text-caption uppercase tracking-[0.18em] text-carbon transition-colors hover:text-obsidian"
      >
        Sort By
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: luxe }}
            className="absolute right-0 top-full z-40 mt-3 w-56 border border-[color:var(--border-soft)] bg-ivory py-2 shadow-[0_18px_40px_-24px_rgba(26,26,24,0.4)]"
          >
            {SORTS.map((s) => {
              const active = s.value === value;
              return (
                <li key={s.value} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(s.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-2.5 text-left font-mono text-caption uppercase tracking-[0.14em] transition-colors",
                      active
                        ? "text-gold"
                        : "text-carbon hover:bg-champagne/40 hover:text-obsidian"
                    )}
                  >
                    {s.label}
                    {active && <span aria-hidden>✓</span>}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
