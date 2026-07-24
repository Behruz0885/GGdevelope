import Anthropic from "@anthropic-ai/sdk";
import { config } from "../lib/config";
import { AppError, missingKey } from "../lib/errors";
import type { ChannelType } from "../lib/types";

export interface GeneratedScript {
  title: string;
  thumbnailText: string;
  description: string;
  tags: string[];
  /** One short narration sentence per frame, in order. */
  narrationLines: string[];
}

interface ClaudeScriptJson {
  title?: string;
  thumbnail_text?: string;
  description?: string;
  tags?: string[];
  frames?: string[];
}

function targetFrames(channelType: ChannelType): { min: number; aim: number; label: string } {
  return channelType === "shorts"
    ? { min: 30, aim: 33, label: "a 60-second YouTube Short" }
    : { min: 140, aim: 150, label: "a 10-12 minute long-form YouTube video" };
}

function buildSystemPrompt(channelType: ChannelType): string {
  const { min, aim, label } = targetFrames(channelType);
  return [
    "You are a scriptwriter for a faceless stickman animation YouTube channel.",
    `Write the narration for ${label} on the topic the user gives you.`,
    "",
    "Hard rules:",
    "- The script is a sequence of FRAMES. Each frame is exactly ONE short sentence that takes about 2 seconds to narrate.",
    `- Produce AT LEAST ${min} frames (aim for about ${aim}).`,
    "- Follow this narrative arc across the frames: Hook → build-up → evidence → twist → final thought.",
    "- Do NOT include any section headers, labels, or stage directions in the narration.",
    "- Write in English with a factual, documentary tone. No emojis in the narration.",
    "- Keep each sentence concrete and visual so it can be illustrated.",
    "",
    "Also produce:",
    "- title: a punchy, curiosity-driven YouTube title.",
    "- thumbnail_text: 2-4 words of bold thumbnail text.",
    "- description: a YouTube description that includes a 1-2 sentence summary, a '⏱️ Chapters' section with a few timestamped chapters, and a line of relevant #hashtags.",
    "- tags: an array of 10-15 lowercase search tags (no # prefix).",
    "",
    "Return ONLY minified JSON with this exact shape and no markdown fences:",
    '{"title":string,"thumbnail_text":string,"description":string,"tags":string[],"frames":string[]}',
  ].join("\n");
}

function extractJson(text: string): ClaudeScriptJson {
  // The model is told to return raw JSON, but be defensive about stray fences/prose.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new AppError("The model did not return valid script JSON. Try again.", 502);
  }
  try {
    return JSON.parse(candidate.slice(start, end + 1)) as ClaudeScriptJson;
  } catch {
    throw new AppError("Could not parse the script JSON returned by the model.", 502);
  }
}

export async function generateScript(
  topic: string,
  channelType: ChannelType
): Promise<GeneratedScript> {
  if (!config.anthropic.apiKey) throw missingKey("Anthropic (ANTHROPIC_API_KEY)");

  const client = new Anthropic({ apiKey: config.anthropic.apiKey });
  const { aim } = targetFrames(channelType);

  let response;
  try {
    response = await client.messages.create({
      model: config.anthropic.model,
      max_tokens: 8000,
      system: buildSystemPrompt(channelType),
      messages: [
        {
          role: "user",
          content: `Topic: ${topic}\n\nWrite the full frame-by-frame script now (about ${aim} frames).`,
        },
      ],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new AppError(`Anthropic API request failed: ${message}`, 502);
  }

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const parsed = extractJson(text);
  const narrationLines = (parsed.frames ?? [])
    .map((s) => String(s).trim())
    .filter(Boolean);

  if (narrationLines.length === 0) {
    throw new AppError("The model returned an empty script. Try again.", 502);
  }

  return {
    title: (parsed.title ?? "").trim(),
    thumbnailText: (parsed.thumbnail_text ?? "").trim(),
    description: (parsed.description ?? "").trim(),
    tags: Array.isArray(parsed.tags) ? parsed.tags.map((t) => String(t).trim()).filter(Boolean) : [],
    narrationLines,
  };
}
