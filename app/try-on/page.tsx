import type { Metadata } from "next";
import { TryOnClient } from "@/components/tryon/TryOnClient";

export const metadata: Metadata = {
  title: "Virtual Try-On",
  description:
    "See a Lumière ring on your own hand — a live, augmented try-on powered by your camera. Switch metals in real time, capture the look and share it. Works on iOS Safari 16+ and Android Chrome 110+.",
};

export default function TryOnPage() {
  return <TryOnClient />;
}
