import fs from "node:fs";
import path from "node:path";
import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { getProject, updateProject } from "../lib/db";
import { asyncHandler, loadProject } from "../lib/http";
import { AppError } from "../lib/errors";
import { withStatus } from "../lib/serialize";
import { jobs } from "../lib/jobs";
import { audioDir, ensureDir, projectDir, storageAbs } from "../lib/paths";
import { assembleVideo, type SegmentInput } from "../services/ffmpeg";
import { synthesizeToFile, ttsConfigured } from "../services/tts";

const router = Router();

// ---- Background music upload ---------------------------------------------

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, _file, cb) => cb(null, projectDir(req.params.id)),
    filename: (_req, _file, cb) => cb(null, "music.mp3"),
  }),
  limits: { fileSize: 30 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!/audio\//.test(file.mimetype)) return cb(new AppError("Please upload an audio file.", 400));
    cb(null, true);
  },
});

router.post(
  "/:id/music",
  (req, res, next) => {
    loadProject(req.params.id);
    next();
  },
  upload.single("music"),
  (req, res) => {
    if (!req.file) throw new AppError("No music file received.", 400);
    res.json({ musicPath: `${req.params.id}/music.mp3` });
  }
);

router.delete(
  "/:id/music",
  asyncHandler(async (req, res) => {
    loadProject(req.params.id);
    const abs = path.join(projectDir(req.params.id), "music.mp3");
    fs.rmSync(abs, { force: true });
    res.status(204).end();
  })
);

// ---- Video assembly -------------------------------------------------------

const assembleSchema = z.object({
  transition: z.enum(["fade", "cut"]).default("fade"),
  fadeDuration: z.number().min(0).max(3).default(0.4),
  fps: z.number().int().min(1).max(60).default(30),
  withNarration: z.boolean().default(false),
  useMusic: z.boolean().default(false),
  musicVolume: z.number().min(0).max(1).default(0.2),
});

router.post(
  "/:id/video",
  asyncHandler(async (req, res) => {
    const project = loadProject(req.params.id);
    const opts = assembleSchema.parse(req.body ?? {});

    if (project.frames.length === 0) {
      throw new AppError("There are no frames to assemble.", 400);
    }
    const missing = project.frames.filter((f) => !f.image);
    if (missing.length > 0) {
      throw new AppError(
        `Generate images first — ${missing.length} frame(s) still have no image.`,
        400
      );
    }
    if (opts.withNarration && !ttsConfigured()) {
      throw new AppError(
        "Narration was requested but no TTS provider is configured. Set TTS_PROVIDER and its key in .env.",
        424
      );
    }
    const musicAbs = path.join(projectDir(project.id), "music.mp3");
    const useMusic = opts.useMusic && fs.existsSync(musicAbs);

    const jobId = jobs.create("video", project.id);
    res.status(202).json({ jobId });

    void (async () => {
      try {
        const narrationSpan = opts.withNarration ? 35 : 0;

        // 1. Optional narration synthesis, one clip per frame.
        const audioPaths: (string | null)[] = [];
        if (opts.withNarration) {
          const dir = audioDir(project.id);
          for (let i = 0; i < project.frames.length; i++) {
            const frame = project.frames[i];
            const out = path.join(dir, `frame_${String(frame.index).padStart(3, "0")}.mp3`);
            await synthesizeToFile(frame.narration, out);
            audioPaths.push(out);
            jobs.emit_(jobId, {
              kind: "progress",
              progress: Math.round(((i + 1) / project.frames.length) * narrationSpan),
              message: `Narrated ${i + 1}/${project.frames.length} frames`,
            });
          }
        } else {
          project.frames.forEach(() => audioPaths.push(null));
        }

        // 2. Assemble.
        const segments: SegmentInput[] = project.frames.map((f, i) => ({
          imagePath: storageAbs(f.image!),
          duration: f.duration,
          audioPath: audioPaths[i],
        }));

        const workDir = ensureDir(path.join(projectDir(project.id), "work"));
        const finalPath = path.join(projectDir(project.id), "video.mp4");

        const { durations } = await assembleVideo(segments, workDir, finalPath, {
          aspectRatio: project.aspectRatio,
          transition: opts.transition,
          fadeDuration: opts.fadeDuration,
          fps: opts.fps,
          musicPath: useMusic ? musicAbs : null,
          musicVolume: opts.musicVolume,
          hasNarration: opts.withNarration,
          onProgress: (pct, message) => {
            const scaled = narrationSpan + Math.round((pct / 100) * (100 - narrationSpan));
            jobs.emit_(jobId, { kind: "progress", progress: scaled, message });
          },
        });

        fs.rmSync(workDir, { recursive: true, force: true });

        // Persist the video path + the durations actually used (narration wins).
        const current = getProject(project.id);
        if (current) {
          const frames = current.frames.map((f, i) => ({
            ...f,
            duration: durations[i] ?? f.duration,
          }));
          updateProject(project.id, { videoPath: `${project.id}/video.mp4`, frames });
        }

        jobs.emit_(jobId, { kind: "video", videoPath: `${project.id}/video.mp4` });
        jobs.emit_(jobId, { kind: "done", progress: 100, message: "Video ready" });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        jobs.emit_(jobId, { kind: "error", message });
      }
    })();
  })
);

export default router;
