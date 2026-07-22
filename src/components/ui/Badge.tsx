import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "accent"
  | "secondary"
  | "outline"
  | "success"
  | "warning"
  | "danger";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-surface-lighter text-foreground-muted border border-white/5",
  accent: "bg-accent/10 text-accent border border-accent/30",
  secondary: "bg-secondary/10 text-secondary-hover border border-secondary/30",
  outline: "bg-transparent text-foreground-muted border border-white/15",
  success: "bg-success/10 text-success border border-success/30",
  warning: "bg-warning/10 text-warning border border-warning/30",
  danger: "bg-danger/10 text-danger border border-danger/30",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
