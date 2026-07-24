import { useState, type ReactNode } from "react";
import { copyToClipboard } from "../../lib/format";
import { useToast } from "./Toast";
import type { StageState } from "../../lib/types";

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      width="16"
      height="16"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface2">
      <div
        className="h-full rounded-full bg-accent transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

const STAGE_STYLES: Record<StageState, string> = {
  done: "bg-success/15 text-green-300 border-success/30",
  partial: "bg-warn/15 text-amber-300 border-warn/30",
  empty: "bg-surface2 text-muted border-border",
};

export function StatusBadge({ state, label }: { state: StageState; label: string }) {
  return (
    <span className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${STAGE_STYLES[state]}`}>
      {label}
    </span>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="btn-ghost !px-2.5 !py-1 text-xs"
      onClick={async () => {
        try {
          await copyToClipboard(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          toast.error("Could not copy to clipboard");
        }
      }}
    >
      {copied ? "Copied!" : label}
    </button>
  );
}

export function EmptyState({ icon, title, children }: { icon: string; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
      <div className="mb-3 text-4xl">{icon}</div>
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      <p className="max-w-md text-sm text-muted">{children}</p>
    </div>
  );
}
