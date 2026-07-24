import fs from "node:fs";
import { config } from "../lib/config";
import { AppError, missingKey } from "../lib/errors";

export function ttsConfigured(): boolean {
  switch (config.tts.provider) {
    case "elevenlabs":
      return Boolean(config.tts.elevenlabs.apiKey);
    case "openai":
      return Boolean(config.tts.openai.apiKey);
    default:
      return false;
  }
}

async function synthElevenLabs(text: string): Promise<Buffer> {
  const { apiKey, voiceId, model } = config.tts.elevenlabs;
  if (!apiKey) throw missingKey("ElevenLabs (ELEVENLABS_API_KEY)");
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        model_id: model,
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    }
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new AppError(`ElevenLabs TTS error: ${detail}`, 502);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function synthOpenAI(text: string): Promise<Buffer> {
  const { apiKey, model, voice } = config.tts.openai;
  if (!apiKey) throw missingKey("OpenAI TTS (OPENAI_API_KEY)");
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, voice, input: text, response_format: "mp3" }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new AppError(`OpenAI TTS error: ${detail}`, 502);
  }
  return Buffer.from(await res.arrayBuffer());
}

/** Synthesize `text` to an mp3 file at `outPath`. Returns the path written. */
export async function synthesizeToFile(text: string, outPath: string): Promise<string> {
  let audio: Buffer;
  switch (config.tts.provider) {
    case "elevenlabs":
      audio = await synthElevenLabs(text);
      break;
    case "openai":
      audio = await synthOpenAI(text);
      break;
    default:
      throw new AppError(
        `TTS is disabled or misconfigured (TTS_PROVIDER="${config.tts.provider}").`,
        424
      );
  }
  fs.writeFileSync(outPath, audio);
  return outPath;
}
