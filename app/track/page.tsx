import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackClient } from "@/components/checkout/TrackClient";

export const metadata: Metadata = {
  title: "Track Your Order",
  description:
    "Follow your Lumière order from our atelier to your hands — hand-set, wrapped in the signature box, and delivered insured.",
  robots: { index: false, follow: false },
};

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <Suspense fallback={<div className="min-h-screen" />}>
        <TrackClient />
      </Suspense>
    </div>
  );
}
