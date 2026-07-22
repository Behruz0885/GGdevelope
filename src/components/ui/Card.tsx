import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds an interactive hover state (lift + cyan glow). */
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-white/5 bg-surface",
          interactive &&
            "transition-all duration-200 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-glow",
          className,
        )}
        {...props}
      />
    );
  },
);
Card.displayName = "Card";

export const CardBody = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5", className)} {...props} />
));
CardBody.displayName = "CardBody";

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-heading text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";
