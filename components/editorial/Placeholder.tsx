import { cn } from "@/lib/utils";

/**
 * Editorial image placeholder. Warm champagne field with a quiet wordmark —
 * stands in for photography until real assets are wired. Server-safe (no state).
 */
export function Placeholder({
  label = "Lumière",
  ratio = "aspect-[4/3]",
  className,
  tone = "champagne",
}: {
  label?: string;
  /** Tailwind aspect-ratio class, e.g. "aspect-[16/9]". */
  ratio?: string;
  className?: string;
  tone?: "champagne" | "glacial" | "obsidian";
}) {
  const toneClass =
    tone === "glacial"
      ? "bg-glacial text-carbon/45"
      : tone === "obsidian"
        ? "bg-obsidian text-ivory/40"
        : "bg-champagne text-carbon/40";
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        ratio,
        toneClass,
        className,
      )}
    >
      <span className="absolute inset-0 flex items-center justify-center px-4 text-center font-mono text-caption uppercase tracking-[0.3em]">
        {label}
      </span>
    </div>
  );
}
