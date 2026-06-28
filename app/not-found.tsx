import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center bg-ivory px-6 text-center">
      <span className="text-3xl text-gold" aria-hidden>
        ◆
      </span>
      <p className="numeric mt-6 font-mono text-caption uppercase tracking-[0.3em] text-carbon/60">
        Error 404
      </p>
      <h1 className="mt-4 max-w-2xl font-display text-h1 text-obsidian">
        This light has gone dark.
      </h1>
      <p className="mx-auto mt-5 max-w-md font-sans text-body-lg text-carbon">
        The page you&rsquo;re looking for has moved or never existed. Let&rsquo;s
        guide you back to something brilliant.
      </p>
      <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="/"
          className="rounded-button bg-obsidian px-7 py-4 font-mono text-caption uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Return Home
        </Link>
        <Link
          href="/shop"
          className="link-underline font-mono text-caption uppercase tracking-[0.2em] text-carbon"
        >
          Explore the collection →
        </Link>
      </div>
    </main>
  );
}
