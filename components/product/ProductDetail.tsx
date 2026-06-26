import Link from "next/link";
import {
  CATEGORY_LABELS,
  productTagline,
  type Product,
} from "@/lib/products";
import { Gallery } from "./Gallery";
import { Configurator } from "./Configurator";
import { CertificateViewer } from "./CertificateViewer";
import { DetailsAccordion } from "./DetailsAccordion";

export function ProductDetail({ product }: { product: Product }) {
  return (
    <article className="mx-auto max-w-content px-6 pb-24 pt-32 md:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-2 font-mono text-caption uppercase tracking-[0.16em] text-carbon">
          <li>
            <Link href="/shop" className="transition-colors hover:text-obsidian">
              Shop
            </Link>
          </li>
          <li aria-hidden className="text-carbon/40">›</li>
          <li>
            <Link
              href={`/shop/${product.category}`}
              className="transition-colors hover:text-obsidian"
            >
              {CATEGORY_LABELS[product.category]}
            </Link>
          </li>
          <li aria-hidden className="text-carbon/40">›</li>
          <li className="text-obsidian">{product.name}</li>
        </ol>
      </nav>

      {/* Above the fold — gallery (55%) + info/configurator (45%) */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[55fr_45fr] lg:gap-16">
        <div>
          <Gallery product={product} />
        </div>

        <div className="flex flex-col">
          <header className="mb-8">
            <h1 className="font-display text-h1 text-obsidian" style={{ fontSize: "2rem" }}>
              {product.name}
            </h1>
            <p className="mt-2 font-sans text-body italic text-carbon">
              {productTagline(product)}
            </p>
            <p className="mt-1 font-sans text-body text-carbon/80">
              {product.descriptor}
            </p>
          </header>

          <Configurator product={product} />
        </div>
      </div>

      {/* Below the fold */}
      <div className="mt-20 grid grid-cols-1 gap-x-16 gap-y-4 lg:grid-cols-2">
        <CertificateViewer product={product} />
        <div className="lg:pt-0">
          <DetailsAccordion product={product} />
        </div>
      </div>
    </article>
  );
}
