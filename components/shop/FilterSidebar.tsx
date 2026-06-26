"use client";

import Link from "next/link";
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

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="overline mb-4 block text-obsidian">{children}</h3>
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
  return (
    <div className="flex flex-col gap-10">
      {/* Category */}
      <section>
        <GroupLabel>Category</GroupLabel>
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
      </section>

      {/* Price */}
      <section>
        <GroupLabel>Price Range</GroupLabel>
        <PriceRange min={filters.min} max={filters.max} onCommit={onPrice} />
      </section>

      {/* Gold carat (radio) */}
      <section>
        <GroupLabel>Gold Carat</GroupLabel>
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
      </section>

      {/* Stone type */}
      <section>
        <GroupLabel>Stone Type</GroupLabel>
        {STONES.map((s) => (
          <CheckRow
            key={s}
            label={s}
            checked={filters.stones.includes(s)}
            onChange={() => onToggle(PARAM.stone, s)}
          />
        ))}
      </section>

      {/* Cut */}
      <section>
        <GroupLabel>Cut</GroupLabel>
        {CUTS.map((c) => (
          <CheckRow
            key={c}
            label={c}
            checked={filters.cuts.includes(c)}
            onChange={() => onToggle(PARAM.cut, c)}
          />
        ))}
      </section>

      {/* Metal color (swatches) */}
      <section>
        <GroupLabel>Metal Color</GroupLabel>
        <div className="flex flex-wrap gap-3">
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
      </section>

      {/* Occasion */}
      <section>
        <GroupLabel>Occasion</GroupLabel>
        {OCCASIONS.map((o) => (
          <CheckRow
            key={o}
            label={o}
            checked={filters.occasions.includes(o)}
            onChange={() => onToggle(PARAM.occasion, o)}
          />
        ))}
      </section>

      {/* Clear all */}
      <button
        type="button"
        onClick={onClear}
        className="self-start font-mono text-caption uppercase tracking-[0.18em] text-carbon link-underline hover:text-obsidian"
      >
        Clear all filters
      </button>
    </div>
  );
}
