import { useRef, useState } from "react";
import { api, storageUrl, streamJob } from "../../../lib/api";
import { useToast } from "../../ui/Toast";
import { ProgressBar, Spinner } from "../../ui/misc";
import type { Meta, Project } from "../../../lib/types";

export function VideoPanel({
  project,
  reload,
  meta,
}: {
  project: Project;
  reload: () => Promise<void>;
  meta: Meta | null;
}) {
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [transition, setTransition] = useState<"fade" | "cut">("fade");
  const [fps, setFps] = useState(30);
  const [withNarration, setWithNarration] = useState(false);
  const [useMusic, setUseMusic] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.2);
  const [musicName, setMusicName] = useState<string | null>(null);

  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const ttsReady = meta ? meta.ttsConfigured : false;
  const allFramesReady = project.frames.length > 0 && project.frames.every((f) => f.image);

  const uploadMusic = async (file: File) => {
    try {
      await api.uploadMusic(project.id, file);
      setMusicName(file.name);
      setUseMusic(true);
      toast.success("Music uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const removeMusic = async () => {
    try {
      await api.deleteMusic(project.id);
    } catch {
      /* ignore */
    }
    setMusicName(null);
    setUseMusic(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const assemble = async () => {
    setRunning(true);
    setProgress(0);
    setMessage("Starting…");
    try {
      const { jobId } = await api.assembleVideo(project.id, {
        transition,
        fps,
        withNarration,
        useMusic,
        musicVolume,
      });
      const { promise } = streamJob(jobId, (event) => {
        if (event.kind === "progress") {
          setProgress(event.progress);
          setMessage(event.message);
        }
      });
      await promise;
      await reload();
      toast.success("Video assembled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Assembly failed");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="card">
      <h3 className="mb-4 font-semibold">Assemble video</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Transition</label>
          <select
            className="input"
            value={transition}
            onChange={(e) => setTransition(e.target.value as "fade" | "cut")}
          >
            <option value="fade">Fade (dip to black)</option>
            <option value="cut">Hard cut</option>
          </select>
        </div>
        <div>
          <label className="label">Frame rate</label>
          <select className="input" value={fps} onChange={(e) => setFps(Number(e.target.value))}>
            <option value={24}>24 fps</option>
            <option value={30}>30 fps</option>
            <option value={60}>60 fps</option>
          </select>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <label
          className={`flex items-center gap-3 rounded-lg border border-border bg-surface2 px-3 py-2.5 text-sm ${
            ttsReady ? "cursor-pointer" : "opacity-60"
          }`}
        >
          <input
            type="checkbox"
            className="h-4 w-4 accent-accent"
            checked={withNarration}
            disabled={!ttsReady}
            onChange={(e) => setWithNarration(e.target.checked)}
          />
          <span className="flex-1">
            Add TTS narration track
            <span className="ml-2 text-xs text-muted">
              {ttsReady
                ? `(${meta?.ttsProvider} — each frame times to its narration)`
                : `(TTS provider "${meta?.ttsProvider}" not configured)`}
            </span>
          </span>
        </label>

        <div className="rounded-lg border border-border bg-surface2 px-3 py-2.5">
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-accent"
              checked={useMusic}
              disabled={!musicName}
              onChange={(e) => setUseMusic(e.target.checked)}
            />
            <span className="flex-1">Mix background music</span>
            <input
              ref={fileRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadMusic(e.target.files[0])}
            />
            {musicName ? (
              <span className="flex items-center gap-2 text-xs text-muted">
                {musicName}
                <button className="text-danger hover:underline" onClick={removeMusic}>
                  remove
                </button>
              </span>
            ) : (
              <button className="btn-ghost !py-1 text-xs" onClick={() => fileRef.current?.click()}>
                Upload mp3
              </button>
            )}
          </label>
          {useMusic && (
            <div className="mt-3 flex items-center gap-3 text-xs text-muted">
              <span>Volume</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={musicVolume}
                className="flex-1 accent-accent"
                onChange={(e) => setMusicVolume(Number(e.target.value))}
              />
              <span className="w-8 text-right">{Math.round(musicVolume * 100)}%</span>
            </div>
          )}
        </div>
      </div>

      {!allFramesReady && (
        <div className="mt-4 rounded-lg border border-warn/40 bg-warn/10 px-3 py-2 text-xs text-amber-200">
          Generate an image for every frame before assembling the video.
        </div>
      )}

      {running && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-muted">
            <span>{message}</span>
            <span>{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      )}

      <button
        className="btn-primary mt-4"
        onClick={assemble}
        disabled={running || !allFramesReady}
      >
        {running && <Spinner />}
        {project.videoPath ? "Re-assemble video" : "Assemble video"}
      </button>

      {project.videoPath && !running && (
        <div className="mt-6 border-t border-border pt-5">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-semibold">Preview</h4>
            <a className="btn-ghost" href={api.exportUrl(project.id, "video.mp4")}>
              ⬇ Download MP4
            </a>
          </div>
          <video
            key={project.updatedAt}
            className="w-full rounded-lg border border-border bg-black"
            controls
            src={`${storageUrl(project.videoPath)}?v=${encodeURIComponent(project.updatedAt)}`}
          />
        </div>
      )}
    </div>
  );
}
