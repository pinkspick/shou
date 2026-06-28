"use client";

import { useEffect, useState } from "react";
import { INSTAGRAM_URL, SITE_ORIGIN } from "@/lib/site";

type ShareButtonsProps = {
  /** Canonical URL to share. Defaults to the current page after mount. */
  url?: string;
  /** Share caption / body text. */
  text: string;
  /** Optional title for the native share sheet. */
  title?: string;
  /** Image URL — used by the Pinterest pin. */
  media?: string;
  /** Optional eyebrow label rendered above the row. */
  label?: string;
  /** "light" for dark backgrounds (order confirmation), "dark" for ivory. */
  tone?: "dark" | "light";
  className?: string;
};

/**
 * Social share row — native Web Share API where supported, with explicit
 * Pinterest, Instagram and copy-link fallbacks. Works without any backend.
 */
export function ShareButtons({
  url,
  text,
  title = "Lumière",
  media,
  label,
  tone = "dark",
  className = "",
}: ShareButtonsProps) {
  const [pageUrl, setPageUrl] = useState(url ?? SITE_ORIGIN);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!url && typeof window !== "undefined") {
      setPageUrl(window.location.href);
    }
    setCanNativeShare(
      typeof navigator !== "undefined" && typeof navigator.share === "function",
    );
  }, [url]);

  const flash = (msg: string) => {
    setToast(msg);
    window.clearTimeout((flash as unknown as { t?: number }).t);
    (flash as unknown as { t?: number }).t = window.setTimeout(
      () => setToast(null),
      2200,
    );
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      flash("Link copied");
    } catch {
      flash("Copy failed — long-press to copy");
    }
  };

  const nativeShare = async () => {
    const nav = navigator as Navigator & {
      share?: (d: ShareData) => Promise<void>;
    };
    if (nav.share) {
      try {
        await nav.share({ title, text, url: pageUrl });
      } catch {
        /* user dismissed — no-op */
      }
    } else {
      copy();
    }
  };

  const shareInstagram = async () => {
    const nav = navigator as Navigator & {
      share?: (d: ShareData) => Promise<void>;
    };
    // Instagram has no web share intent — use the native sheet on mobile,
    // otherwise copy the caption and open Instagram so it can be pasted.
    if (nav.share) {
      try {
        await nav.share({ title, text: `${text} ${pageUrl}` });
        return;
      } catch {
        /* fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${pageUrl}`);
      flash("Caption copied — paste into Instagram");
    } catch {
      flash("Open Instagram to share");
    }
    window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer");
  };

  const pinterestUrl =
    "https://pinterest.com/pin/create/button/" +
    `?url=${encodeURIComponent(pageUrl)}` +
    `&description=${encodeURIComponent(text)}` +
    (media ? `&media=${encodeURIComponent(media)}` : "");

  const base =
    tone === "light"
      ? "border-ivory/25 text-ivory hover:border-gold hover:text-gold"
      : "border-[color:var(--border-soft)] text-obsidian hover:border-gold hover:text-gold";
  const labelTone = tone === "light" ? "text-ivory/60" : "text-carbon/60";

  const btn =
    "flex h-11 w-11 items-center justify-center rounded-full border transition-colors " +
    base;

  return (
    <div className={className}>
      {label && (
        <span
          className={`mb-3 block font-mono text-caption uppercase tracking-[0.18em] ${labelTone}`}
        >
          {label}
        </span>
      )}
      <div className="flex items-center gap-3">
        {canNativeShare && (
          <button
            type="button"
            onClick={nativeShare}
            aria-label="Share"
            title="Share"
            className={btn}
          >
            <IconShare />
          </button>
        )}
        <button
          type="button"
          onClick={shareInstagram}
          aria-label="Share to Instagram"
          title="Share to Instagram"
          className={btn}
        >
          <IconInstagram />
        </button>
        <a
          href={pinterestUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Save to Pinterest"
          title="Save to Pinterest"
          className={btn}
        >
          <IconPinterest />
        </a>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy link"
          title="Copy link"
          className={btn}
        >
          <IconLink />
        </button>
        {toast && (
          <span
            role="status"
            className={`font-mono text-caption ${tone === "light" ? "text-ivory/80" : "text-carbon"}`}
          >
            {toast}
          </span>
        )}
      </div>
    </div>
  );
}

/* ---- icons ---- */
function IconShare() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 10.8l7.6-4.3M8.2 13.2l7.6 4.3" strokeLinecap="round" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconPinterest() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.5 2.2-.8 3.4-.2.9.5 1.7 1.5 1.7 1.8 0 3-2.3 3-5 0-2-1.4-3.6-3.9-3.6a4.4 4.4 0 0 0-4.6 4.4c0 .9.3 1.5.7 2 .1.2.1.3.1.5l-.2.9c0 .3-.2.4-.5.2-1.3-.5-1.9-2-1.9-3.6 0-2.7 2.2-5.9 6.7-5.9 3.6 0 5.9 2.6 5.9 5.3 0 3.7-2 6.4-5 6.4-1 0-2-.5-2.3-1.2l-.6 2.5c-.2.8-.7 1.7-1.1 2.3A10 10 0 1 0 12 2Z" />
    </svg>
  );
}
function IconLink() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M10 14a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 10a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1.5-1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
