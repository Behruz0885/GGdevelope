import { config } from "../lib/config";
import { AppError, missingKey } from "../lib/errors";
import type { AspectRatio } from "../lib/types";

export function dimensionsFor(aspectRatio: AspectRatio): { width: number; height: number } {
  return aspectRatio === "9:16" ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 };
}

async function downloadToBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new AppError(`Failed to download generated image (${res.status}).`, 502);
  return Buffer.from(await res.arrayBuffer());
}

// ---- Replicate (Flux) -----------------------------------------------------

async function generateReplicate(prompt: string, aspectRatio: AspectRatio): Promise<Buffer> {
  const { token, model } = config.image.replicate;
  if (!token) throw missingKey("Replicate (REPLICATE_API_TOKEN)");

  const res = await fetch(`https://api.replicate.com/v1/models/${model}/predictions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "wait",
    },
    body: JSON.stringify({
      input: {
        prompt,
        aspect_ratio: aspectRatio,
        output_format: "png",
        safety_tolerance: 2,
      },
    }),
  });

  const data = (await res.json()) as {
    output?: string | string[];
    error?: string;
    detail?: string;
  };
  if (!res.ok || data.error) {
    throw new AppError(`Replicate error: ${data.error || data.detail || res.statusText}`, 502);
  }
  const output = Array.isArray(data.output) ? data.output[0] : data.output;
  if (!output) throw new AppError("Replicate returned no image.", 502);
  return downloadToBuffer(output);
}

// ---- Fal.ai (Flux) --------------------------------------------------------

async function generateFal(prompt: string, aspectRatio: AspectRatio): Promise<Buffer> {
  const { key, model } = config.image.fal;
  if (!key) throw missingKey("Fal.ai (FAL_KEY)");

  const imageSize = aspectRatio === "9:16" ? "portrait_16_9" : "landscape_16_9";
  const res = await fetch(`https://fal.run/${model}`, {
    method: "POST",
    headers: { Authorization: `Key ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, image_size: imageSize, num_images: 1 }),
  });

  const data = (await res.json()) as {
    images?: { url: string }[];
    detail?: string;
    error?: string;
  };
  if (!res.ok) {
    throw new AppError(`Fal.ai error: ${data.error || data.detail || res.statusText}`, 502);
  }
  const url = data.images?.[0]?.url;
  if (!url) throw new AppError("Fal.ai returned no image.", 502);
  return downloadToBuffer(url);
}

// ---- OpenAI (DALL·E / gpt-image-1) ---------------------------------------

async function generateOpenAI(prompt: string, aspectRatio: AspectRatio): Promise<Buffer> {
  const { apiKey, model } = config.image.openai;
  if (!apiKey) throw missingKey("OpenAI (OPENAI_API_KEY)");

  const size = aspectRatio === "9:16" ? "1024x1536" : "1536x1024";
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, prompt, size, n: 1 }),
  });

  const data = (await res.json()) as {
    data?: { b64_json?: string; url?: string }[];
    error?: { message: string };
  };
  if (!res.ok) {
    throw new AppError(`OpenAI image error: ${data.error?.message || res.statusText}`, 502);
  }
  const first = data.data?.[0];
  if (first?.b64_json) return Buffer.from(first.b64_json, "base64");
  if (first?.url) return downloadToBuffer(first.url);
  throw new AppError("OpenAI returned no image.", 502);
}

/** Generate a single image using the configured provider. */
export async function generateImage(prompt: string, aspectRatio: AspectRatio): Promise<Buffer> {
  switch (config.image.provider) {
    case "replicate":
      return generateReplicate(prompt, aspectRatio);
    case "fal":
      return generateFal(prompt, aspectRatio);
    case "openai":
      return generateOpenAI(prompt, aspectRatio);
    default:
      throw new AppError(
        `Unknown IMAGE_PROVIDER "${config.image.provider}". Use "replicate", "fal", or "openai".`,
        400
      );
  }
}

export function imageProviderConfigured(): boolean {
  switch (config.image.provider) {
    case "replicate":
      return Boolean(config.image.replicate.token);
    case "fal":
      return Boolean(config.image.fal.key);
    case "openai":
      return Boolean(config.image.openai.apiKey);
    default:
      return false;
  }
}
