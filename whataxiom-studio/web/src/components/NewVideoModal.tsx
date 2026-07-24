import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useStore } from "../lib/store";
import { useToast } from "./ui/Toast";
import { Spinner } from "./ui/misc";
import type { AspectRatio, ChannelType } from "../lib/types";

export function NewVideoModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { refreshProjects } = useStore();

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [channelType, setChannelType] = useState<ChannelType>("long");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!title.trim() || !topic.trim()) {
      toast.error("Please enter a project name and a topic.");
      return;
    }
    setBusy(true);
    try {
      const project = await api.createProject({ title, topic, channelType, aspectRatio });
      await refreshProjects();
      onClose();
      navigate(`/project/${project.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div className="card w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-xl font-bold">New Video</h2>

        <label className="label">Project name</label>
        <input
          className="input mb-4"
          value={title}
          placeholder="e.g. The Man Who Sold the Eiffel Tower"
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="label">Topic</label>
        <textarea
          className="input mb-4 h-24 resize-none"
          value={topic}
          placeholder="Describe what the video should be about…"
          onChange={(e) => setTopic(e.target.value)}
        />

        <div className="mb-5 grid grid-cols-2 gap-4">
          <div>
            <label className="label">Channel type</label>
            <div className="flex overflow-hidden rounded-lg border border-border">
              {(["long", "shorts"] as ChannelType[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`flex-1 px-3 py-2 text-sm font-medium transition ${
                    channelType === c ? "bg-accent text-white" : "bg-surface2 text-muted"
                  }`}
                  onClick={() => {
                    setChannelType(c);
                    setAspectRatio(c === "shorts" ? "9:16" : "16:9");
                  }}
                >
                  {c === "long" ? "Long-form" : "Shorts"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Aspect ratio</label>
            <div className="flex overflow-hidden rounded-lg border border-border">
              {(["16:9", "9:16"] as AspectRatio[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`flex-1 px-3 py-2 text-sm font-medium transition ${
                    aspectRatio === r ? "bg-accent text-white" : "bg-surface2 text-muted"
                  }`}
                  onClick={() => setAspectRatio(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mb-4 text-xs text-muted">
          {channelType === "long"
            ? "Long-form targets 140+ frames (~10–12 min)."
            : "Shorts target 30–35 frames (~60 sec)."}
        </p>

        <div className="flex justify-end gap-2">
          <button className="btn-ghost" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button className="btn-primary" onClick={submit} disabled={busy}>
            {busy && <Spinner />}
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
