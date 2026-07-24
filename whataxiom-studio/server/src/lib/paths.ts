import fs from "node:fs";
import path from "node:path";

// All persistent artifacts live under server/storage and server/data.
export const ROOT_DIR = path.resolve(__dirname, "../..");
export const DATA_DIR = path.join(ROOT_DIR, "data");
export const STORAGE_DIR = path.join(ROOT_DIR, "storage");

export function ensureDir(dir: string): string {
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function projectDir(projectId: string): string {
  return ensureDir(path.join(STORAGE_DIR, projectId));
}

export function framesDir(projectId: string): string {
  return ensureDir(path.join(projectDir(projectId), "frames"));
}

export function audioDir(projectId: string): string {
  return ensureDir(path.join(projectDir(projectId), "audio"));
}

/** Absolute path on disk for a storage-relative path like "<id>/frames/frame_001.png". */
export function storageAbs(relative: string): string {
  return path.join(STORAGE_DIR, relative);
}

/** Zero-padded frame file name, e.g. frame_001.png. */
export function frameFileName(index: number): string {
  return `frame_${String(index).padStart(3, "0")}.png`;
}

ensureDir(DATA_DIR);
ensureDir(STORAGE_DIR);
