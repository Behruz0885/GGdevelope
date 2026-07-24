import { Router } from "express";
import { getSettings, updateProject } from "../lib/db";
import { asyncHandler, loadProject } from "../lib/http";
import { withStatus } from "../lib/serialize";
import { buildImagePrompt, buildThumbnailPrompt } from "../services/promptBuilder";

const router = Router();

// POST /api/projects/:id/prompts/rebuild — regenerate every image prompt from the
// current narration, Base Style, background preset and aspect ratio. Handy after
// toggling the aspect ratio or editing the Base Style in Settings.
router.post(
  "/:id/prompts/rebuild",
  asyncHandler(async (req, res) => {
    const project = loadProject(req.params.id);
    const settings = getSettings();

    const frames = project.frames.map((frame) => ({
      ...frame,
      prompt: buildImagePrompt({
        narration: frame.narration,
        baseStyle: settings.baseStyle,
        backgroundPreset: settings.backgroundPreset,
        aspectRatio: project.aspectRatio,
      }),
    }));

    const thumbnailPrompt = buildThumbnailPrompt({
      topic: project.topic,
      thumbnailText: project.thumbnailText,
      baseStyle: settings.baseStyle,
      aspectRatio: project.aspectRatio,
    });

    res.json(withStatus(updateProject(project.id, { frames, thumbnailPrompt })));
  })
);

export default router;
