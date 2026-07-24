import { storageUrl } from "../../../lib/api";
import { Spinner } from "../../ui/misc";
import type { AspectRatio, Frame } from "../../../lib/types";

export function FrameGrid({
  frames,
  aspectRatio,
  bust,
  onRegenerate,
  regeneratingIndex,
}: {
  frames: Frame[];
  aspectRatio: AspectRatio;
  bust: string;
  onRegenerate: (index: number) => void;
  regeneratingIndex: number | null;
}) {
  const cellAspect = aspectRatio === "9:16" ? "aspect-[9/16]" : "aspect-video";

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {frames.map((frame) => {
        const busy = frame.status === "generating" || regeneratingIndex === frame.index;
        return (
          <div key={frame.index} className="group relative">
            <div
              className={`relative ${cellAspect} overflow-hidden rounded-lg border border-border bg-surface2`}
            >
              {frame.image ? (
                <img
                  src={`${storageUrl(frame.image)}?v=${encodeURIComponent(bust)}`}
                  alt={`Frame ${frame.index}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-center text-[11px] text-muted">
                  {frame.status === "error" ? (
                    <span className="px-2 text-red-300">Error</span>
                  ) : busy ? (
                    <Spinner className="text-accent" />
                  ) : (
                    "not generated"
                  )}
                </div>
              )}

              {busy && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Spinner className="text-white" />
                </div>
              )}

              <button
                className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100"
                onClick={() => onRegenerate(frame.index)}
                disabled={busy}
                title="Regenerate this frame"
              >
                ↻ Regenerate
              </button>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-muted">
              <span className="font-bold text-accent">F{frame.index}</span>
              {frame.status === "error" && (
                <span className="truncate text-red-300" title={frame.error ?? ""}>
                  {frame.error}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
