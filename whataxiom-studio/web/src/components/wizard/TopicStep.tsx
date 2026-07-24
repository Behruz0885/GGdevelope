import { useState } from "react";
import { api } from "../../lib/api";
import { useToast } from "../ui/Toast";
import { Spinner } from "../ui/misc";
import type { StepProps } from "./types";
import type { AspectRatio } from "../../lib/types";

export function TopicStep({ project, meta, setProject, goTo }: StepProps) {
  const toast = useToast();
  const [title, setTitle] = useState(project.title);
  const [topic, setTopic] = useState(project.topic);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(project.aspectRatio);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const dirty =
    title !== project.title || topic !== project.topic || aspectRatio !== project.aspectRatio;

  const save = async () => {
    setSaving(true);
    try {
      setProject(await api.updateProject(project.id, { title, topic, aspectRatio }));
      toast.success("Saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const generate = async () => {
    if (dirty) await save();
    setGenerating(true);
    try {
      const updated = await api.generateScript(project.id);
      setProject(updated);
      toast.success(`Script ready — ${updated.frameCount} frames.`);
      goTo("script");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Script generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const alreadyHasScript = project.frames.length > 0;

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="mb-4 text-lg font-semibold">1. Topic</h2>

        <label className="label">Project name</label>
        <input className="input mb-4" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label className="label">Topic</label>
        <textarea
          className="input mb-4 h-28 resize-none"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <div className="flex items-end justify-between gap-4">
          <div>
            <label className="label">Aspect ratio</label>
            <div className="flex overflow-hidden rounded-lg border border-border">
              {(["16:9", "9:16"] as AspectRatio[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`px-4 py-2 text-sm font-medium transition ${
                    aspectRatio === r ? "bg-accent text-white" : "bg-surface2 text-muted"
                  }`}
                  onClick={() => setAspectRatio(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="text-right text-xs text-muted">
            {project.channelType === "long" ? "Long-form · 140+ frames" : "Shorts · 30–35 frames"}
          </div>
        </div>

        {dirty && (
          <div className="mt-4">
            <button className="btn-ghost" onClick={save} disabled={saving}>
              {saving && <Spinner />} Save changes
            </button>
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="mb-1 font-semibold">Generate the script</h3>
        <p className="mb-4 text-sm text-muted">
          Claude writes a frame-by-frame narration (Hook → build-up → evidence → twist → final
          thought) plus a title, thumbnail text, and description.
        </p>

        {meta && !meta.anthropicConfigured && (
          <div className="mb-4 rounded-lg border border-warn/40 bg-warn/10 px-3 py-2 text-xs text-amber-200">
            <code>ANTHROPIC_API_KEY</code> is not configured. Add it to <code>.env</code> and restart
            the server to enable script generation.
          </div>
        )}

        {alreadyHasScript && (
          <p className="mb-3 text-xs text-muted">
            This project already has a script. Regenerating will overwrite the current frames.
          </p>
        )}

        <button
          className="btn-primary"
          onClick={generate}
          disabled={generating || (meta ? !meta.anthropicConfigured : false)}
        >
          {generating && <Spinner />}
          {alreadyHasScript ? "Regenerate script" : "Generate script"}
        </button>
      </div>
    </div>
  );
}
