import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lumière — Cultivated Diamonds",
    template: "%s · Lumière",
  },
  description:
    "Lumière — Maison of cultivated diamonds. Lab-grown brilliance, born of science, shaped by hand, kind to the earth.",
  metadataBase: new URL("https://lumiere.example"),
  openGraph: {
    title: "Lumière — Cultivated Diamonds",
    description:
      "Lab-grown brilliance, born of science, shaped by hand, kind to the earth.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-screen bg-ivory text-obsidian antialiased">
        <Navigation />
        <main>{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
