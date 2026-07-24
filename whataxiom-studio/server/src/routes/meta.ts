import { Router } from "express";
import { config, DEFAULT_BASE_STYLE, DEFAULT_BACKGROUND_PRESET } from "../lib/config";
import { imageProviderConfigured } from "../services/imageProviders";
import { ttsConfigured } from "../services/tts";

const router = Router();

// Lets the UI show which capabilities are wired up without exposing any secrets.
router.get("/", (_req, res) => {
  res.json({
    anthropicConfigured: Boolean(config.anthropic.apiKey),
    imageProvider: config.image.provider,
    imageConfigured: imageProviderConfigured(),
    ttsProvider: config.tts.provider,
    ttsConfigured: ttsConfigured(),
    defaults: {
      baseStyle: DEFAULT_BASE_STYLE,
      backgroundPreset: DEFAULT_BACKGROUND_PRESET,
    },
  });
});

export default router;
