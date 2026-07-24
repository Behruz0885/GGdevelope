import type {
  AspectRatio,
  ChannelType,
  Frame,
  JobEvent,
  Meta,
  Project,
  Settings,
} from "./types";

const BASE = "/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
    ...options,
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.error ?? message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Absolute URL for a storage-relative path returned by the API. */
export function storageUrl(rel: string): string {
  return `/storage/${rel}`;
}

export const api = {
  meta: () => request<Meta>("/meta"),

  getSettings: () => request<Settings>("/settings"),
  updateSettings: (patch: Partial<Settings>) =>
    request<Settings>("/settings", { method: "PUT", body: JSON.stringify(patch) }),

  listProjects: () => request<Project[]>("/projects"),
  getProject: (id: string) => request<Project>(`/projects/${id}`),
  createProject: (input: {
    title: string;
    topic: string;
    channelType: ChannelType;
    aspectRatio?: AspectRatio;
  }) => request<Project>("/projects", { method: "POST", body: JSON.stringify(input) }),
  updateProject: (id: string, patch: Partial<Project>) =>
    request<Project>(`/projects/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
  deleteProject: (id: string) => request<void>(`/projects/${id}`, { method: "DELETE" }),

  generateScript: (id: string) =>
    request<Project>(`/projects/${id}/script`, { method: "POST" }),

  rebuildPrompts: (id: string) =>
    request<Project>(`/projects/${id}/prompts/rebuild`, { method: "POST" }),

  generateImages: (id: string, onlyMissing: boolean) =>
    request<{ jobId: string; total: number }>(`/projects/${id}/images/generate`, {
      method: "POST",
      body: JSON.stringify({ onlyMissing }),
    }),
  regenerateFrame: (id: string, index: number) =>
    request<Project>(`/projects/${id}/images/frame/${index}`, { method: "POST" }),
  generateThumbnail: (id: string) =>
    request<Project>(`/projects/${id}/thumbnail`, { method: "POST" }),

  uploadMusic: async (id: string, file: File): Promise<{ musicPath: string }> => {
    const form = new FormData();
    form.append("music", file);
    const res = await fetch(`${BASE}/projects/${id}/music`, { method: "POST", body: form });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Upload failed");
    return res.json();
  },
  deleteMusic: (id: string) => request<void>(`/projects/${id}/music`, { method: "DELETE" }),

  assembleVideo: (
    id: string,
    opts: {
      transition: "fade" | "cut";
      fadeDuration?: number;
      fps?: number;
      withNarration: boolean;
      useMusic: boolean;
      musicVolume?: number;
    }
  ) =>
    request<{ jobId: string }>(`/projects/${id}/video`, {
      method: "POST",
      body: JSON.stringify(opts),
    }),

  exportUrl: (id: string, kind: "script.txt" | "manifest.json" | "frames.zip" | "video.mp4") =>
    `${BASE}/projects/${id}/export/${kind}`,
};

/**
 * Subscribe to a job's SSE stream. Calls `onEvent` for each event; resolves when
 * the job finishes (done) and rejects on error.
 */
export function streamJob(
  jobId: string,
  onEvent: (event: JobEvent) => void
): { promise: Promise<void>; close: () => void } {
  const source = new EventSource(`${BASE}/jobs/${jobId}/stream`);
  let settle: () => void;
  let fail: (e: Error) => void;
  const promise = new Promise<void>((resolve, reject) => {
    settle = resolve;
    fail = reject;
  });

  source.onmessage = (msg) => {
    const event = JSON.parse(msg.data) as JobEvent;
    onEvent(event);
    if (event.kind === "done") {
      source.close();
      settle();
    } else if (event.kind === "error") {
      source.close();
      fail(new Error(event.message));
    }
  };
  source.onerror = () => {
    // EventSource auto-reconnects; if the job already ended the promise is settled.
  };

  return { promise, close: () => source.close() };
}

export type { Frame };
