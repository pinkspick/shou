import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your Lumière order — secure, encrypted payment, complimentary gift wrapping, and insured delivery within the United States.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <CheckoutFlow />
    </div>
  );
}
