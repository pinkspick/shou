"use client";

import { cn } from "@/lib/utils";

export interface TagProps extends React.HTMLAttributes<HTMLButtonElement> {
  /** Renders the tag in a selected (active) state. */
  active?: boolean;
  /** Shows a remove affordance and fires onRemove when clicked. */
  onRemove?: () => void;
}

/**
 * Interactive filter chip — used for occasion / category / customization choices.
 * Clean, bright, with a hairline border that warms to gold when active.
 */
export function Tag({
  className,
  active = false,
  onRemove,
  children,
  ...props
}: TagProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-2 rounded-button px-4 py-2",
        "font-sans text-caption tracking-[0.04em] whitespace-nowrap",
        "border transition-all duration-400 ease-luxe",
        active
          ? "border-obsidian bg-obsidian text-ivory"
          : "border-rose-gold text-carbon hover:border-gold hover:text-obsidian",
        className
      )}
      {...props}
    >
      {children}
      {onRemove && (
        <span
          role="button"
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 text-[0.875rem] leading-none opacity-60 hover:opacity-100"
        >
          ×
        </span>
      )}
    </button>
  );
}
