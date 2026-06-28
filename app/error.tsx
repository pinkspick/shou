"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-segment error boundary — branded 500 within the normal layout
 * (keeps the nav + footer). global-error.tsx handles failures of the
 * root layout itself.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to the server logs / monitoring in real deployments.
    console.error("[lumiere] route error", error);
  }, [error]);

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center bg-ivory px-6 text-center">
      <span className="text-3xl text-gold" aria-hidden>
        ◆
      </span>
      <p className="numeric mt-6 font-mono text-caption uppercase tracking-[0.3em] text-carbon/60">
        Error 500
      </p>
      <h1 className="mt-4 max-w-2xl font-display text-h1 text-obsidian">
        A flaw in the setting.
      </h1>
      <p className="mx-auto mt-5 max-w-md font-sans text-body-lg text-carbon">
        Something went wrong on our end. Our atelier has been notified — please
        try again, or return home while we polish things out.
      </p>
      <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="rounded-button bg-obsidian px-7 py-4 font-mono text-caption uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="link-underline font-mono text-caption uppercase tracking-[0.2em] text-carbon"
        >
          Return Home →
        </Link>
      </div>
    </main>
  );
}
