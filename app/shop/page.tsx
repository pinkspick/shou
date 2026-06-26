import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopBrowser } from "@/components/shop/ShopBrowser";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the Lumière collection of cultivated diamond jewellery.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopBrowser heading="All Jewellery" />
    </Suspense>
  );
}
