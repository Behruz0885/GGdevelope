import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useStore } from "../lib/store";
import { NewVideoModal } from "./NewVideoModal";
import type { Project, StageState } from "../lib/types";

function dotColor(state: StageState): string {
  return state === "done" ? "bg-success" : state === "partial" ? "bg-warn" : "bg-border";
}

function ProjectItem({ project }: { project: Project }) {
  const stages: StageState[] = [
    project.status.script,
    project.status.prompts,
    project.status.frames,
    project.status.video,
  ];
  return (
    <NavLink
      to={`/project/${project.id}`}
      className={({ isActive }) =>
        `block rounded-lg px-3 py-2 text-sm transition ${
          isActive ? "bg-surface2 text-white" : "text-slate-300 hover:bg-surface2/60"
        }`
      }
    >
      <div className="truncate font-medium">{project.title}</div>
      <div className="mt-1.5 flex items-center gap-1.5">
        {stages.map((s, i) => (
          <span key={i} className={`h-1.5 w-1.5 rounded-full ${dotColor(s)}`} />
        ))}
        <span className="ml-auto text-[11px] text-muted">{project.frameCount} frames</span>
      </div>
    </NavLink>
  );
}

export function Sidebar() {
  const { projects, meta } = useStore();
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  return (
    <aside className="flex h-full w-72 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="text-2xl">🎬</span>
        <div>
          <div className="text-sm font-extrabold leading-tight">WhatAxiom</div>
          <div className="text-[11px] uppercase tracking-widest text-muted">Studio</div>
        </div>
      </div>

      <div className="px-4">
        <button className="btn-primary w-full" onClick={() => setShowModal(true)}>
          + New Video
        </button>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto px-3">
        <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
          Projects ({projects.length})
        </div>
        <div className="flex flex-col gap-0.5">
          {projects.length === 0 && (
            <p className="px-2 py-4 text-xs text-muted">No projects yet. Create your first video.</p>
          )}
          {projects.map((p) => (
            <ProjectItem key={p.id} project={p} />
          ))}
        </div>
      </div>

      <div className="border-t border-border p-3">
        {meta && (
          <div className="mb-2 space-y-1 px-2 text-[11px] text-muted">
            <ProviderRow label="Script (Claude)" ok={meta.anthropicConfigured} />
            <ProviderRow label={`Images (${meta.imageProvider})`} ok={meta.imageConfigured} />
            <ProviderRow
              label={`TTS (${meta.ttsProvider})`}
              ok={meta.ttsConfigured}
              optional={meta.ttsProvider === "none"}
            />
          </div>
        )}
        <NavLink
          to="/settings"
          className={`btn-ghost w-full ${location.pathname === "/settings" ? "ring-1 ring-accent" : ""}`}
        >
          ⚙ Settings
        </NavLink>
      </div>

      {showModal && <NewVideoModal onClose={() => setShowModal(false)} />}
    </aside>
  );
}

function ProviderRow({ label, ok, optional }: { label: string; ok: boolean; optional?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span
        className={`h-2 w-2 rounded-full ${ok ? "bg-success" : optional ? "bg-border" : "bg-danger"}`}
        title={ok ? "Configured" : optional ? "Optional / disabled" : "Not configured"}
      />
    </div>
  );
}
