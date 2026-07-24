import { Router } from "express";
import { z } from "zod";
import { getSettings, updateSettings } from "../lib/db";
import { asyncHandler } from "../lib/http";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(getSettings());
  })
);

const settingsSchema = z.object({
  baseStyle: z.string().min(1).optional(),
  backgroundPreset: z.string().min(1).optional(),
});

router.put(
  "/",
  asyncHandler(async (req, res) => {
    const patch = settingsSchema.parse(req.body);
    res.json(updateSettings(patch));
  })
);

export default router;
