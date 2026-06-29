import Link from "next/link";
import { buildWhatsAppUrl, INSTAGRAM_URL } from "@/lib/site";
import { CrystalMotif } from "@/components/product/GemArt";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "Engagement Rings", href: "/shop/rings" },
      { label: "Necklaces", href: "/shop/necklaces" },
      { label: "Earrings", href: "/shop/earrings" },
      { label: "Bracelets", href: "/shop/bracelets" },
      { label: "Shop by Occasion", href: "/shop#occasions" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Craftsmanship", href: "/craftsmanship" },
      { label: "Materials & Science", href: "/materials" },
      { label: "Our Packaging", href: "/packaging" },
    ],
  },
  {
    title: "Service",
    links: [
      { label: "Lifetime Care", href: "/lifetime-service" },
      { label: "Track My Order", href: "/track" },
      { label: "Book an Appointment", href: "/book-appointment" },
      { label: "Certification", href: "/certificate" },
      { label: "Shipping & Returns", href: "/shipping" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Instagram", href: INSTAGRAM_URL },
      { label: "TikTok", href: "https://tiktok.com" },
      { label: "Pinterest", href: "https://pinterest.com" },
      { label: "YouTube", href: "https://youtube.com" },
      {
        label: "WhatsApp",
        href: buildWhatsAppUrl("Hi, I'm browsing Lumière and have a question."),
      },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-ivory text-carbon">
      {/* Crystal art — decorative house signature */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <CrystalMotif
          motif="clover"
          stone="Pink Diamond"
          uid="footer-clover"
          className="absolute -right-16 top-6 h-64 w-64 opacity-30 md:h-80 md:w-80"
        />
        <CrystalMotif
          motif="lotus"
          stone="Sapphire"
          uid="footer-lotus"
          className="absolute -left-20 bottom-0 h-60 w-60 opacity-25"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-content px-6 pb-12 pt-24 md:px-8">
        {/* Brand line */}
        <div className="mb-12 flex flex-col gap-2">
          <span className="font-display text-h2 tracking-[0.3em] text-obsidian">
            <span className="text-gold">◆</span> LUMIÈRE
          </span>
          <p className="max-w-sm font-display text-body-lg italic text-carbon">
            Cultivated diamonds for the conscious century — born of science,
            shaped by hand, kind to the earth.
          </p>
        </div>

        <div className="divider-gold mb-12" />

        {/* Four columns */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-6 font-mono text-caption uppercase tracking-[0.2em] text-obsidian">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => {
                  const external = l.href.startsWith("http");
                  return (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="link-underline text-body text-carbon hover:text-obsidian"
                      >
                        {l.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider-gold my-12" />

        {/* Base */}
        <div className="flex flex-col items-center justify-between gap-4 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-carbon md:flex-row">
          <span>© {new Date().getFullYear()} Lumière Maison · Traceable to the atom</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-obsidian">Privacy</Link>
            <Link href="/terms" className="hover:text-obsidian">Terms</Link>
            <Link href="/cookies" className="hover:text-obsidian">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
