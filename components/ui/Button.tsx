import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "outline" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center font-mono uppercase tracking-[0.2em] " +
  "rounded-button transition-all duration-400 ease-luxe select-none " +
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory " +
  "disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  // Gold CTA — pricing / primary actions
  primary: "bg-gold text-white hover:bg-obsidian",
  // Bordered — secondary
  outline: "border border-obsidian text-obsidian hover:bg-obsidian hover:text-ivory",
  // Quiet — sits on surfaces
  ghost: "text-obsidian hover:text-gold",
  // Inline link with gold underline sweep
  link: "text-obsidian link-underline px-0 py-0 tracking-[0.16em] hover:text-obsidian",
};

const sizes: Record<ButtonSize, string> = {
  sm: "text-caption px-4 py-2",
  md: "text-caption px-6 py-3",
  lg: "text-body px-8 py-4",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    const sizeClass = variant === "link" ? "" : sizes[size];
    return (
      <button
        ref={ref}
        type={type}
        className={cn(base, variants[variant], sizeClass, className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
