import { cn } from "@/lib/utils";

export type BadgeVariant = "eco" | "gold" | "neutral" | "obsidian";

const variants: Record<BadgeVariant, string> = {
  // Lab-grown / sustainability claims
  eco: "bg-glacial text-carbon",
  // Highlight / value
  gold: "bg-gold/10 text-gold border border-gold/40",
  // Quiet label
  neutral: "bg-transparent text-carbon border border-rose-gold",
  // Strong
  obsidian: "bg-obsidian text-ivory",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

/** Small status / claim label. e.g. "Carbon-neutral", "Lab-grown", "New". */
export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-button px-2.5 py-1",
        "font-mono text-[0.625rem] uppercase tracking-[0.18em] leading-none",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
