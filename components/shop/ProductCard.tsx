"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";
import { JewelryArt } from "@/components/product/JewelryArt";
import { formatPrice, type Product } from "@/lib/products";

/* Inline icons (stroke = currentColor) */
function IconHeart({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
      <path d="M12 20s-7-4.35-9.33-8.5C1.1 8.7 2.3 5.5 5.4 5.5c1.9 0 3.1 1.1 3.85 2.2C9.9 6.6 11.1 5.5 13 5.5c3.1 0 4.3 3.2 2.73 6C19 15.65 12 20 12 20z" strokeLinejoin="round" transform="translate(0.5 0)" />
    </svg>
  );
}
function IconEye() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

/**
 * Product card. Two stacked placeholder "photos" crossfade on hover
 * (300ms). The `onModel` toggle decides which layer is shown at rest:
 * the lifestyle (on-model) frame or the product-only frame.
 */
export function ProductCard({
  product,
  onModel,
}: {
  product: Product;
  onModel: boolean;
}) {
  const [wishlisted, setWishlisted] = useState(false);
  const href = `/shop/${product.category}/${product.slug}`;

  // Layer A = product-only (champagne), Layer B = on-model (glacial).
  // At rest we show one; on hover we crossfade to the other.
  const restLayer = onModel ? "model" : "product";

  return (
    <div className="group relative">
      {/* Image area (the link target) */}
      <Link
        href={href}
        className="relative block aspect-square overflow-hidden rounded-none bg-white"
        aria-label={product.name}
      >
        {/* Product-only frame — real photograph or crystal-figurine art */}
        <span
          className={cn(
            "absolute inset-0 transition-opacity duration-300 ease-luxe",
            restLayer === "product"
              ? "opacity-100 group-hover:opacity-0"
              : "opacity-0 group-hover:opacity-100"
          )}
        >
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
            />
          ) : (
            <JewelryArt
              product={product}
              className="relative h-full w-full transition-transform duration-700 ease-luxe group-hover:scale-105"
            />
          )}
        </span>

        {/* On-model frame — soft lifestyle stand-in */}
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-glacial transition-opacity duration-300 ease-luxe",
            restLayer === "model"
              ? "opacity-100 group-hover:opacity-0"
              : "opacity-0 group-hover:opacity-100"
          )}
        >
          <span className="font-mono text-caption uppercase tracking-[0.2em] text-carbon/45">
            On Model
          </span>
        </span>

        {/* Lab Grown micro-badge */}
        <Badge variant="eco" className="absolute bottom-3 left-3">
          Lab Grown
        </Badge>
      </Link>

      {/* Carat badge — top-right */}
      <span className="pointer-events-none absolute right-3 top-3 rounded-button bg-obsidian/85 px-2 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ivory">
        {product.carat}
      </span>

      {/* Quick actions — siblings of the Link so clicks don't navigate */}
      <div className="absolute right-3 top-12 flex flex-col gap-2 opacity-0 transition-opacity duration-300 ease-luxe group-hover:opacity-100">
        <button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          onClick={() => setWishlisted((v) => !v)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-colors duration-300",
            wishlisted ? "text-gold" : "text-obsidian hover:text-gold"
          )}
        >
          <IconHeart filled={wishlisted} />
        </button>
        <Link
          href={href}
          aria-label="Quick view"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-obsidian backdrop-blur transition-colors duration-300 hover:text-gold"
        >
          <IconEye />
        </Link>
      </div>

      {/* Meta */}
      <Link href={href} className="mt-4 block">
        <h3 className="font-display text-body-lg text-obsidian">{product.name}</h3>
        <p className="mt-1 font-sans text-body text-carbon">{product.descriptor}</p>
        <p className="numeric mt-2 font-mono text-gold" style={{ fontSize: "1rem" }}>
          {formatPrice(product.price)}
        </p>
      </Link>
    </div>
  );
}
