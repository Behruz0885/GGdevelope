import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { useToast } from "../ui/Toast";
import { CopyButton, EmptyState, Spinner } from "../ui/misc";
import type { StepProps } from "./types";
import type { AspectRatio, Frame } from "../../lib/types";

export function PromptsStep({ project, setProject, goTo }: StepProps) {
  const toast = useToast();
  const [frames, setFrames] = useState<Frame[]>(project.frames);
  const [thumbnailPrompt, setThumbnailPrompt] = useState(project.thumbnailPrompt);
  const [saving, setSaving] = useState(false);
  const [rebuilding, setRebuilding] = useState(false);

  const updatePrompt = (index: number, prompt: string) =>
    setFrames((prev) => prev.map((f) => (f.index === index ? { ...f, prompt } : f)));

  const changeAspect = async (aspectRatio: AspectRatio) => {
    if (aspectRatio === project.aspectRatio) return;
    try {
      setProject(await api.updateProject(project.id, { aspectRatio }));
      toast.info("Aspect ratio changed. Rebuild prompts to bake it into every prompt.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  const rebuild = async () => {
    setRebuilding(true);
    try {
      const updated = await api.rebuildPrompts(project.id);
      setProject(updated);
      setFrames(updated.frames);
      setThumbnailPrompt(updated.thumbnailPrompt);
      toast.success("All prompts rebuilt from the current Base Style + aspect ratio.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Rebuild failed");
    } finally {
      setRebuilding(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const updated = await api.updateProject(project.id, { frames, thumbnailPrompt });
      setProject(updated);
      setFrames(updated.frames);
      toast.success("Prompts saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (frames.length === 0) {
    return (
      <EmptyState icon="🎨" title="No frames to prompt">
        Generate a script first, then come back to fine-tune the image prompts.
      </EmptyState>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="mb-3 text-lg font-semibold">3. Image prompts</h2>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <label className="label">Aspect ratio</label>
            <div className="flex overflow-hidden rounded-lg border border-border">
              {(["16:9", "9:16"] as AspectRatio[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`px-4 py-2 text-sm font-medium transition ${
                    project.aspectRatio === r ? "bg-accent text-white" : "bg-surface2 text-muted"
                  }`}
                  onClick={() => changeAspect(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <button className="btn-ghost" onClick={rebuild} disabled={rebuilding}>
            {rebuilding && <Spinner />} Rebuild all prompts
          </button>
        </div>
        <p className="mt-3 text-xs text-muted">
          Every prompt enforces the Base Style (editable in{" "}
          <Link to="/settings" className="text-accent hover:underline">
            Settings
          </Link>
          ) and the rule <span className="font-semibold text-slate-300">“NO text in image”</span> —
          minimal text is allowed only for charts, dates, or numbers.
        </p>
      </div>

      <div className="card">
        <div className="mb-3 flex items-center justify-between">
          <label className="label mb-0">Thumbnail prompt</label>
          <CopyButton text={thumbnailPrompt} />
        </div>
        <textarea
          className="input h-24 resize-y text-xs leading-relaxed"
          value={thumbnailPrompt}
          onChange={(e) => setThumbnailPrompt(e.target.value)}
        />
      </div>

      <div className="card">
        <h3 className="mb-3 font-semibold">Per-frame prompts</h3>
        <div className="max-h-[30rem] space-y-3 overflow-y-auto pr-1">
          {frames.map((frame) => (
            <div key={frame.index} className="rounded-lg bg-surface2 p-3">
              <div className="mb-1.5 flex items-center gap-2 text-xs">
                <span className="font-bold text-accent">F{frame.index}</span>
                <span className="truncate text-muted">{frame.narration}</span>
              </div>
              <textarea
                className="input h-20 resize-y bg-surface text-xs leading-relaxed"
                value={frame.prompt}
                onChange={(e) => updatePrompt(frame.index, e.target.value)}
              />
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
            goTo("generate");
          }}
          disabled={saving}
        >
          Continue to Generate →
        </button>
      </div>
    </div>
  );
}
