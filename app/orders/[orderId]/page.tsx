import type { Metadata } from "next";
import { OrderStatusClient } from "@/components/orders/OrderStatusClient";

export const metadata: Metadata = {
  title: "Order Status",
  description:
    "Follow your Lumière order through production, certification and insured delivery — with lifetime service whenever your piece needs it.",
  robots: { index: false, follow: false },
};

export default function OrderStatusPage({
  params,
}: {
  params: { orderId: string };
}) {
  return (
    <div className="min-h-screen bg-ivory">
      <OrderStatusClient orderId={params.orderId} />
    </div>
  );
}
