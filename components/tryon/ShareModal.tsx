"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { tryOnCaption, tryOnShareText } from "@/lib/tryOn";

const luxe = [0.25, 0.46, 0.45, 0.94] as const;

async function dataUrlToFile(url: string, filename: string): Promise<File> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || "image/png" });
}

/**
 * Post-capture share sheet — preview, pre-written caption, and three actions:
 * Instagram Stories (native share / save), Copy Link, Download. Uses the Web
 * Share API with files where available, otherwise falls back to download.
 */
export function ShareModal({
  image,
  productName,
  productHref,
  onClose,
}: {
  image: string;
  productName: string;
  productHref: string;
  onClose: () => void;
}) {
  const caption = useMemo(() => tryOnCaption(productName), [productName]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const absoluteHref =
    typeof window !== "undefined"
      ? new URL(productHref, window.location.origin).toString()
      : productHref;

  const fileName = `lumiere-${productName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;

  const download = () => {
    const a = document.createElement("a");
    a.href = image;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    flash("Image downloaded");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${caption}\n${absoluteHref}`);
      flash("Caption + link copied");
    } catch {
      flash("Copy failed — long-press the image instead");
    }
  };

  const nativeShare = async () => {
    const nav = navigator as Navigator & {
      canShare?: (data?: ShareData) => boolean;
    };
    try {
      const file = await dataUrlToFile(image, fileName);
      const data: ShareData = {
        files: [file],
        text: `${tryOnShareText(productName)} — ${caption}`,
        title: "Lumière Virtual Try-On",
      };
      if (nav.canShare && nav.canShare(data)) {
        await nav.share(data);
        return;
      }
      // No file-share support → save the image so it can be added manually.
      download();
      flash("Saved — open Instagram and add it to your Story");
    } catch {
      /* user dismissed the share sheet — no-op */
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[120] flex items-end justify-center bg-obsidian/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-md overflow-hidden rounded-t-2xl bg-ivory sm:rounded-2xl"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.4, ease: luxe }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5">
            <span className="overline text-carbon/70">Share Your Try-On</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-xl leading-none text-carbon hover:text-obsidian"
            >
              ×
            </button>
          </div>

          {/* Preview */}
          <div className="px-6 pt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={`Virtual try-on of ${productName}`}
              className="max-h-[42vh] w-full rounded-lg object-cover"
            />
          </div>

          {/* Caption */}
          <div className="px-6 pt-4">
            <p className="rounded-lg bg-champagne/40 p-4 font-sans text-body text-carbon">
              {caption}
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2 px-6 pb-7 pt-5">
            <button
              type="button"
              onClick={nativeShare}
              className="flex flex-col items-center gap-2 rounded-lg bg-obsidian py-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-gold"
            >
              <IconInstagram />
              Stories
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="flex flex-col items-center gap-2 rounded-lg border border-obsidian py-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-obsidian transition-colors hover:border-gold hover:text-gold"
            >
              <IconLink />
              Copy Link
            </button>
            <button
              type="button"
              onClick={download}
              className="flex flex-col items-center gap-2 rounded-lg border border-obsidian py-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-obsidian transition-colors hover:border-gold hover:text-gold"
            >
              <IconDownload />
              Download
            </button>
          </div>

          <AnimatePresence>
            {toast && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="pb-5 text-center font-mono text-caption uppercase tracking-[0.16em] text-gold"
              >
                {toast}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function IconInstagram() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconLink() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M9 15l6-6" strokeLinecap="round" />
      <path d="M11 6l1-1a4 4 0 0 1 6 6l-1 1" strokeLinecap="round" />
      <path d="M13 18l-1 1a4 4 0 0 1-6-6l1-1" strokeLinecap="round" />
    </svg>
  );
}
function IconDownload() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 3v12" strokeLinecap="round" />
      <path d="M7 11l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 21h14" strokeLinecap="round" />
    </svg>
  );
}
