import { api } from "../../../lib/api";
import { CopyButton } from "../../ui/misc";
import type { Project } from "../../../lib/types";

export function ExportPanel({ project }: { project: Project }) {
  const hasImages = project.frames.some((f) => f.image) || project.thumbnailImage;

  return (
    <div className="card">
      <h3 className="mb-4 font-semibold">Export</h3>

      <div className="mb-5 flex flex-wrap gap-2">
        <a className="btn-ghost" href={api.exportUrl(project.id, "script.txt")}>
          📄 Script (.txt)
        </a>
        <a className="btn-ghost" href={api.exportUrl(project.id, "manifest.json")}>
          🧾 Manifest (.json)
        </a>
        <a
          className={`btn-ghost ${!hasImages ? "pointer-events-none opacity-50" : ""}`}
          href={api.exportUrl(project.id, "frames.zip")}
        >
          🖼 Frames (.zip)
        </a>
        <a
          className={`btn-ghost ${!project.videoPath ? "pointer-events-none opacity-50" : ""}`}
          href={api.exportUrl(project.id, "video.mp4")}
        >
          🎞 Video (.mp4)
        </a>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3 rounded-lg bg-surface2 px-3 py-2">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted">Title</div>
            <div className="truncate">{project.videoTitle || "—"}</div>
          </div>
          <CopyButton text={project.videoTitle} />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg bg-surface2 px-3 py-2">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted">Description</div>
            <div className="truncate">{project.description ? project.description.split("\n")[0] : "—"}</div>
          </div>
          <CopyButton text={project.description} />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg bg-surface2 px-3 py-2">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted">Tags</div>
            <div className="truncate">{project.tags.join(", ") || "—"}</div>
          </div>
          <CopyButton text={project.tags.join(", ")} />
        </div>
      </div>
    </div>
  );
}
