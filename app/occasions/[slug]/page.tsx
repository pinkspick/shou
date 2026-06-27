import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OccasionView } from "@/components/occasion/OccasionView";
import {
  OCCASION_SLUGS,
  getOccasionPage,
} from "@/lib/occasions";

type Params = { slug: string };

export function generateStaticParams() {
  return OCCASION_SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const page = getOccasionPage(params.slug);
  if (!page) return { title: "Occasions" };
  const title = page.headline.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
  return {
    title: `${page.overline}`,
    description: `${title} — ${page.poem.split(".")[0]}. Lab-grown diamond jewellery by Lumière.`,
  };
}

export default function OccasionPage({ params }: { params: Params }) {
  const page = getOccasionPage(params.slug);
  if (!page) notFound();

  return <OccasionView page={page} />;
}
