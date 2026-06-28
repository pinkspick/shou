"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  CUTS,
  GOLD_CARATS,
  METALS,
  STONES,
  formatPrice,
  type Carat,
  type Cut,
  type Metal,
  type Product,
  type Stone,
} from "@/lib/products";
import {
  configuredPrice,
  eventPrice,
  isOnEvent,
  type Configuration,
} from "@/lib/pricing";
import { buildWhatsAppUrl } from "@/lib/site";
import { useCart } from "@/components/cart/CartContext";
import { configSummary, type CartConfig } from "@/lib/cart";
import { ShareButtons } from "@/components/social/ShareButtons";

/* Ring sizes 4–12 in half steps. */
const RING_SIZES = Array.from({ length: 17 }, (_, i) => 4 + i * 0.5);

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3l7 2.5v5c0 4.5-3 8-7 10.5-4-2.5-7-6-7-10.5v-5L12 3z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconHeart({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
      <path d="M12 20s-7-4.35-9.33-8.5C1.1 8.7 2.3 5.5 5.4 5.5c1.9 0 3.1 1.1 3.85 2.2C9.9 6.6 11.1 5.5 13 5.5c3.1 0 4.3 3.2 2.73 6C19 15.65 12 20 12 20z" strokeLinejoin="round" />
    </svg>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="overline mb-3 block text-obsidian">{children}</h3>;
}

export function Configurator({ product }: { product: Product }) {
  const defaultCarat: Carat = (GOLD_CARATS as readonly string[]).includes(
    product.carat
  )
    ? product.carat
    : "18K";

  const [metal, setMetal] = useState<Metal>(product.metal);
  const [carat, setCarat] = useState<Carat>(defaultCarat);
  const [stone, setStone] = useState<Stone>(product.stone);
  const [cut, setCut] = useState<Cut>(product.cut);
  const [size, setSize] = useState<number | null>(null);
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem } = useCart();

  const isRing = product.category === "rings";
  const onEvent = isOnEvent(product.popularity);

  const shown: Configuration = {
    metal: product.metal,
    carat: product.carat,
    stone: product.stone,
    cut: product.cut,
  };

  const price = useMemo(
    () => configuredPrice(product.price, shown, { metal, carat, stone, cut }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [product.price, metal, carat, stone, cut]
  );
  const sale = onEvent ? eventPrice(price) : price;

  function handleAddToCart() {
    const config: CartConfig = {
      metal,
      carat: platinum ? undefined : carat,
      stone,
      cut,
      size: isRing ? size : undefined,
    };
    addItem({
      productId: product.id,
      slug: product.slug,
      category: product.category,
      name: product.name,
      descriptor: configSummary(config),
      unitPrice: sale,
      config,
    });
  }

  const consultationUrl = buildWhatsAppUrl(
    `Hello Lumière — I'd love a consultation about the ${product.name} ` +
      `(${metal}, ${carat}, ${stone}, ${cut}${isRing && size ? `, size ${size}` : ""}).`
  );

  const platinum = metal === "Platinum";

  return (
    <div className="flex flex-col gap-8">
      {/* Price + certification */}
      <div>
        <div className="flex items-baseline gap-3">
          <span className="numeric font-mono text-gold" style={{ fontSize: "1.5rem" }}>
            {formatPrice(sale)}
          </span>
          {onEvent && (
            <span className="numeric font-mono text-body text-carbon/60 line-through">
              {formatPrice(price)}
            </span>
          )}
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 text-gold">
          <IconShield />
          <span className="font-mono text-caption uppercase tracking-[0.16em]">
            IGI Certified
          </span>
        </div>
      </div>

      {/* Metal */}
      <section>
        <GroupLabel>
          Metal <span className="text-carbon/60">— {metal}</span>
        </GroupLabel>
        <div className="flex flex-wrap gap-3">
          {METALS.map((m) => {
            const active = metal === m.value;
            return (
              <button
                key={m.value}
                type="button"
                aria-pressed={active}
                aria-label={m.value}
                title={m.value}
                onClick={() => setMetal(m.value)}
                className={cn(
                  "relative h-10 w-10 rounded-full border transition-transform duration-300 ease-luxe hover:scale-105",
                  active
                    ? "border-gold ring-1 ring-gold ring-offset-2 ring-offset-ivory"
                    : "border-rose-gold/60"
                )}
                style={{ backgroundColor: m.hex }}
              />
            );
          })}
        </div>
      </section>

      {/* Gold carat */}
      <section>
        <GroupLabel>
          Gold Carat
          {platinum && <span className="text-carbon/50"> — set in platinum</span>}
        </GroupLabel>
        <div className="flex flex-wrap gap-2">
          {GOLD_CARATS.map((c) => {
            const active = carat === c;
            return (
              <button
                key={c}
                type="button"
                disabled={platinum}
                aria-pressed={active}
                onClick={() => setCarat(c)}
                className={cn(
                  "min-w-[3.5rem] rounded-button border px-4 py-2 font-mono text-caption uppercase tracking-[0.14em] transition-colors",
                  platinum && "cursor-not-allowed opacity-40",
                  active
                    ? "border-obsidian bg-obsidian text-ivory"
                    : "border-rose-gold text-carbon hover:border-obsidian hover:text-obsidian"
                )}
              >
                {c}
              </button>
            );
          })}
        </div>
      </section>

      {/* Stone + Cut */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <section>
          <GroupLabel>Stone</GroupLabel>
          <select
            value={stone}
            onChange={(e) => setStone(e.target.value as Stone)}
            className="w-full cursor-pointer rounded-button border border-[color:var(--border-soft)] bg-transparent py-2.5 pl-3 pr-8 font-sans text-body text-obsidian focus:border-gold focus:outline-none"
          >
            {STONES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </section>
        <section>
          <GroupLabel>Cut</GroupLabel>
          <select
            value={cut}
            onChange={(e) => setCut(e.target.value as Cut)}
            className="w-full cursor-pointer rounded-button border border-[color:var(--border-soft)] bg-transparent py-2.5 pl-3 pr-8 font-sans text-body text-obsidian focus:border-gold focus:outline-none"
          >
            {CUTS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </section>
      </div>

      {/* Ring sizer */}
      {isRing && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="overline block text-obsidian">
              Ring Size{size != null && <span className="text-carbon/60"> — {size}</span>}
            </h3>
            <a
              href={consultationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-caption uppercase tracking-[0.14em] text-gold link-underline"
            >
              Find My Size
            </a>
          </div>
          <div className="flex flex-wrap gap-2">
            {RING_SIZES.map((s) => {
              const active = size === s;
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSize(active ? null : s)}
                  className={cn(
                    "h-10 w-10 rounded-full border font-mono text-caption transition-colors",
                    active
                      ? "border-gold bg-gold text-white"
                      : "border-rose-gold text-carbon hover:border-obsidian hover:text-obsidian"
                  )}
                >
                  {Number.isInteger(s) ? s : s.toFixed(1)}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* CTAs */}
      <div className="mt-2 flex flex-col gap-3">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isRing && size == null}
            className="flex-1 rounded-button bg-obsidian px-6 py-4 font-mono text-caption uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRing && size == null ? "Select a Size" : "Add to Cart"}
          </button>
          <button
            type="button"
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wishlisted}
            onClick={() => setWishlisted((v) => !v)}
            className={cn(
              "flex h-[3.5rem] w-[3.5rem] shrink-0 items-center justify-center rounded-button border transition-colors",
              wishlisted
                ? "border-gold text-gold"
                : "border-obsidian text-obsidian hover:text-gold"
            )}
          >
            <IconHeart filled={wishlisted} />
          </button>
        </div>
        <a
          href={consultationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full rounded-button border border-obsidian px-6 py-4 text-center font-mono text-caption uppercase tracking-[0.2em] text-obsidian transition-colors hover:bg-obsidian hover:text-ivory"
        >
          Book a Consultation
        </a>
      </div>

      {/* Share */}
      <div className="border-t border-[color:var(--border-soft)] pt-6">
        <ShareButtons
          label="Share this piece"
          text={`The ${product.name} from Lumière ✨`}
        />
      </div>
    </div>
  );
}
