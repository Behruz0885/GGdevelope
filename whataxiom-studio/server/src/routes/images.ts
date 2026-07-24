import fs from "node:fs";
import path from "node:path";
import { Router } from "express";
import { z } from "zod";
import { getProject, updateProject } from "../lib/db";
import { asyncHandler, loadProject } from "../lib/http";
import { AppError } from "../lib/errors";
import { withStatus } from "../lib/serialize";
import { jobs } from "../lib/jobs";
import { framesDir, projectDir, frameFileName } from "../lib/paths";
import { generateImage } from "../services/imageProviders";
import type { AspectRatio, Frame } from "../lib/types";

const router = Router();

function storageRel(...parts: string[]): string {
  return parts.join("/");
}

/** Persist a single frame's new state back into the project row. */
function saveFrame(projectId: string, index: number, patch: Partial<Frame>): void {
  const project = getProject(projectId);
  if (!project) return;
  const frames = project.frames.map((f) => (f.index === index ? { ...f, ...patch } : f));
  updateProject(projectId, { frames });
}

async function renderFrame(
  projectId: string,
  frame: Frame,
  aspectRatio: AspectRatio
): Promise<string> {
  const buffer = await generateImage(frame.prompt, aspectRatio);
  const fileName = frameFileName(frame.index);
  const abs = path.join(framesDir(projectId), fileName);
  fs.writeFileSync(abs, buffer);
  return storageRel(projectId, "frames", fileName);
}

// POST /api/projects/:id/images/generate — kick off sequential generation of all
// (or only missing) frames. Returns a jobId; progress streams over SSE.
const generateSchema = z.object({ onlyMissing: z.boolean().optional() });

router.post(
  "/:id/images/generate",
  asyncHandler(async (req, res) => {
    const project = loadProject(req.params.id);
    const { onlyMissing } = generateSchema.parse(req.body ?? {});
    if (project.frames.length === 0) {
      throw new AppError("Generate a script first — there are no frames to render.", 400);
    }

    const targets = project.frames.filter((f) => (onlyMissing ? !f.image : true));
    const jobId = jobs.create("images", project.id);
    res.status(202).json({ jobId, total: targets.length });

    // Fire-and-forget; progress is observed via the SSE stream.
    void (async () => {
      let done = 0;
      for (const frame of targets) {
        saveFrame(project.id, frame.index, { status: "generating", error: null });
        jobs.emit_(jobId, {
          kind: "frame",
          index: frame.index,
          image: frame.image,
          status: "generating",
        });
        try {
          const rel = await renderFrame(project.id, frame, project.aspectRatio);
          saveFrame(project.id, frame.index, { image: rel, status: "done", error: null });
          jobs.emit_(jobId, { kind: "frame", index: frame.index, image: rel, status: "done" });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          saveFrame(project.id, frame.index, { status: "error", error: message });
          jobs.emit_(jobId, {
            kind: "frame",
            index: frame.index,
            image: null,
            status: "error",
            error: message,
          });
        }
        done += 1;
        jobs.emit_(jobId, {
          kind: "progress",
          progress: Math.round((done / targets.length) * 100),
          message: `Generated ${done}/${targets.length} frames`,
        });
      }
      jobs.emit_(jobId, { kind: "done", progress: 100, message: "Frame generation complete" });
    })();
  })
);

// POST /api/projects/:id/images/frame/:index — regenerate one frame synchronously.
router.post(
  "/:id/images/frame/:index",
  asyncHandler(async (req, res) => {
    const project = loadProject(req.params.id);
    const index = Number(req.params.index);
    const frame = project.frames.find((f) => f.index === index);
    if (!frame) throw new AppError(`Frame ${index} not found.`, 404);

    const rel = await renderFrame(project.id, frame, project.aspectRatio);
    saveFrame(project.id, index, { image: rel, status: "done", error: null });
    res.json(withStatus(loadProject(project.id)));
  })
);

// POST /api/projects/:id/thumbnail — generate the thumbnail image from its prompt.
router.post(
  "/:id/thumbnail",
  asyncHandler(async (req, res) => {
    const project = loadProject(req.params.id);
    if (!project.thumbnailPrompt.trim()) {
      throw new AppError("There is no thumbnail prompt yet. Generate the script first.", 400);
    }
    const buffer = await generateImage(project.thumbnailPrompt, project.aspectRatio);
    const abs = path.join(projectDir(project.id), "thumbnail.png");
    fs.writeFileSync(abs, buffer);
    const rel = storageRel(project.id, "thumbnail.png");
    res.json(withStatus(updateProject(project.id, { thumbnailImage: rel })));
  })
);

export default router;
