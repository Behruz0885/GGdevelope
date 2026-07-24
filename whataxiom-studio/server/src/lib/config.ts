import path from "node:path";
import dotenv from "dotenv";

// Load .env from the repo root first, then from server/ (server wins for overrides).
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function str(name: string, fallback = ""): string {
  const v = process.env[name];
  return v === undefined || v === "" ? fallback : v;
}

export const config = {
  port: Number(str("PORT", "4000")),
  clientOrigins: str("CLIENT_ORIGIN", "http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  anthropic: {
    apiKey: str("ANTHROPIC_API_KEY"),
    model: str("ANTHROPIC_MODEL", "claude-3-5-sonnet-latest"),
  },

  image: {
    provider: str("IMAGE_PROVIDER", "replicate").toLowerCase(),
    replicate: {
      token: str("REPLICATE_API_TOKEN"),
      model: str("REPLICATE_MODEL", "black-forest-labs/flux-1.1-pro"),
    },
    fal: {
      key: str("FAL_KEY"),
      model: str("FAL_MODEL", "fal-ai/flux/dev"),
    },
    openai: {
      apiKey: str("OPENAI_API_KEY"),
      model: str("OPENAI_IMAGE_MODEL", "gpt-image-1"),
    },
  },

  tts: {
    provider: str("TTS_PROVIDER", "none").toLowerCase(),
    elevenlabs: {
      apiKey: str("ELEVENLABS_API_KEY"),
      voiceId: str("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM"),
      model: str("ELEVENLABS_MODEL", "eleven_multilingual_v2"),
    },
    openai: {
      apiKey: str("OPENAI_API_KEY"),
      model: str("OPENAI_TTS_MODEL", "tts-1"),
      voice: str("OPENAI_TTS_VOICE", "onyx"),
    },
  },

  ffmpegPath: str("FFMPEG_PATH"),
} as const;

/** The fixed illustration style enforced on every image prompt. */
export const DEFAULT_BASE_STYLE =
  "2D cartoon illustration, hand-drawn sketch style, bold black outlines, " +
  "YouTube educational animation style. Character: thin black stickman limbs, " +
  "large round expressive white face, small rounded black mitten hands, " +
  "detailed cartoon expressions. Costume matches scene. Detailed atmospheric " +
  "background. Warm flat colors, subtle shading. Objects fully detailed.";

export const DEFAULT_BACKGROUND_PRESET =
  "Detailed atmospheric background that matches the scene, subtle depth, warm flat colors.";
