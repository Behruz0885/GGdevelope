# 🎬 WhatAxiom Studio

An automated YouTube video production pipeline for a **faceless stickman animation
channel**. WhatAxiom Studio takes a single topic and walks it through the full
pipeline:

> **Topic → Script → Image Prompts → Frames → Assembled Video**

Everything is driven from a clean, modern dark-mode web UI with a four-step wizard,
a project dashboard, and reusable style presets.

---

## ✨ Features

| Step | What it does |
| ---- | ------------ |
| **1. Script** | Calls the Anthropic Claude API to write a frame-by-frame narration script (`[F1] …`), plus Title, Thumbnail text, and a Description with chapters + hashtags. Long-form = 140+ frames; Shorts = 30–35 frames. |
| **2. Image Prompts** | Converts each frame into an image prompt with a fixed, editable **Base Style**. Enforces "NO text in image". Aspect-ratio toggle (16:9 / 9:16). Every prompt is editable. |
| **3. Frames** | Sends each prompt to a configurable text-to-image API (Replicate / Fal Flux / DALL·E). Sequential generation with a live progress bar, thumbnail grid, and per-frame regenerate. Thumbnail image generated separately. |
| **4. Video** | Uses **FFmpeg** (via `fluent-ffmpeg`) to assemble frames into an H.264 MP4 with per-frame durations and fade transitions. Optional TTS narration (ElevenLabs / OpenAI) and optional background music. Preview player + download. |
| **Export** | Download frames as ZIP, the final MP4, the script as `.txt`, and a JSON manifest. Copy buttons for Title / Description / Tags. |
| **Projects** | Dashboard of all projects with per-stage status. Persisted in SQLite. |

---

## 🧱 Tech stack

- **Frontend:** React + TypeScript + Tailwind CSS (Vite), dark UI.
- **Backend:** Node.js + Express (TypeScript). FFmpeg via `fluent-ffmpeg`.
- **Database:** SQLite (`better-sqlite3`) — zero-config, file-based.
- **AI:** Anthropic Claude (scripts) + a pluggable image provider + optional TTS.

All secrets live in `.env` — nothing is hardcoded.

---

## 🚀 Getting started

### Prerequisites

- Node.js 18+ (tested on Node 22)
- [FFmpeg](https://ffmpeg.org/) available on your `PATH`

### 1. Install

```bash
# from the repo root
npm install            # installs root dev tooling + both workspaces
```

This is an npm-workspaces monorepo, so the single install wires up both
`server/` and `web/`.

### 2. Configure

```bash
cp .env.example .env
# edit .env and add whichever API keys you have
```

You only need the keys for the steps you want to run. The app **degrades
gracefully**: if a key is missing, that step returns a clear error instead of
crashing, and the rest of the studio keeps working.

### 3. Run

```bash
npm run dev            # runs the API (:4000) and the web app (:5173) together
```

Open http://localhost:5173.

### Build for production

```bash
npm run build          # type-checks + builds server and web
npm start              # serves the built API (which also serves the web build)
```

---

## 🔌 Configuration reference

See [`.env.example`](./.env.example) for the full list. Highlights:

- `ANTHROPIC_API_KEY` — required for Step 1 (script generation).
- `IMAGE_PROVIDER` = `replicate` | `fal` | `openai`, plus the matching key.
- `TTS_PROVIDER` = `elevenlabs` | `openai` | `none` for the optional narration track.

Base Style and Background presets are editable in the in-app **Settings** page and
persisted in the database, so you don't need to touch code to tweak the look.

---

## 📁 Project layout

```
whataxiom-studio/
├── server/            # Express + TypeScript API, FFmpeg, SQLite
│   └── src/
│       ├── routes/    # projects, script, prompts, images, video, export, settings
│       ├── services/  # anthropic, imageProviders, ffmpeg, tts, promptBuilder
│       └── lib/       # db, config, paths, types
└── web/               # React + Vite + Tailwind
    └── src/
        ├── pages/     # Dashboard, Wizard, Settings
        ├── components/# wizard steps, sidebar, UI primitives
        └── lib/       # API client, types
```

---

## ⚠️ Notes

- Video assembly requires FFmpeg on the host. If it's missing, the video step
  reports a friendly error.
- Image and video generation can take a while and cost money on paid APIs —
  generation runs sequentially and streams progress so you always know where it is.
