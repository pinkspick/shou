"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CutDiagram } from "./CutDiagram";
import { PreviewCard } from "./PreviewCard";
import { customPrice } from "@/lib/pricing";
import {
  CUTS,
  GOLD_CARATS,
  METALS,
  STONES,
  type Carat,
  type Cut,
  type Metal,
  type Stone,
} from "@/lib/products";
import {
  EMPTY_CONFIG,
  OCCASION_OPTIONS,
  PIECE_OPTIONS,
  STONE_HEX,
  STONE_SWATCH,
  configToParams,
  furthestStep,
  paramsToConfig,
  sizeStepFor,
  stepDone,
  type CustomConfig,
  type CustomOccasion,
} from "@/lib/customize";

const STORAGE_KEY = "lumiere:customize";
const luxe = [0.25, 0.46, 0.45, 0.94] as const;

const STEP_LABELS = [
  "Piece",
  "Occasion",
  "Metal",
  "Stone",
  "Cut",
  "Size",
  "Summary",
] as const;

const STEP_HEADINGS: Record<number, { overline: string; title: string; helper: string }> = {
  1: { overline: "Step One", title: "Choose your piece", helper: "Every creation begins with its form." },
  2: { overline: "Step Two", title: "Mark the occasion", helper: "So we may design with intention." },
  3: { overline: "Step Three", title: "Select the metal", helper: "The setting that carries the light." },
  4: { overline: "Step Four", title: "Choose your stone", helper: "Each grown in our atelier, certified to IGI." },
  5: { overline: "Step Five", title: "Select the cut", helper: "How the stone gathers and returns the light." },
  6: { overline: "Step Six", title: "Find your fit", helper: "Tailored to be worn for a lifetime." },
  7: { overline: "Step Seven", title: "Your piece, complete", helper: "Review, share, or make it yours." },
};

