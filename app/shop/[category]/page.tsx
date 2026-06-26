import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopBrowser } from "@/components/shop/ShopBrowser";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  isCategory,
  type Category,
} from "@/lib/products";

type Params = { category: string };

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.value }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  if (!isCategory(params.category)) return { title: "Shop" };
  return {
    title: CATEGORY_LABELS[params.category as Category],
    description: `Lumière ${CATEGORY_LABELS[params.category as Category]} — cultivated diamond jewellery.`,
  };
}

export default function CategoryPage({ params }: { params: Params }) {
  if (!isCategory(params.category)) notFound();
  const category = params.category as Category;

  return (
    <Suspense fallback={null}>
      <ShopBrowser routeCategory={category} heading={CATEGORY_LABELS[category]} />
    </Suspense>
  );
}
