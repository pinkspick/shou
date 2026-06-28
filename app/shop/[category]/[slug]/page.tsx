import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { JsonLd } from "@/components/seo/JsonLd";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/seo";
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
  const description = `${product.name} — ${product.descriptor}. ${formatPrice(
    product.price
  )}. Lab-grown ${CATEGORY_LABELS[
    product.category as Category
  ].toLowerCase()} by Lumière.`;
  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} · Lumière`,
      description,
      type: "website",
      images: [
        {
          url: `/og/product-${product.category}.jpg`,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  };
}

export default function ProductPage({ params }: { params: Params }) {
  if (!isCategory(params.category)) notFound();
  const product = getProduct(params.category, params.slug);
  if (!product) notFound();

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    {
      name: CATEGORY_LABELS[product.category as Category],
      path: `/shop/${product.category}`,
    },
    {
      name: product.name,
      path: `/shop/${product.category}/${product.slug}`,
    },
  ]);

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <JsonLd data={breadcrumbs} />
      <ProductDetail product={product} />
    </>
  );
}
