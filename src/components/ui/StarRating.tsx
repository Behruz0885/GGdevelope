"use client";

import { useState } from "react";
import { cn, clamp, formatCompactNumber } from "@/lib/utils";

export type StarRatingSize = "sm" | "md" | "lg";

export interface StarRatingProps {
  /** Current rating value, 0..max. */
  value: number;
  max?: number;
  size?: StarRatingSize;
  /** Show the numeric value next to the stars. */
  showValue?: boolean;
  /** Optional number of ratings, shown as a compact count e.g. "(2.8K)". */
  count?: number;
  /** Allow the user to click/hover to pick a rating. */
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const sizePx: Record<StarRatingSize, number> = { sm: 14, md: 18, lg: 22 };
const valueTextSize: Record<StarRatingSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

function StarGlyph({ px }: { px: number }) {
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="block"
    >
      <path d="M12 2l2.9 6.26 6.9.6-5.2 4.52 1.56 6.74L12 17.77 5.84 20.12 7.4 13.38 2.2 8.86l6.9-.6L12 2z" />
    </svg>
  );
}

export function StarRating({
  value,
  max = 5,
  size = "md",
  showValue = false,
  count,
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const px = sizePx[size];
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = clamp(hoverValue ?? value, 0, max);

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div
        className="inline-flex items-center gap-0.5"
        role={interactive ? "slider" : "img"}
        aria-label={`Rating: ${value} out of ${max}`}
        aria-valuenow={interactive ? value : undefined}
        aria-valuemin={interactive ? 0 : undefined}
        aria-valuemax={interactive ? max : undefined}
        onMouseLeave={interactive ? () => setHoverValue(null) : undefined}
      >
        {Array.from({ length: max }).map((_, index) => {
          const fraction = clamp(displayValue - index, 0, 1);
          const star = (
            <span
              className="relative inline-block"
              style={{ width: px, height: px }}
            >
              <span className="text-white/15">
                <StarGlyph px={px} />
              </span>
              <span
                className="absolute inset-0 overflow-hidden text-star"
                style={{ width: `${fraction * 100}%` }}
              >
                <StarGlyph px={px} />
              </span>
            </span>
          );

          if (!interactive) {
            return <span key={index}>{star}</span>;
          }

          return (
            <button
              key={index}
              type="button"
              className="cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={`Rate ${index + 1} out of ${max}`}
              onMouseEnter={() => setHoverValue(index + 1)}
              onClick={() => onChange?.(index + 1)}
            >
              {star}
            </button>
          );
        })}
      </div>

      {showValue && (
        <span
          className={cn(
            "font-medium text-foreground-muted",
            valueTextSize[size],
          )}
        >
          {value.toFixed(1)}
        </span>
      )}
      {typeof count === "number" && (
        <span className={cn("text-foreground-subtle", valueTextSize[size])}>
          ({formatCompactNumber(count)})
        </span>
      )}
    </div>
  );
}
