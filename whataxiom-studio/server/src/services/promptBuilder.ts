import type { AspectRatio } from "../lib/types";

const NO_TEXT_RULE =
  "NO text in image — tell the story visually only. " +
  "Minimal text is allowed ONLY for charts, dates, or numbers.";

/**
 * Turn one narration line into a full text-to-image prompt.
 * The fixed Base Style + background preset are enforced on every prompt, and the
 * "NO text in image" rule is always appended.
 */
export function buildImagePrompt(opts: {
  narration: string;
  baseStyle: string;
  backgroundPreset: string;
  aspectRatio: AspectRatio;
}): string {
  const { narration, baseStyle, backgroundPreset, aspectRatio } = opts;
  const scene = narration.trim().replace(/\s+/g, " ");
  return [
    `Scene: ${scene}`,
    baseStyle.trim(),
    backgroundPreset.trim(),
    `Format ${aspectRatio}.`,
    NO_TEXT_RULE,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Build the standalone thumbnail prompt (thumbnail text is baked into the design). */
export function buildThumbnailPrompt(opts: {
  topic: string;
  thumbnailText: string;
  baseStyle: string;
  aspectRatio: AspectRatio;
}): string {
  const { topic, thumbnailText, baseStyle, aspectRatio } = opts;
  return [
    `YouTube thumbnail illustration about: ${topic}.`,
    "Bold, high-contrast, eye-catching composition with the stickman character reacting expressively.",
    baseStyle.trim(),
    `Format ${aspectRatio}.`,
    thumbnailText
      ? `The only text allowed in the image is the short bold headline: "${thumbnailText}".`
      : "NO text in image.",
  ]
    .filter(Boolean)
    .join(" ");
}
