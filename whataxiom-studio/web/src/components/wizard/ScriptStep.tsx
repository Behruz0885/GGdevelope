import { useState } from "react";
import { api } from "../../lib/api";
import { useToast } from "../ui/Toast";
import { CopyButton, EmptyState, Spinner } from "../ui/misc";
import { formatDuration } from "../../lib/format";
import type { StepProps } from "./types";
import type { Frame } from "../../lib/types";

export function ScriptStep({ project, setProject, goTo }: StepProps) {
  const toast = useToast();
  const [videoTitle, setVideoTitle] = useState(project.videoTitle);
  const [thumbnailText, setThumbnailText] = useState(project.thumbnailText);
  const [description, setDescription] = useState(project.description);
  const [tags, setTags] = useState(project.tags.join(", "));
  const [frames, setFrames] = useState<Frame[]>(project.frames);
  const [saving, setSaving] = useState(false);

  const totalSeconds = frames.reduce((s, f) => s + (f.duration || 0), 0);

  const updateFrame = (index: number, patch: Partial<Frame>) => {
    setFrames((prev) => prev.map((f) => (f.index === index ? { ...f, ...patch } : f)));
  };

  const deleteFrame = (index: number) => {
    setFrames((prev) =>
      prev.filter((f) => f.index !== index).map((f, i) => ({ ...f, index: i + 1 }))
    );
  };

  const save = async () => {
    setSaving(true);
    try {
      const updated = await api.updateProject(project.id, {
        videoTitle,
        thumbnailText,
        description,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        frames,
      });
      setProject(updated);
      setFrames(updated.frames);
      toast.success("Script saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (frames.length === 0) {
    return (
      <EmptyState icon="📝" title="No script yet">
        Go back to the Topic step and generate a script first.
      </EmptyState>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="mb-4 text-lg font-semibold">2. Script &amp; metadata</h2>

        <div className="mb-4 flex items-center justify-between">
          <label className="label mb-0">Title</label>
          <CopyButton text={videoTitle} />
        </div>
        <input className="input mb-4" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} />

        <label className="label">Thumbnail text</label>
        <input
          className="input mb-4"
          value={thumbnailText}
          onChange={(e) => setThumbnailText(e.target.value)}
        />

        <div className="mb-1 flex items-center justify-between">
          <label className="label mb-0">Description (chapters + hashtags)</label>
          <CopyButton text={description} />
        </div>
        <textarea
          className="input mb-4 h-40 resize-y"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="label">Tags (comma-separated)</label>
        <input className="input" value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>

      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Frames</h3>
          <div className="text-xs text-muted">
            <span className="font-semibold text-slate-300">{frames.length}</span> frames · ~
            {formatDuration(totalSeconds)}
          </div>
        </div>

        <div className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
          {frames.map((frame) => (
            <div key={frame.index} className="flex items-start gap-2 rounded-lg bg-surface2 p-2">
              <span className="mt-2 w-10 shrink-0 text-center text-xs font-bold text-accent">
                F{frame.index}
              </span>
              <textarea
                className="input min-h-[38px] flex-1 resize-y bg-surface py-2"
                rows={1}
                value={frame.narration}
                onChange={(e) => updateFrame(frame.index, { narration: e.target.value })}
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0.4}
                  step={0.5}
                  className="input w-16 bg-surface text-center"
                  value={frame.duration}
                  onChange={(e) =>
                    updateFrame(frame.index, { duration: Number(e.target.value) || 0.4 })
                  }
                  title="Seconds on screen"
                />
                <button
                  className="px-2 py-1 text-xs text-muted hover:text-danger"
                  onClick={() => deleteFrame(frame.index)}
                  title="Delete frame"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button className="btn-ghost" onClick={save} disabled={saving}>
          {saving && <Spinner />} Save
        </button>
        <button
          className="btn-primary"
          onClick={async () => {
            await save();
            goTo("prompts");
          }}
          disabled={saving}
        >
          Continue to Prompts →
        </button>
      </div>
    </div>
  );
}
