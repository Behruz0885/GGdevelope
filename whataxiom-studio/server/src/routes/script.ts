import { Router } from "express";
import { getSettings, updateProject } from "../lib/db";
import { asyncHandler, loadProject } from "../lib/http";
import { withStatus } from "../lib/serialize";
import { generateScript } from "../services/anthropic";
import { buildImagePrompt, buildThumbnailPrompt } from "../services/promptBuilder";
import type { Frame } from "../lib/types";

const router = Router();

const DEFAULT_FRAME_SECONDS = 2;

// POST /api/projects/:id/script — generate script + title/thumbnail/description.
router.post(
  "/:id/script",
  asyncHandler(async (req, res) => {
    const project = loadProject(req.params.id);
    const settings = getSettings();

    const script = await generateScript(project.topic, project.channelType);

    const frames: Frame[] = script.narrationLines.map((narration, i) => ({
      index: i + 1,
      narration,
      prompt: buildImagePrompt({
        narration,
        baseStyle: settings.baseStyle,
        backgroundPreset: settings.backgroundPreset,
        aspectRatio: project.aspectRatio,
      }),
      duration: DEFAULT_FRAME_SECONDS,
      image: null,
      status: "pending",
    }));

    const thumbnailPrompt = buildThumbnailPrompt({
      topic: project.topic,
      thumbnailText: script.thumbnailText,
      baseStyle: settings.baseStyle,
      aspectRatio: project.aspectRatio,
    });

    const updated = updateProject(project.id, {
      videoTitle: script.title,
      thumbnailText: script.thumbnailText,
      description: script.description,
      tags: script.tags,
      frames,
      thumbnailPrompt,
    });

    res.json(withStatus(updated));
  })
);

export default router;
