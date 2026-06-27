import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackForm } from "@/components/orders/TrackForm";

export const metadata: Metadata = {
  title: "Track Your Order",
  description:
    "Enter your Lumière order number to follow your piece from our atelier to your hands — hand-set, certified, and delivered insured.",
  robots: { index: false, follow: false },
};

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <Suspense fallback={<div className="min-h-screen" />}>
        <TrackForm />
      </Suspense>
    </div>
  );
}
