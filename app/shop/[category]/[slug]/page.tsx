import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import {
  CATEGORY_LABELS,
  PRODUCTS,
  formatPrice,
  getProduct,
  isCategory,
  type Category,
} from "@/lib/products";

type Params = { category: string; slug: string };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ category: p.category, slug: p.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const product = getProduct(params.category, params.slug);
  if (!product) return { title: "Shop" };
  return {
    title: product.name,
    description: `${product.name} — ${product.descriptor}. ${formatPrice(
      product.price
    )}. Lab-grown ${CATEGORY_LABELS[
      product.category as Category
    ].toLowerCase()} by Lumière.`,
  };
}

export default function ProductPage({ params }: { params: Params }) {
  if (!isCategory(params.category)) notFound();
  const product = getProduct(params.category, params.slug);
  if (!product) notFound();

  return <ProductDetail product={product} />;
}
