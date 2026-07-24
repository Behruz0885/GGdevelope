import fs from "node:fs";
import path from "node:path";
import ffmpeg from "fluent-ffmpeg";
import { config } from "../lib/config";
import { AppError } from "../lib/errors";
import type { AspectRatio } from "../lib/types";
import { dimensionsFor } from "./imageProviders";
import { ensureDir } from "../lib/paths";

if (config.ffmpegPath) {
  ffmpeg.setFfmpegPath(config.ffmpegPath);
}

export interface SegmentInput {
  imagePath: string;
  /** Fallback display duration if there is no narration audio for this frame. */
  duration: number;
  /** Absolute path to this frame's narration mp3, or null. */
  audioPath: string | null;
}

export interface AssembleOptions {
  aspectRatio: AspectRatio;
  transition: "fade" | "cut";
  fadeDuration: number;
  fps: number;
  musicPath?: string | null;
  musicVolume?: number;
  hasNarration: boolean;
  onProgress?: (pct: number, message: string) => void;
}

function run(build: (cmd: ffmpeg.FfmpegCommand) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const cmd = ffmpeg();
    build(cmd);
    cmd
      .on("error", (err) => reject(new AppError(`FFmpeg failed: ${err.message}`, 500)))
      .on("end", () => resolve())
      .run();
  });
}

/** Read the duration (in seconds) of any media file via ffprobe. */
export function getMediaDuration(file: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(file, (err, data) => {
      if (err) return reject(new AppError(`ffprobe failed: ${err.message}`, 500));
      resolve(data.format.duration ?? 0);
    });
  });
}

function buildSegment(
  seg: SegmentInput,
  outPath: string,
  duration: number,
  opts: AssembleOptions
): Promise<void> {
  const { width, height } = dimensionsFor(opts.aspectRatio);
  const fade = Math.min(opts.fadeDuration, duration / 2);

  const vf = [
    `scale=${width}:${height}:force_original_aspect_ratio=decrease`,
    `pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=black`,
    "setsar=1",
    `fps=${opts.fps}`,
    "format=yuv420p",
  ];
  if (opts.transition === "fade" && fade > 0) {
    vf.push(`fade=t=in:st=0:d=${fade.toFixed(3)}`);
    vf.push(`fade=t=out:st=${(duration - fade).toFixed(3)}:d=${fade.toFixed(3)}`);
  }

  return run((cmd) => {
    cmd.input(seg.imagePath).inputOptions(["-loop 1"]);
    const outputOptions = [
      "-t",
      duration.toFixed(3),
      "-r",
      String(opts.fps),
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-pix_fmt",
      "yuv420p",
    ];

    if (seg.audioPath) {
      cmd.input(seg.audioPath);
      cmd.complexFilter([`[0:v]${vf.join(",")}[v]`]);
      outputOptions.push(
        "-map",
        "[v]",
        "-map",
        "1:a",
        "-c:a",
        "aac",
        "-ar",
        "44100",
        "-ac",
        "2",
        "-b:a",
        "192k",
        "-shortest"
      );
    } else {
      cmd.videoFilters(vf);
    }

    cmd.outputOptions(outputOptions).save(outPath);
  });
}

function concatSegments(segmentPaths: string[], listPath: string, outPath: string): Promise<void> {
  const list = segmentPaths.map((p) => `file '${p.replace(/'/g, "'\\''")}'`).join("\n");
  fs.writeFileSync(listPath, list);
  return run((cmd) => {
    cmd
      .input(listPath)
      .inputOptions(["-f", "concat", "-safe", "0"])
      .outputOptions(["-c", "copy"])
      .save(outPath);
  });
}

function mixMusic(
  videoPath: string,
  musicPath: string,
  outPath: string,
  volume: number,
  hasNarration: boolean
): Promise<void> {
  return run((cmd) => {
    cmd.input(videoPath);
    cmd.input(musicPath).inputOptions(["-stream_loop", "-1"]);
    if (hasNarration) {
      cmd.complexFilter([
        `[1:a]volume=${volume}[m]`,
        `[0:a][m]amix=inputs=2:duration=first:dropout_transition=3[a]`,
      ]);
    } else {
      cmd.complexFilter([`[1:a]volume=${volume}[a]`]);
    }
    cmd
      .outputOptions([
        "-map",
        "0:v",
        "-map",
        "[a]",
        "-c:v",
        "copy",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-shortest",
      ])
      .save(outPath);
  });
}

/**
 * Assemble frames (+ optional narration and music) into a finished H.264 MP4.
 * Returns the final path plus the effective per-frame durations actually used
 * (narration audio length wins over the configured display time when present).
 */
export async function assembleVideo(
  segments: SegmentInput[],
  workDir: string,
  finalPath: string,
  opts: AssembleOptions
): Promise<{ durations: number[] }> {
  if (segments.length === 0) throw new AppError("No frames to assemble.", 400);

  const segDir = ensureDir(path.join(workDir, "segments"));
  const segmentPaths: string[] = [];
  const durations: number[] = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    let duration = seg.duration;
    if (seg.audioPath && fs.existsSync(seg.audioPath)) {
      const audioLen = await getMediaDuration(seg.audioPath);
      if (audioLen > 0) duration = Math.max(audioLen + 0.2, 0.5); // small tail so audio isn't clipped
    }
    duration = Math.max(duration, 0.4);
    durations.push(Number(duration.toFixed(3)));

    const segPath = path.join(segDir, `seg_${String(i + 1).padStart(3, "0")}.mp4`);
    await buildSegment(seg, segPath, duration, opts);
    segmentPaths.push(segPath);

    opts.onProgress?.(
      Math.round(((i + 1) / segments.length) * 80),
      `Rendered frame ${i + 1}/${segments.length}`
    );
  }

  const concatPath = path.join(workDir, "concat.mp4");
  opts.onProgress?.(85, "Stitching frames together");
  await concatSegments(segmentPaths, path.join(workDir, "concat.txt"), concatPath);

  if (opts.musicPath && fs.existsSync(opts.musicPath)) {
    opts.onProgress?.(92, "Mixing background music");
    await mixMusic(
      concatPath,
      opts.musicPath,
      finalPath,
      opts.musicVolume ?? 0.2,
      opts.hasNarration
    );
    fs.rmSync(concatPath, { force: true });
  } else {
    fs.renameSync(concatPath, finalPath);
  }

  // Clean up intermediate segment files.
  fs.rmSync(segDir, { recursive: true, force: true });
  opts.onProgress?.(100, "Done");

  return { durations };
}
