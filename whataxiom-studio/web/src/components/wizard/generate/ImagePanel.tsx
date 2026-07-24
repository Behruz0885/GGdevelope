import { useEffect, useState } from "react";
import { api, storageUrl, streamJob } from "../../../lib/api";
import { useToast } from "../../ui/Toast";
import { ProgressBar, Spinner } from "../../ui/misc";
import { FrameGrid } from "./FrameGrid";
import type { Meta, Frame, Project } from "../../../lib/types";

export function ImagePanel({
  project,
  setProject,
  reload,
  meta,
}: {
  project: Project;
  setProject: (p: Project) => void;
  reload: () => Promise<void>;
  meta: Meta | null;
}) {
  const toast = useToast();
  const [frames, setFrames] = useState<Frame[]>(project.frames);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [regenIndex, setRegenIndex] = useState<number | null>(null);
  const [thumbBusy, setThumbBusy] = useState(false);
  const [bust, setBust] = useState(Date.now());

  useEffect(() => {
    if (!running) setFrames(project.frames);
  }, [project, running]);

  const doneCount = frames.filter((f) => f.image).length;
  const configured = meta ? meta.imageConfigured : true;

  const generate = async (onlyMissing: boolean) => {
    setRunning(true);
    setProgress(0);
    setMessage("Starting…");
    try {
      const { jobId } = await api.generateImages(project.id, onlyMissing);
      const { promise } = streamJob(jobId, (event) => {
        if (event.kind === "frame") {
          setFrames((prev) =>
            prev.map((f) =>
              f.index === event.index
                ? { ...f, image: event.image ?? f.image, status: event.status, error: event.error ?? null }
                : f
            )
          );
          if (event.status === "done") setBust(Date.now());
        } else if (event.kind === "progress") {
          setProgress(event.progress);
          setMessage(event.message);
        }
      });
      await promise;
      toast.success("Frame generation finished");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setRunning(false);
      await reload();
    }
  };

  const regenerate = async (index: number) => {
    setRegenIndex(index);
    try {
      const updated = await api.regenerateFrame(project.id, index);
      setProject(updated);
      setFrames(updated.frames);
      setBust(Date.now());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Regenerate failed");
    } finally {
      setRegenIndex(null);
    }
  };

  const generateThumbnail = async () => {
    setThumbBusy(true);
    try {
      const updated = await api.generateThumbnail(project.id);
      setProject(updated);
      setBust(Date.now());
      toast.success("Thumbnail generated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Thumbnail failed");
    } finally {
      setThumbBusy(false);
    }
  };

  return (
    <div className="card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">Frame images</h3>
          <p className="text-xs text-muted">
            {doneCount}/{frames.length} generated · provider:{" "}
            <span className="text-slate-300">{meta?.imageProvider}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={() => generate(true)} disabled={running || !configured}>
            Generate missing
          </button>
          <button className="btn-primary" onClick={() => generate(false)} disabled={running || !configured}>
            {running && <Spinner />} Generate all
          </button>
        </div>
      </div>

      {!configured && (
        <div className="mb-4 rounded-lg border border-warn/40 bg-warn/10 px-3 py-2 text-xs text-amber-200">
          The image provider <code>{meta?.imageProvider}</code> is not configured. Add its API key to{" "}
          <code>.env</code> and restart the server.
        </div>
      )}

      {running && (
        <div className="mb-4">
          <div className="mb-1 flex justify-between text-xs text-muted">
            <span>{message}</span>
            <span>{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      )}

      {frames.length === 0 ? (
        <p className="text-sm text-muted">Generate a script first to create frames.</p>
      ) : (
        <FrameGrid
          frames={frames}
          aspectRatio={project.aspectRatio}
          bust={String(bust)}
          onRegenerate={regenerate}
          regeneratingIndex={regenIndex}
        />
      )}

      <div className="mt-6 border-t border-border pt-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold">Thumbnail</h3>
            <p className="mb-3 text-xs text-muted">Generated separately from its own prompt.</p>
            <button className="btn-ghost" onClick={generateThumbnail} disabled={thumbBusy || !configured}>
              {thumbBusy && <Spinner />}
              {project.thumbnailImage ? "Regenerate thumbnail" : "Generate thumbnail"}
            </button>
          </div>
          {project.thumbnailImage && (
            <img
              src={`${storageUrl(project.thumbnailImage)}?v=${bust}`}
              alt="Thumbnail"
              className="h-28 rounded-lg border border-border object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
}
