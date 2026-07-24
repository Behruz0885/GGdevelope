import { EmptyState } from "../ui/misc";
import { ImagePanel } from "./generate/ImagePanel";
import { VideoPanel } from "./generate/VideoPanel";
import { ExportPanel } from "./generate/ExportPanel";
import type { StepProps } from "./types";

export function GenerateStep({ project, meta, setProject, reload }: StepProps) {
  if (project.frames.length === 0) {
    return (
      <EmptyState icon="⚙️" title="Nothing to generate yet">
        Generate a script and prompts first, then come back to render frames and assemble the video.
      </EmptyState>
    );
  }

  return (
    <div className="space-y-6">
      <ImagePanel project={project} setProject={setProject} reload={reload} meta={meta} />
      <VideoPanel project={project} reload={reload} meta={meta} />
      <ExportPanel project={project} />
    </div>
  );
}
