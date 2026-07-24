import path from "node:path";
import Database from "better-sqlite3";
import { DATA_DIR } from "./paths";
import { DEFAULT_BASE_STYLE, DEFAULT_BACKGROUND_PRESET } from "./config";
import type {
  AspectRatio,
  ChannelType,
  Frame,
  Project,
  Settings,
} from "./types";

const db = new Database(path.join(DATA_DIR, "whataxiom.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    topic TEXT NOT NULL,
    channel_type TEXT NOT NULL,
    aspect_ratio TEXT NOT NULL,
    video_title TEXT NOT NULL DEFAULT '',
    thumbnail_text TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    tags TEXT NOT NULL DEFAULT '[]',
    frames TEXT NOT NULL DEFAULT '[]',
    thumbnail_prompt TEXT NOT NULL DEFAULT '',
    thumbnail_image TEXT,
    video_path TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    base_style TEXT NOT NULL,
    background_preset TEXT NOT NULL
  );
`);

// Seed the single settings row on first run.
const settingsExists = db.prepare("SELECT 1 FROM settings WHERE id = 1").get();
if (!settingsExists) {
  db.prepare(
    "INSERT INTO settings (id, base_style, background_preset) VALUES (1, ?, ?)"
  ).run(DEFAULT_BASE_STYLE, DEFAULT_BACKGROUND_PRESET);
}

interface ProjectRow {
  id: string;
  title: string;
  topic: string;
  channel_type: string;
  aspect_ratio: string;
  video_title: string;
  thumbnail_text: string;
  description: string;
  tags: string;
  frames: string;
  thumbnail_prompt: string;
  thumbnail_image: string | null;
  video_path: string | null;
  created_at: string;
  updated_at: string;
}

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    topic: row.topic,
    channelType: row.channel_type as ChannelType,
    aspectRatio: row.aspect_ratio as AspectRatio,
    videoTitle: row.video_title,
    thumbnailText: row.thumbnail_text,
    description: row.description,
    tags: JSON.parse(row.tags) as string[],
    frames: JSON.parse(row.frames) as Frame[],
    thumbnailPrompt: row.thumbnail_prompt,
    thumbnailImage: row.thumbnail_image,
    videoPath: row.video_path,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ---- Settings -------------------------------------------------------------

export function getSettings(): Settings {
  const row = db
    .prepare("SELECT base_style, background_preset FROM settings WHERE id = 1")
    .get() as { base_style: string; background_preset: string };
  return { baseStyle: row.base_style, backgroundPreset: row.background_preset };
}

export function updateSettings(patch: Partial<Settings>): Settings {
  const current = getSettings();
  const next: Settings = { ...current, ...patch };
  db.prepare(
    "UPDATE settings SET base_style = ?, background_preset = ? WHERE id = 1"
  ).run(next.baseStyle, next.backgroundPreset);
  return next;
}

// ---- Projects -------------------------------------------------------------

export function listProjects(): Project[] {
  const rows = db
    .prepare("SELECT * FROM projects ORDER BY updated_at DESC")
    .all() as ProjectRow[];
  return rows.map(rowToProject);
}

export function getProject(id: string): Project | null {
  const row = db.prepare("SELECT * FROM projects WHERE id = ?").get(id) as
    | ProjectRow
    | undefined;
  return row ? rowToProject(row) : null;
}

export interface CreateProjectInput {
  title: string;
  topic: string;
  channelType: ChannelType;
  aspectRatio: AspectRatio;
}

export function createProject(input: CreateProjectInput): Project {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  db.prepare(
    `INSERT INTO projects (id, title, topic, channel_type, aspect_ratio, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, input.title, input.topic, input.channelType, input.aspectRatio, now, now);
  return getProject(id)!;
}

export type ProjectPatch = Partial<
  Pick<
    Project,
    | "title"
    | "topic"
    | "channelType"
    | "aspectRatio"
    | "videoTitle"
    | "thumbnailText"
    | "description"
    | "tags"
    | "frames"
    | "thumbnailPrompt"
    | "thumbnailImage"
    | "videoPath"
  >
>;

export function updateProject(id: string, patch: ProjectPatch): Project {
  const existing = getProject(id);
  if (!existing) throw new Error(`Project ${id} not found`);
  const merged: Project = { ...existing, ...patch, updatedAt: new Date().toISOString() };
  db.prepare(
    `UPDATE projects SET
       title = ?, topic = ?, channel_type = ?, aspect_ratio = ?,
       video_title = ?, thumbnail_text = ?, description = ?, tags = ?,
       frames = ?, thumbnail_prompt = ?, thumbnail_image = ?, video_path = ?,
       updated_at = ?
     WHERE id = ?`
  ).run(
    merged.title,
    merged.topic,
    merged.channelType,
    merged.aspectRatio,
    merged.videoTitle,
    merged.thumbnailText,
    merged.description,
    JSON.stringify(merged.tags),
    JSON.stringify(merged.frames),
    merged.thumbnailPrompt,
    merged.thumbnailImage,
    merged.videoPath,
    merged.updatedAt,
    id
  );
  return getProject(id)!;
}

export function deleteProject(id: string): void {
  db.prepare("DELETE FROM projects WHERE id = ?").run(id);
}

export default db;
