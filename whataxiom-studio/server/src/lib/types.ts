// Shared domain types for WhatAxiom Studio.

export type ChannelType = "long" | "shorts";
export type AspectRatio = "16:9" | "9:16";

export type FrameStatus = "pending" | "generating" | "done" | "error";

export interface Frame {
  /** 1-based frame index (F1, F2, ...). */
  index: number;
  /** One short narration sentence (~2s of speech). */
  narration: string;
  /** Text-to-image prompt derived from the narration + base style. */
  prompt: string;
  /** How long this frame is shown in the video, in seconds. */
  duration: number;
  /** Relative storage path to the rendered PNG, or null if not generated. */
  image: string | null;
  status: FrameStatus;
  /** Last error message for this frame, if any. */
  error?: string | null;
}

export type StageState = "empty" | "partial" | "done";

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

  // Step 1 outputs
  videoTitle: string;
  thumbnailText: string;
  description: string;
  tags: string[];

  // Frames (narration + prompt + image), shared across steps 2–4
  frames: Frame[];

  // Thumbnail image (generated separately from frame images)
  thumbnailPrompt: string;
  thumbnailImage: string | null;

  // Step 4 output
  videoPath: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface ProjectWithStatus extends Project {
  status: ProjectStatus;
  frameCount: number;
  estimatedSeconds: number;
}

export interface Settings {
  baseStyle: string;
  backgroundPreset: string;
}
