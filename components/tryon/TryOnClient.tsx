"use client";

import dynamic from "next/dynamic";

/**
 * Loads the camera/ML experience only in the browser (ssr: false). The
 * experience touches `navigator`, `document` and WebGL on mount, so it must
 * never render on the server.
 */
const TryOnExperience = dynamic(
  () => import("./TryOnExperience").then((m) => m.TryOnExperience),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-obsidian text-ivory">
        <span className="animate-pulse text-4xl text-gold">◆</span>
        <span className="font-mono text-caption uppercase tracking-[0.2em] text-ivory/70">
          Loading the mirror…
        </span>
      </div>
    ),
  }
);

export function TryOnClient() {
  return <TryOnExperience />;
}
