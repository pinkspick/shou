import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomizeWizard } from "@/components/customize/CustomizeWizard";

export const metadata: Metadata = {
  title: "Design Your Own",
  description:
    "Build a bespoke Lumière piece step by step — choose the form, metal, stone, cut and fit. Lab-grown diamonds, certified to IGI, made only for you.",
};

export default function CustomizePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CustomizeWizard />
    </Suspense>
  );
}
