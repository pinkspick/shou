"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FilterSidebar } from "./FilterSidebar";
import { ProductCard } from "./ProductCard";
import {
  PRICE_MAX,
  PRICE_MIN,
  PRODUCTS,
  SORTS,
  type Carat,
  type Category,
} from "@/lib/products";
import {
  activeFilterCount,
  filterProducts,
  isSortValue,
  PARAM,
  parseFilters,
  sortProducts,
} from "@/lib/shop";

const luxe = [0.25, 0.46, 0.45, 0.94] as const;

export function ShopBrowser({
  routeCategory,
  heading,
}: {
  routeCategory?: Category;
  heading: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const params = new URLSearchParams(sp.toString());
  const filters = parseFilters(params, routeCategory);
  const sortRaw = sp.get(PARAM.sort);
  const sort = isSortValue(sortRaw) ? sortRaw : "featured";
  const cols = sp.get(PARAM.cols) === "2" ? 2 : 3;
  const onModel = sp.get(PARAM.model) === "1";

  const results = sortProducts(filterProducts(PRODUCTS, filters), sort);
  const activeCount = activeFilterCount(filters, Boolean(routeCategory));

  /* ---- URL writers ---- */
  const writeParams = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(sp.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v === null || v === "") next.delete(k);
        else next.set(k, v);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [sp, pathname, router]
  );

  const toggleCsv = useCallback(
    (param: string, value: string) => {
      const next = new URLSearchParams(sp.toString());
      const set = new Set(
        (next.get(param)?.split(",").filter(Boolean)) ?? []
      );
      if (set.has(value)) set.delete(value);
      else set.add(value);
      if (set.size) next.set(param, [...set].join(","));
      else next.delete(param);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [sp, pathname, router]
  );

  const setCarat = useCallback(
    (value: Carat | null) => writeParams({ [PARAM.carat]: value }),
    [writeParams]
  );

  const setPrice = useCallback(
    (min: number, max: number) =>
      writeParams({
        [PARAM.min]: min > PRICE_MIN ? String(min) : null,
        [PARAM.max]: max < PRICE_MAX ? String(max) : null,
      }),
    [writeParams]
  );

  const clearAll = useCallback(() => {
    // Preserve only view prefs (sort / cols / model); drop all filters.
    const next = new URLSearchParams();
    const keep = [PARAM.sort, PARAM.cols, PARAM.model] as const;
    for (const k of keep) {
      const v = sp.get(k);
      if (v) next.set(k, v);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [sp, pathname, router]);

  /* ---- Body scroll lock for the mobile drawer ---- */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const sidebar = (
    <FilterSidebar
      filters={filters}
      routeCategory={routeCategory}
      onToggle={toggleCsv}
      onCarat={setCarat}
      onPrice={setPrice}
      onClear={clearAll}
      onResetCategory={() => writeParams({ [PARAM.category]: null })}
    />
  );

  return (
    <section className="mx-auto max-w-content px-6 pb-24 pt-32 md:px-8">
      {/* Page heading */}
      <header className="mb-10">
        <span className="overline text-gold">The Collection</span>
        <h1 className="mt-3 font-display text-h1 text-obsidian">{heading}</h1>
      </header>

      <div className="flex gap-12">
        {/* Desktop sidebar */}
        <aside className="hidden w-[280px] shrink-0 lg:block">{sidebar}</aside>

        {/* Main column */}
        <div className="min-w-0 flex-1">
          {/* Toolbar */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--border-soft)] pb-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex items-center gap-2 rounded-button border border-obsidian px-4 py-2 font-mono text-caption uppercase tracking-[0.16em] text-obsidian lg:hidden"
              >
                Filter{activeCount > 0 ? ` (${activeCount})` : ""}
              </button>
              <p className="numeric font-mono text-caption uppercase tracking-[0.16em] text-carbon">
                {results.length} {results.length === 1 ? "piece" : "pieces"}
              </p>
            </div>

            <div className="flex items-center gap-5">
              {/* On-model / product-only toggle */}
              <button
                type="button"
                onClick={() => writeParams({ [PARAM.model]: onModel ? null : "1" })}
                className="hidden items-center gap-2 font-mono text-caption uppercase tracking-[0.16em] text-carbon transition-colors hover:text-obsidian sm:inline-flex"
                aria-pressed={onModel}
              >
                <span
                  className={cn(
                    "relative h-4 w-7 rounded-full transition-colors duration-300",
                    onModel ? "bg-gold" : "bg-rose-gold/50"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all duration-300",
                      onModel ? "left-3.5" : "left-0.5"
                    )}
                  />
                </span>
                On-Model
              </button>

              {/* Column toggle */}
              <div className="hidden items-center gap-1 sm:flex">
                {[3, 2].map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`${c} columns`}
                    aria-pressed={cols === c}
                    onClick={() => writeParams({ [PARAM.cols]: c === 3 ? null : "2" })}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-button border transition-colors",
                      cols === c ? "border-obsidian text-obsidian" : "border-transparent text-carbon/50 hover:text-carbon"
                    )}
                  >
                    <span className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${c}, 1fr)` }}>
                      {Array.from({ length: c }).map((_, i) => (
                        <span key={i} className="h-3 w-1 bg-current" />
                      ))}
                    </span>
                  </button>
                ))}
              </div>

              {/* Sort */}
              <label className="flex items-center gap-2">
                <span className="sr-only">Sort by</span>
                <select
                  value={sort}
                  onChange={(e) => writeParams({ [PARAM.sort]: e.target.value === "featured" ? null : e.target.value })}
                  className="cursor-pointer rounded-button border border-[color:var(--border-soft)] bg-transparent py-2 pl-3 pr-8 font-mono text-caption uppercase tracking-[0.14em] text-obsidian focus:border-gold focus:outline-none"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Grid */}
          {results.length > 0 ? (
            <div
              className={cn(
                "grid gap-x-6 gap-y-12",
                cols === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 lg:grid-cols-3"
              )}
            >
              {results.map((p) => (
                <ProductCard key={p.id} product={p} onModel={onModel} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="font-display text-h3 text-obsidian">No pieces match.</p>
              <p className="mt-2 font-sans text-body text-carbon">
                Try widening your filters.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-6 font-mono text-caption uppercase tracking-[0.18em] text-gold link-underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[70] bg-obsidian/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-[71] w-[88%] max-w-sm overflow-y-auto bg-ivory px-6 py-8 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: luxe }}
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="overline text-obsidian">Filters</span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close filters"
                  className="font-mono text-caption uppercase tracking-[0.16em] text-carbon hover:text-obsidian"
                >
                  Close ✕
                </button>
              </div>
              {sidebar}
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="mt-10 w-full rounded-button bg-gold py-3 font-mono text-caption uppercase tracking-[0.2em] text-white"
              >
                Show {results.length} {results.length === 1 ? "piece" : "pieces"}
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
