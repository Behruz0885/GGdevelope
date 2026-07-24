import type { Project, ProjectStatus, ProjectWithStatus, StageState } from "./types";

/** Derive per-stage status from the raw project data so the dashboard can't drift. */
export function computeStatus(project: Project): ProjectStatus {
  const frames = project.frames;
  const hasFrames = frames.length > 0;
  const hasPrompts = hasFrames && frames.every((f) => f.prompt.trim().length > 0);
  const framesWithImages = frames.filter((f) => f.image).length;

  const framesState: StageState =
    framesWithImages === 0 ? "empty" : framesWithImages === frames.length ? "done" : "partial";

  return {
    script: hasFrames ? "done" : "empty",
    prompts: hasPrompts ? "done" : "empty",
    frames: hasFrames ? framesState : "empty",
    video: project.videoPath ? "done" : "empty",
    title: project.videoTitle.trim() ? "done" : "empty",
    description: project.description.trim() ? "done" : "empty",
    thumbnail: project.thumbnailImage ? "done" : "empty",
  };
}

export function estimatedSeconds(project: Project): number {
  if (project.frames.length === 0) return 0;
  return Math.round(project.frames.reduce((sum, f) => sum + (f.duration || 0), 0));
}

export function withStatus(project: Project): ProjectWithStatus {
  return {
    ...project,
    status: computeStatus(project),
    frameCount: project.frames.length,
    estimatedSeconds: estimatedSeconds(project),
  };
}
