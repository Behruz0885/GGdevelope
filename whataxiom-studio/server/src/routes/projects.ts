import { Router } from "express";
import { z } from "zod";
import {
  createProject,
  deleteProject,
  listProjects,
  updateProject,
} from "../lib/db";
import { asyncHandler, loadProject } from "../lib/http";
import { withStatus } from "../lib/serialize";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(listProjects().map(withStatus));
  })
);

const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  topic: z.string().trim().min(1).max(2000),
  channelType: z.enum(["long", "shorts"]),
  aspectRatio: z.enum(["16:9", "9:16"]).optional(),
});

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = createSchema.parse(req.body);
    const aspectRatio = input.aspectRatio ?? (input.channelType === "shorts" ? "9:16" : "16:9");
    const project = createProject({
      title: input.title,
      topic: input.topic,
      channelType: input.channelType,
      aspectRatio,
    });
    res.status(201).json(withStatus(project));
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    res.json(withStatus(loadProject(req.params.id)));
  })
);

const frameSchema = z.object({
  index: z.number().int().positive(),
  narration: z.string(),
  prompt: z.string(),
  duration: z.number().positive(),
  image: z.string().nullable(),
  status: z.enum(["pending", "generating", "done", "error"]),
  error: z.string().nullable().optional(),
});

const patchSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  topic: z.string().trim().min(1).optional(),
  aspectRatio: z.enum(["16:9", "9:16"]).optional(),
  videoTitle: z.string().optional(),
  thumbnailText: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  frames: z.array(frameSchema).optional(),
  thumbnailPrompt: z.string().optional(),
});

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    loadProject(req.params.id);
    const patch = patchSchema.parse(req.body);
    res.json(withStatus(updateProject(req.params.id, patch)));
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    loadProject(req.params.id);
    deleteProject(req.params.id);
    res.status(204).end();
  })
);

export default router;
