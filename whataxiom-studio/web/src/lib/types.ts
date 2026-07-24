export type ChannelType = "long" | "shorts";
export type AspectRatio = "16:9" | "9:16";
export type FrameStatus = "pending" | "generating" | "done" | "error";
export type StageState = "empty" | "partial" | "done";

export interface Frame {
  index: number;
  narration: string;
  prompt: string;
  duration: number;
  image: string | null;
  status: FrameStatus;
  error?: string | null;
}

export interface ProjectStatus {
  script: StageState;
  prompts: StageState;
  frames: StageState;
  video: StageState;
  title: StageState;
  description: StageState;
  thumbnail: StageState;
}

export interface Project {
  id: string;
  title: string;
  topic: string;
  channelType: ChannelType;
  aspectRatio: AspectRatio;
  videoTitle: string;
  thumbnailText: string;
  description: string;
  tags: string[];
  frames: Frame[];
  thumbnailPrompt: string;
  thumbnailImage: string | null;
  videoPath: string | null;
  createdAt: string;
  updatedAt: string;
  status: ProjectStatus;
  frameCount: number;
  estimatedSeconds: number;
}

export interface Settings {
  baseStyle: string;
  backgroundPreset: string;
}

export interface Meta {
  anthropicConfigured: boolean;
  imageProvider: string;
  imageConfigured: boolean;
  ttsProvider: string;
  ttsConfigured: boolean;
  defaults: { baseStyle: string; backgroundPreset: string };
}

export type JobEvent =
  | { kind: "progress"; progress: number; message: string }
  | { kind: "frame"; index: number; image: string | null; status: FrameStatus; error?: string }
  | { kind: "thumbnail"; image: string }
  | { kind: "video"; videoPath: string }
  | { kind: "done"; progress: number; message: string }
  | { kind: "error"; message: string };