export function CustomizeWizard() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [config, setConfig] = useState<CustomConfig>(EMPTY_CONFIG);
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);
  const hydrated = useRef(false);

  /* ---- Hydrate once: URL params take priority, then localStorage ---- */
  useEffect(() => {
    const fromUrl = paramsToConfig(sp);
    const hasUrl = Object.values(fromUrl).some((v) => v !== null);

    let initial = EMPTY_CONFIG;
    if (hasUrl) {
      initial = fromUrl;
    } else if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) initial = { ...EMPTY_CONFIG, ...JSON.parse(raw) };
      } catch {
        /* ignore malformed storage */
      }
    }

    setConfig(initial);
    const reached = furthestStep(initial);
    setStep(reached);
    setMaxStep(reached);
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- Persist to localStorage + URL on change ---- */
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      /* storage may be unavailable */
    }
    const qs = configToParams(config);
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [config, pathname, router]);

  /* ---- Keep maxStep monotonic with progress ---- */
  useEffect(() => {
    setMaxStep((m) => Math.max(m, furthestStep(config), step));
  }, [config, step]);

  const done = stepDone(config);
  const complete = done.every(Boolean);

  const price = useMemo(
    () =>
      customPrice(config.piece, {
        metal: config.metal ?? undefined,
        carat: config.carat ?? undefined,
        stone: config.stone ?? undefined,
        cut: config.cut ?? undefined,
      }),
    [config]
  );

  /* ---- Setters ---- */
  const update = useCallback(
    (patch: Partial<CustomConfig>) => setConfig((c) => ({ ...c, ...patch })),
    []
  );

  const setPiece = (piece: CustomConfig["piece"]) =>
    // Size options are piece-specific — reset size when the piece changes.
    setConfig((c) => ({ ...c, piece, size: c.piece === piece ? c.size : null }));

  const setMetal = (metal: Metal) =>
    setConfig((c) => ({
      ...c,
      metal,
      carat:
        metal === "Platinum"
          ? "Platinum"
          : c.carat && c.carat !== "Platinum"
          ? c.carat
          : "18K",
    }));

  const goTo = (n: number) => {
    if (n >= 1 && n <= 7 && n <= maxStep) setStep(n);
  };
  const next = () => setStep((s) => Math.min(s + 1, 7));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  /* ---- Step-complete gate for the Continue button ---- */
  const canContinue = step === 7 ? true : done[step - 1];

  const onAddToCart = () => {
    // No cart backend yet (Phase 07) — log the build.
    // eslint-disable-next-line no-console
    console.log("Add custom build to cart:", config, "price:", price);
    setAdded(true);
    setTimeout(() => setAdded(false), 2600);
  };

  const onShare = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard?.writeText(window.location.href).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {}
    );
  };

  const reset = () => {
    setConfig(EMPTY_CONFIG);
    setStep(1);
    setMaxStep(1);
  };

  const heading = STEP_HEADINGS[step];

  return (
    <div className="mx-auto max-w-content px-6 pb-24 pt-32 md:px-8">
      {/* Page title */}
      <header className="mx-auto mb-12 max-w-2xl text-center">
        <span className="overline text-carbon/70">The Atelier</span>
        <h1 className="mt-4 font-display text-h1 text-obsidian">Design Your Own</h1>
        <p className="mt-5 font-display text-body-lg leading-relaxed text-carbon">
          A piece made only for you — grown, cut and set to your word. Build it
          step by step; we save your progress as you go.
        </p>
      </header>

      {/* Stepper */}
      <nav aria-label="Configurator steps" className="mb-14">
        <ol className="mx-auto flex max-w-3xl items-center justify-between">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const reachable = n <= maxStep;
            const active = n === step;
            const finished = n < 7 ? done[n - 1] : complete;
            return (
              <li key={label} className="flex flex-1 items-center last:flex-none">
                <button
                  type="button"
                  disabled={!reachable}
                  onClick={() => goTo(n)}
                  className="flex flex-col items-center gap-2"
                  aria-current={active ? "step" : undefined}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border font-mono text-caption transition-colors",
                      active
                        ? "border-gold bg-gold text-white"
                        : finished
                        ? "border-obsidian bg-obsidian text-ivory"
                        : reachable
                        ? "border-carbon/40 text-carbon"
                        : "border-[color:var(--border-soft)] text-carbon/30"
                    )}
                  >
                    {finished && !active ? "✓" : n}
                  </span>
                  <span
                    className={cn(
                      "hidden font-mono text-[0.625rem] uppercase tracking-[0.14em] sm:block",
                      active ? "text-obsidian" : "text-carbon/50"
                    )}
                  >
                    {label}
                  </span>
                </button>
                {n < 7 && (
                  <span
                    className={cn(
                      "mx-2 h-px flex-1 transition-colors",
                      n < step ? "bg-obsidian" : "bg-[color:var(--border-soft)]"
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
        {/* ---- Step panel ---- */}
        <div>
          <header className="mb-8">
            <span className="overline text-gold">{heading.overline}</span>
            <h2 className="mt-2 font-display text-h2 text-obsidian">{heading.title}</h2>
            <p className="mt-2 font-sans text-body text-carbon">{heading.helper}</p>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: luxe }}
            >
              {/* STEP 1 — Piece */}
              {step === 1 && (
                <div className="grid grid-cols-2 gap-4">
                  {PIECE_OPTIONS.map((opt) => {
                    const active = config.piece === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPiece(opt.value)}
                        className={cn(
                          "group flex flex-col items-start gap-3 border p-6 text-left transition-colors",
                          active ? "border-gold bg-champagne/30" : "border-[color:var(--border-soft)] hover:border-obsidian"
                        )}
                      >
                        <span className="text-2xl text-gold">◆</span>
                        <span className="font-display text-h3 text-obsidian">{opt.label}</span>
                        <span className="font-sans text-body text-carbon">{opt.blurb}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* STEP 2 — Occasion */}
              {step === 2 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {OCCASION_OPTIONS.map((opt) => {
                    const active = config.occasion === opt.value;
                    return (
                      <div
                        key={opt.value}
                        className={cn(
                          "flex flex-col gap-3 border p-6 transition-colors",
                          active ? "border-gold bg-champagne/30" : "border-[color:var(--border-soft)] hover:border-obsidian"
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => update({ occasion: opt.value as CustomOccasion })}
                          className="flex flex-col items-start gap-2 text-left"
                        >
                          <span className="font-display text-h3 text-obsidian">{opt.label}</span>
                          <span className="font-sans text-body text-carbon">{opt.blurb}</span>
                        </button>
                        {opt.page && (
                          <Link
                            href={`/occasions/${opt.page}`}
                            className="mt-1 inline-flex w-fit items-center gap-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-gold link-underline"
                          >
                            Explore the {opt.label} edit →
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* STEP 3 — Metal */}
              {step === 3 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {METALS.map((m) => {
                      const active = config.metal === m.value;
                      return (
                        <button
                          key={m.value}
                          type="button"
                          onClick={() => setMetal(m.value)}
                          className={cn(
                            "flex flex-col items-center gap-3 border p-5 transition-colors",
                            active ? "border-gold bg-champagne/30" : "border-[color:var(--border-soft)] hover:border-obsidian"
                          )}
                        >
                          <span
                            className="h-12 w-12 rounded-full border border-black/10"
                            style={{ background: m.hex }}
                          />
                          <span className="text-center font-sans text-body text-obsidian">{m.value}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Gold carat selector — hidden for platinum */}
                  {config.metal && config.metal !== "Platinum" && (
                    <div>
                      <span className="overline text-carbon/60">Gold Purity</span>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {GOLD_CARATS.map((k) => {
                          const active = config.carat === k;
                          return (
                            <button
                              key={k}
                              type="button"
                              onClick={() => update({ carat: k as Carat })}
                              className={cn(
                                "rounded-button border px-5 py-2 font-mono text-caption uppercase tracking-[0.14em] transition-colors",
                                active ? "border-gold bg-gold text-white" : "border-carbon/30 text-carbon hover:border-obsidian"
                              )}
                            >
                              {k}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4 — Stone */}
              {step === 4 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {STONES.map((s) => {
                    const active = config.stone === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => update({ stone: s as Stone })}
                        className={cn(
                          "flex flex-col items-center gap-3 border p-5 transition-colors",
                          active ? "border-gold bg-champagne/30" : "border-[color:var(--border-soft)] hover:border-obsidian"
                        )}
                      >
                        <span
                          className="h-14 w-14 rounded-full border border-black/10 shadow-inner"
                          style={{ background: STONE_SWATCH[s] }}
                        />
                        <span className="text-center font-sans text-body text-obsidian">{s}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* STEP 5 — Cut */}
              {step === 5 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {CUTS.map((c) => {
                    const active = config.cut === c;
                    const fill = config.stone ? STONE_HEX[config.stone] : "#dfe6ec";
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => update({ cut: c as Cut })}
                        className={cn(
                          "flex flex-col items-center gap-2 border p-5 transition-colors",
                          active ? "border-gold bg-champagne/30" : "border-[color:var(--border-soft)] hover:border-obsidian"
                        )}
                      >
                        <CutDiagram cut={c} fill={fill} size={84} />
                        <span className="text-center font-sans text-body text-obsidian">{c}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* STEP 6 — Size */}
              {step === 6 && config.piece && (
                <SizeStep
                  piece={config.piece}
                  value={config.size}
                  onSelect={(v) => update({ size: v })}
                />
              )}
              {step === 6 && !config.piece && (
                <p className="font-sans text-body text-carbon">
                  Choose a piece first to see sizing options.
                </p>
              )}

              {/* STEP 7 — Summary */}
              {step === 7 && (
                <div className="border border-[color:var(--border-soft)] bg-champagne/20 p-8">
                  <p className="font-display text-body-lg leading-relaxed text-obsidian">
                    {complete
                      ? "Your piece is ready. Review the details to the right — add it to your cart, or share the design with someone whose eye you trust."
                      : "Almost there. A few details remain — use the steps above to complete your piece, then return here."}
                  </p>
                  {added && (
                    <p className="mt-6 font-mono text-caption uppercase tracking-[0.16em] text-gold">
                      Added — your bespoke piece is in the cart.
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-6 font-mono text-caption uppercase tracking-[0.16em] text-carbon link-underline hover:text-obsidian"
                  >
                    Start over
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons */}
          <div className="mt-10 flex items-center justify-between">
            <button
              type="button"
              onClick={back}
              disabled={step === 1}
              className={cn(
                "font-mono text-caption uppercase tracking-[0.18em] transition-colors",
                step === 1 ? "cursor-not-allowed text-carbon/30" : "text-carbon hover:text-obsidian"
              )}
            >
              ← Back
            </button>
            {step < 7 && (
              <button
                type="button"
                onClick={next}
                disabled={!canContinue}
                className={cn(
                  "rounded-button px-8 py-3 font-mono text-caption uppercase tracking-[0.2em] transition-colors",
                  canContinue
                    ? "bg-obsidian text-ivory hover:bg-gold"
                    : "cursor-not-allowed bg-champagne text-carbon/40"
                )}
              >
                Continue →
              </button>
            )}
          </div>
        </div>

        {/* ---- Live preview (sticky on desktop) ---- */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <PreviewCard
            config={config}
            price={price}
            complete={complete}
            copied={copied}
            onAddToCart={onAddToCart}
            onShare={onShare}
          />
        </aside>
      </div>
    </div>
  );
}

/* ---- Size sub-step (per-piece options) ---- */
function SizeStep({
  piece,
  value,
  onSelect,
}: {
  piece: NonNullable<CustomConfig["piece"]>;
  value: string | null;
  onSelect: (v: string) => void;
}) {
  const { heading, helper, options } = sizeStepFor(piece);
  return (
    <div>
      <div className="mb-5">
        <h3 className="font-display text-h3 text-obsidian">{heading}</h3>
        <p className="mt-1 font-sans text-body text-carbon">{helper}</p>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onSelect(o.value)}
              className={cn(
                "flex flex-col items-center gap-1 border py-4 transition-colors",
                active ? "border-gold bg-champagne/30" : "border-[color:var(--border-soft)] hover:border-obsidian"
              )}
            >
              <span className="font-display text-body-lg text-obsidian">{o.label}</span>
              {o.note && (
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-carbon/60">
                  {o.note}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
