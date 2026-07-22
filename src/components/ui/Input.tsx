import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional icon rendered inside the field, on the left. */
  leadingIcon?: React.ReactNode;
}

/**
 * Text input styled for the dark theme, with an optional leading icon slot
 * (useful for search fields).
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leadingIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leadingIcon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            {leadingIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          className={cn(
            "h-11 w-full rounded-lg border border-border bg-surface-2 px-3.5 text-sm text-foreground",
            "placeholder:text-muted",
            "transition-colors duration-200",
            "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40",
            "disabled:cursor-not-allowed disabled:opacity-50",
            leadingIcon && "pl-10",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = "Input";
