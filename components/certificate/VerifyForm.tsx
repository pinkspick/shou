"use client";

import { useState } from "react";

/**
 * VerifyForm — enter a certificate ID and jump to the IGI public
 * verification database. Pure client-side; no data leaves the browser
 * until the user follows the external lookup link.
 */
export function VerifyForm() {
  const [id, setId] = useState("");

  const trimmed = id.trim();
  const lookupUrl = trimmed
    ? `https://www.igi.org/verify-your-report/?r=${encodeURIComponent(trimmed)}`
    : null;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookupUrl) {
      window.open(lookupUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-3 sm:flex-row"
    >
      <label htmlFor="cert-id" className="sr-only">
        Certificate ID
      </label>
      <input
        id="cert-id"
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="e.g. LG-1234567890"
        autoComplete="off"
        className="w-full rounded-button border border-[color:var(--border-soft)] bg-transparent px-4 py-3 font-mono text-body uppercase tracking-[0.12em] text-obsidian placeholder:normal-case placeholder:tracking-normal placeholder:text-carbon/40 focus:border-gold focus:outline-none"
      />
      <button
        type="submit"
        disabled={!lookupUrl}
        aria-label="Verify certificate on the IGI database"
        className="shrink-0 rounded-button bg-obsidian px-6 py-3 font-mono text-caption uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        Verify
      </button>
    </form>
  );
}
