import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useStore } from "../lib/store";
import { useToast } from "../components/ui/Toast";
import { EmptyState, StatusBadge } from "../components/ui/misc";
import { NewVideoModal } from "../components/NewVideoModal";
import { formatDuration } from "../lib/format";
import type { Project } from "../lib/types";

const STAGES: { key: keyof Project["status"]; label: string }[] = [
  { key: "script", label: "Script" },
  { key: "prompts", label: "Prompts" },
  { key: "frames", label: "Frames" },
  { key: "video", label: "Video" },
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "thumbnail", label: "Thumbnail" },
];

export function Dashboard() {
  const { projects, loading, refreshProjects } = useStore();
  const navigate = useNavigate();
  const toast = useToast();
  const [showModal, setShowModal] = useState(false);

  const remove = async (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    try {
      await api.deleteProject(project.id);
      await refreshProjects();
      toast.success("Project deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-muted">
            Every video you've started, with its pipeline status at a glance.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + New Video
        </button>
      </div>

      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : projects.length === 0 ? (
        <EmptyState icon="🎬" title="No projects yet">
          Click <span className="font-semibold text-slate-200">New Video</span> to generate your
          first stickman documentary — from topic to finished MP4.
        </EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <div
              key={p.id}
              className="card cursor-pointer transition hover:shadow-glow"
              onClick={() => navigate(`/project/${p.id}`)}
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <h3 className="font-semibold">{p.title}</h3>
                <button
                  className="text-xs text-muted hover:text-danger"
                  onClick={(e) => remove(e, p)}
                >
                  Delete
                </button>
              </div>
              <p className="mb-3 line-clamp-2 text-sm text-muted">{p.topic}</p>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {STAGES.map((s) => (
                  <StatusBadge key={s.key} state={p.status[s.key]} label={s.label} />
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted">
                <span className="rounded bg-surface2 px-2 py-0.5 font-medium text-slate-300">
                  {p.channelType === "long" ? "Long-form" : "Shorts"}
                </span>
                <span>{p.aspectRatio}</span>
                <span>{p.frameCount} frames</span>
                <span>~{formatDuration(p.estimatedSeconds)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && <NewVideoModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
