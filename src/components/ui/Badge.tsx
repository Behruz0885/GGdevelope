import { cn } from "@/lib/utils";

export type BadgeVariant = "accent" | "secondary" | "neutral" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  accent: "bg-accent/15 text-accent border border-accent/30",
  secondary: "bg-secondary/15 text-secondary-soft border border-secondary/30",
  neutral: "bg-surface-2 text-muted border border-border",
  outline: "bg-transparent text-foreground border border-border",
};

/**
 * Small pill for labels: categories, tags, and status indicators.
 */
export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
