"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/cart/CartContext";

const NAV_LINKS = [
  { label: "Collection", href: "/shop" },
  { label: "Try-On", href: "/try-on" },
  { label: "Customize", href: "/customize" },
  { label: "The Science", href: "/science" },
  { label: "About", href: "/about" },
  { label: "Service", href: "/service" },
];

/* Language only — we ship a single worldwide storefront (no regional domains). */
const LANGUAGES = [
  { code: "EN", label: "English" },
  { code: "FR", label: "Français" },
  { code: "IT", label: "Italiano" },
  { code: "DE", label: "Deutsch" },
  { code: "ES", label: "Español" },
  { code: "ZH", label: "中文" },
  { code: "JA", label: "日本語" },
  { code: "AR", label: "العربية" },
];

const luxe = [0.25, 0.46, 0.45, 0.94] as const;

function LanguageMenu() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("EN");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 font-mono text-caption uppercase tracking-[0.18em] text-carbon transition-colors hover:text-obsidian"
      >
        {lang}
        <svg
          viewBox="0 0 24 24"
          className="h-3 w-3 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: luxe }}
            className="absolute right-0 top-full z-50 mt-3 w-48 border border-[color:var(--border-soft)] bg-ivory py-2 shadow-[0_18px_40px_-24px_rgba(26,26,24,0.4)]"
          >
            <li className="px-4 pb-2 pt-1">
              <span className="font-mono text-[0.5rem] uppercase tracking-[0.2em] text-carbon/50">
                Language
              </span>
            </li>
            {LANGUAGES.map((l) => {
              const active = l.code === lang;
              return (
                <li key={l.code} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => {
                      setLang(l.code);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-2 text-left font-sans text-body transition-colors",
                      active ? "text-gold" : "text-carbon hover:bg-champagne/40 hover:text-obsidian"
                    )}
                  >
                    {l.label}
                    <span className="font-mono text-[0.625rem] tracking-[0.16em] text-carbon/50">
                      {l.code}
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function IconAccount() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.1" />
      <path d="M3 15.5c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}
function IconBag() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M4 5.5h10l-.8 9.5H4.8L4 5.5Z" stroke="currentColor" strokeWidth="1.1" />
      <path d="M6.5 5.5a2.5 2.5 0 0 1 5 0" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count, openDrawer } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when the mobile overlay is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-400 ease-luxe",
        scrolled
          ? "bg-ivory/90 backdrop-blur-md border-b border-[color:var(--divider)] py-4"
          : "bg-transparent border-b border-transparent py-6"
      )}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-6 md:px-8">
        {/* Logo — left */}
        <Link href="/" className="flex items-baseline gap-2 text-obsidian" aria-label="Lumière home">
          <span className="text-gold leading-none">◆</span>
          <span className="font-display text-h3 tracking-[0.3em]">LUMIÈRE</span>
        </Link>

        {/* Links — center (desktop) */}
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="link-underline font-mono text-caption uppercase tracking-[0.18em] text-carbon hover:text-obsidian"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Language + account + cart — right */}
        <div className="flex items-center gap-5 text-obsidian">
          <LanguageMenu />
          <Link href="/account" aria-label="Account" className="hidden transition-colors duration-400 hover:text-gold sm:block">
            <IconAccount />
          </Link>
          <button
            type="button"
            onClick={openDrawer}
            aria-label={`Cart${count ? ` — ${count} item${count > 1 ? "s" : ""}` : ""}`}
            className="relative transition-colors duration-400 hover:text-gold"
          >
            <IconBag />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-gold font-mono text-[0.5rem] text-white">
                {count}
              </span>
            )}
          </button>
          {/* Hamburger — mobile */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="flex flex-col gap-[5px] lg:hidden"
          >
            <span className="h-px w-6 bg-obsidian" />
            <span className="h-px w-6 bg-obsidian" />
            <span className="h-px w-6 bg-obsidian" />
          </button>
        </div>
      </div>

      {/* Full-screen mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-ivory lg:hidden"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="flex items-center justify-between px-6 py-6">
              <span className="font-display text-h3 tracking-[0.3em] text-obsidian">
                <span className="text-gold">◆</span> LUMIÈRE
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="text-2xl leading-none text-obsidian"
              >
                ×
              </button>
            </div>
            <nav className="flex flex-1 flex-col items-center justify-center gap-7">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-h2 text-obsidian hover:text-gold"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center justify-center gap-8 pb-12 font-mono text-caption uppercase tracking-[0.18em] text-carbon">
              <Link href="/account" onClick={() => setOpen(false)}>Account</Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openDrawer();
                }}
                className="uppercase tracking-[0.18em]"
              >
                Cart ({count})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
