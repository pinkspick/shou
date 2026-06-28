"use client";

import { useEffect, useState } from "react";
import { buildWhatsAppUrl } from "@/lib/site";

const STORAGE_KEY = "lumiere-wa-dismissed";

/**
 * Sticky WhatsApp concierge button — bottom-right on every page.
 * Mobile + desktop. A small dismiss control hides it for the session
 * (remembered in sessionStorage so it stays hidden until a new visit).
 */
export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) !== "1") {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const href = buildWhatsAppUrl(
    "Hi, I'm browsing Lumière and have a question.",
  );

  const dismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* sessionStorage unavailable — hide for this render only. */
    }
    setVisible(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group flex items-center gap-3 rounded-button bg-obsidian py-3 pl-3 pr-5 shadow-lg transition-colors hover:bg-gold"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366]">
          <IconWhatsApp />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="font-display text-body text-ivory">Lumière</span>
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ivory/70">
            Chat with us
          </span>
        </span>
      </a>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss chat button"
        className="flex h-6 w-6 items-center justify-center rounded-full border border-[color:var(--border-soft)] bg-white/80 font-mono text-caption text-carbon transition-colors hover:bg-white"
      >
        ×
      </button>
    </div>
  );
}

function IconWhatsApp() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-white"
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.16 0 4.19.84 5.72 2.37a8.05 8.05 0 0 1 2.37 5.74c0 4.47-3.64 8.11-8.12 8.11a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.12.82.83-3.04-.19-.31a8.05 8.05 0 0 1-1.24-4.27c0-4.48 3.64-8.12 8.11-8.12Zm-4.5 4.32c-.21 0-.55.08-.84.39-.29.31-1.1 1.08-1.1 2.62 0 1.55 1.13 3.04 1.29 3.25.16.21 2.22 3.39 5.38 4.62 2.62 1.03 3.16.82 3.73.77.57-.05 1.84-.75 2.1-1.48.26-.73.26-1.35.18-1.48-.08-.13-.29-.21-.6-.37-.31-.16-1.84-.91-2.13-1.01-.29-.1-.5-.16-.7.16-.21.31-.8 1.01-.98 1.22-.18.21-.36.23-.67.08-.31-.16-1.31-.48-2.5-1.54-.92-.82-1.54-1.84-1.72-2.15-.18-.31-.02-.48.13-.63.14-.14.31-.36.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.7-1.7-.96-2.32-.25-.6-.5-.52-.7-.53l-.6-.01Z" />
    </svg>
  );
}
