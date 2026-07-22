"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface StarRatingProps {
  /** Current rating value, 0 to `max`. Supports fractional values for display. */
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  /** Show the numeric value next to the stars. */
  showValue?: boolean;
  /** Optional review count rendered in parentheses. */
  count?: number;
  /**
   * When provided, the component becomes interactive and calls back with the
   * selected whole-star value (1..max).
   */
  onChange?: (value: number) => void;
  className?: string;
}

const sizePx: Record<NonNullable<StarRatingProps["size"]>, number> = {
  sm: 14,
  md: 18,
  lg: 24,
};

function Star({ fill, px }: { fill: number; px: number }) {
  // `fill` is 0..1 — the fraction of this star that should be colored.
  const clamped = Math.max(0, Math.min(1, fill));
  return (
    <span
      className="relative inline-block"
      style={{ width: px, height: px }}
      aria-hidden="true"
    >
      <StarSvg px={px} className="absolute inset-0 text-border" />
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${clamped * 100}%` }}
      >
        <StarSvg px={px} className="text-accent" />
      </span>
    </span>
  );
}

function StarSvg({ px, className }: { px: number; className?: string }) {
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 17.27l5.18 3.12-1.37-5.9 4.58-3.97-6.03-.52L12 3.5 9.64 10l-6.03.52 4.58 3.97-1.37 5.9L12 17.27z" />
    </svg>
  );
}

/**
 * Displays a star rating. Read-only by default (with fractional fill), or
 * interactive when an `onChange` handler is supplied.
 */
export function StarRating({
  value,
  max = 5,
  size = "md",
  showValue = false,
  count,
  onChange,
  className,
}: StarRatingProps) {
  const px = sizePx[size];
  const [hover, setHover] = useState<number | null>(null);
  const interactive = typeof onChange === "function";
  const displayValue = interactive && hover !== null ? hover : value;

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div
        className="inline-flex items-center gap-0.5"
        role={interactive ? "radiogroup" : "img"}
        aria-label={
          interactive ? "Rate this game" : `Rated ${value} out of ${max}`
        }
      >
        {Array.from({ length: max }).map((_, i) => {
          const fill = displayValue - i;
          if (!interactive) {
            return <Star key={i} fill={fill} px={px} />;
          }
          return (
            <button
              key={i}
              type="button"
              className="rounded transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              onMouseEnter={() => setHover(i + 1)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onChange?.(i + 1)}
              aria-label={`${i + 1} star${i === 0 ? "" : "s"}`}
            >
              <Star fill={fill} px={px} />
            </button>
          );
        })}
      </div>
      {showValue ? (
        <span className="text-sm font-medium text-foreground">
          {value.toFixed(1)}
        </span>
      ) : null}
      {typeof count === "number" ? (
        <span className="text-xs text-muted">({count.toLocaleString()})</span>
      ) : null}
    </div>
  );
}
