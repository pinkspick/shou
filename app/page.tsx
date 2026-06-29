import { Hero } from "@/components/home/Hero";
import { ServiceStrip } from "@/components/home/ServiceStrip";
import { CountdownBanner } from "@/components/home/CountdownBanner";
import { EarthStory } from "@/components/home/EarthStory";
import { CrystalGallery } from "@/components/home/CrystalGallery";
import { EditorialStrip } from "@/components/home/EditorialStrip";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { CategoryGrid } from "@/components/home/CategoryGrid";

/**
 * Lumière — Homepage.
 * Editorial sequence: Hero → Event countdown → Earth storyline →
 * On-model strip → Category entry points. No cart/checkout yet; all
 * CTAs route to /shop.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <ServiceStrip />
      <CountdownBanner />
      <EarthStory />
      <CrystalGallery />
      <EditorialStrip />
      <InstagramFeed />
      <CategoryGrid />
    </>
  );
}
