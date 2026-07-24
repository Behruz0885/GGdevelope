import { EventEmitter } from "node:events";
import type { FrameStatus } from "./types";

export type JobType = "images" | "video";

export type JobEvent =
  | { kind: "progress"; progress: number; message: string }
  | { kind: "frame"; index: number; image: string | null; status: FrameStatus; error?: string }
  | { kind: "thumbnail"; image: string }
  | { kind: "video"; videoPath: string }
  | { kind: "done"; progress: number; message: string }
  | { kind: "error"; message: string };

interface JobState {
  id: string;
  type: JobType;
  projectId: string;
  status: "running" | "done" | "error";
  events: JobEvent[];
}

class JobHub extends EventEmitter {
  private jobs = new Map<string, JobState>();

  create(type: JobType, projectId: string): string {
    const id = crypto.randomUUID();
    this.jobs.set(id, { id, type, projectId, status: "running", events: [] });
    return id;
  }

  get(id: string): JobState | undefined {
    return this.jobs.get(id);
  }

  emit_(id: string, event: JobEvent): void {
    const job = this.jobs.get(id);
    if (!job) return;
    job.events.push(event);
    if (event.kind === "done") job.status = "done";
    if (event.kind === "error") job.status = "error";
    this.emit(`event:${id}`, event);
  }

  /** Replay past events, then invoke `onEvent` for each new one until the job ends. */
  subscribe(id: string, onEvent: (event: JobEvent) => void): () => void {
    const job = this.jobs.get(id);
    if (!job) {
      onEvent({ kind: "error", message: "Unknown job." });
      return () => {};
    }
    for (const ev of job.events) onEvent(ev);
    if (job.status !== "running") return () => {};
    const listener = (ev: JobEvent) => onEvent(ev);
    this.on(`event:${id}`, listener);
    return () => this.off(`event:${id}`, listener);
  }
}

export const jobs = new JobHub();
