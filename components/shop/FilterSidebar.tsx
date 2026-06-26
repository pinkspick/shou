"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PriceRange } from "./PriceRange";
import {
  CARATS,
  CATEGORIES,
  CUTS,
  METALS,
  OCCASIONS,
  STONES,
  type Carat,
  type Category,
} from "@/lib/products";
import { PARAM, type Filters } from "@/lib/shop";

const luxe = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * Collapsible filter group — a header with a +/− toggle that reveals its
 * controls on click (mirrors the Van Cleef e-boutique sidebar). Pass
 * `count` to surface how many values are active while collapsed.
 */
function FilterGroup({
  label,
  count = 0,
  defaultOpen = false,
  children,
}: {
  label: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border-b border-[color:var(--border-soft)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="overline flex items-center gap-2 text-obsidian">
          {label}
          {count > 0 && (
            <span className="numeric rounded-full bg-gold px-1.5 py-0.5 font-mono text-[0.5rem] leading-none text-white">
              {count}
            </span>
          )}
        </span>
        <span className="relative h-3 w-3 text-carbon">
          <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-current" />
          <span
            className={cn(
              "absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-current transition-transform duration-300",
              open ? "scale-y-0" : "scale-y-100"
            )}
          />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: luxe }}
            className="overflow-hidden"
          >
            <div className="pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1.5 font-sans text-body text-carbon transition-colors hover:text-obsidian">
      <span
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded-[2px] border transition-colors",
          checked ? "border-gold bg-gold text-white" : "border-rose-gold bg-transparent"
        )}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2.5 6.5l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

export function FilterSidebar({
  filters,
  routeCategory,
  onToggle,
  onCarat,
  onPrice,
  onClear,
  onResetCategory,
}: {
  filters: Filters;
  routeCategory?: Category;
  onToggle: (param: string, value: string) => void;
  onCarat: (value: Carat | null) => void;
  onPrice: (min: number, max: number) => void;
  onClear: () => void;
  onResetCategory: () => void;
}) {
  const priceActive =
    filters.min > 500 || filters.max < 25000 ? 1 : 0;

  return (
    <div className="flex flex-col border-t border-[color:var(--border-soft)]">
      {/* Category */}
      <FilterGroup
        label="Category"
        defaultOpen
        count={routeCategory ? 0 : filters.categories.length}
      >
        {routeCategory ? (
          <ul className="flex flex-col">
            <li>
              <Link
                href="/shop"
                className="block py-1.5 font-sans text-body text-carbon transition-colors hover:text-obsidian"
              >
                All
              </Link>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c.value}>
                <Link
                  href={`/shop/${c.value}`}
                  className={cn(
                    "block py-1.5 font-sans text-body transition-colors hover:text-obsidian",
                    routeCategory === c.value ? "text-gold" : "text-carbon"
                  )}
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <CheckRow
              label="All"
              checked={filters.categories.length === 0}
              onChange={onResetCategory}
            />
            {CATEGORIES.map((c) => (
              <CheckRow
                key={c.value}
                label={c.label}
                checked={filters.categories.includes(c.value)}
                onChange={() => onToggle(PARAM.category, c.value)}
              />
            ))}
          </div>
        )}
      </FilterGroup>

      {/* Price */}
      <FilterGroup label="Price Range" count={priceActive}>
        <PriceRange min={filters.min} max={filters.max} onCommit={onPrice} />
      </FilterGroup>

      {/* Gold carat (radio) */}
      <FilterGroup label="Gold Carat" count={filters.carat ? 1 : 0}>
        <div className="flex flex-col">
          {CARATS.map((c) => {
            const active = filters.carat === c;
            return (
              <label
                key={c}
                className="flex cursor-pointer items-center gap-3 py-1.5 font-sans text-body text-carbon transition-colors hover:text-obsidian"
              >
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border transition-colors",
                    active ? "border-gold" : "border-rose-gold"
                  )}
                >
                  {active && <span className="h-2 w-2 rounded-full bg-gold" />}
                </span>
                <input
                  type="radio"
                  name="carat"
                  className="sr-only"
                  checked={active}
                  onChange={() => onCarat(active ? null : c)}
                  onClick={() => active && onCarat(null)}
                />
                {c}
              </label>
            );
          })}
        </div>
      </FilterGroup>

      {/* Stone type */}
      <FilterGroup label="Stone Type" count={filters.stones.length}>
        {STONES.map((s) => (
          <CheckRow
            key={s}
            label={s}
            checked={filters.stones.includes(s)}
            onChange={() => onToggle(PARAM.stone, s)}
          />
        ))}
      </FilterGroup>

      {/* Cut */}
      <FilterGroup label="Cut" count={filters.cuts.length}>
        {CUTS.map((c) => (
          <CheckRow
            key={c}
            label={c}
            checked={filters.cuts.includes(c)}
            onChange={() => onToggle(PARAM.cut, c)}
          />
        ))}
      </FilterGroup>

      {/* Metal color (swatches) */}
      <FilterGroup label="Metal Color" count={filters.metals.length}>
        <div className="flex flex-wrap gap-3 pt-1">
          {METALS.map((m) => {
            const active = filters.metals.includes(m.value);
            return (
              <button
                key={m.value}
                type="button"
                aria-pressed={active}
                aria-label={m.value}
                title={m.value}
                onClick={() => onToggle(PARAM.metal, m.value)}
                className={cn(
                  "relative h-9 w-9 rounded-full border transition-transform duration-300 ease-luxe hover:scale-105",
                  active ? "border-gold ring-1 ring-gold ring-offset-2 ring-offset-ivory" : "border-rose-gold/60"
                )}
                style={{ backgroundColor: m.hex }}
              />
            );
          })}
        </div>
      </FilterGroup>

      {/* Occasion */}
      <FilterGroup label="Occasion" count={filters.occasions.length}>
        {OCCASIONS.map((o) => (
          <CheckRow
            key={o}
            label={o}
            checked={filters.occasions.includes(o)}
            onChange={() => onToggle(PARAM.occasion, o)}
          />
        ))}
      </FilterGroup>

      {/* Clear all */}
      <button
        type="button"
        onClick={onClear}
        className="mt-6 self-start font-mono text-caption uppercase tracking-[0.18em] text-carbon link-underline hover:text-obsidian"
      >
        Clear all filters
      </button>
    </div>
  );
}
