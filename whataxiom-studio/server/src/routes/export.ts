import fs from "node:fs";
import { Router } from "express";
import archiver from "archiver";
import { asyncHandler, loadProject } from "../lib/http";
import { AppError } from "../lib/errors";
import { withStatus } from "../lib/serialize";
import { frameFileName, storageAbs } from "../lib/paths";

const router = Router();

function safeName(project: { title: string }): string {
  return (
    project.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "whataxiom-project"
  );
}

// Script as plain text in [F1] frame format.
router.get(
  "/:id/export/script.txt",
  asyncHandler(async (req, res) => {
    const project = loadProject(req.params.id);
    const lines = [
      `TITLE: ${project.videoTitle}`,
      "",
      ...project.frames.map((f) => `[F${f.index}] ${f.narration}`),
      "",
      "---",
      `THUMBNAIL: ${project.thumbnailText}`,
      "",
      "DESCRIPTION:",
      project.description,
      "",
      `TAGS: ${project.tags.join(", ")}`,
      "",
    ].join("\n");

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${safeName(project)}-script.txt"`);
    res.send(lines);
  })
);

// Full JSON manifest of the project.
router.get(
  "/:id/export/manifest.json",
  asyncHandler(async (req, res) => {
    const project = withStatus(loadProject(req.params.id));
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeName(project)}-manifest.json"`
    );
    res.send(JSON.stringify(project, null, 2));
  })
);

// All frame images (+ thumbnail) as a ZIP.
router.get(
  "/:id/export/frames.zip",
  asyncHandler(async (req, res) => {
    const project = loadProject(req.params.id);
    const withImages = project.frames.filter((f) => f.image);
    if (withImages.length === 0 && !project.thumbnailImage) {
      throw new AppError("There are no generated images to export yet.", 400);
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${safeName(project)}-frames.zip"`);

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", (err) => {
      throw new AppError(`Failed to build ZIP: ${err.message}`, 500);
    });
    archive.pipe(res);

    for (const frame of withImages) {
      const abs = storageAbs(frame.image!);
      if (fs.existsSync(abs)) archive.file(abs, { name: frameFileName(frame.index) });
    }
    if (project.thumbnailImage) {
      const abs = storageAbs(project.thumbnailImage);
      if (fs.existsSync(abs)) archive.file(abs, { name: "thumbnail.png" });
    }
    await archive.finalize();
  })
);

// Final assembled MP4.
router.get(
  "/:id/export/video.mp4",
  asyncHandler(async (req, res) => {
    const project = loadProject(req.params.id);
    if (!project.videoPath) throw new AppError("No video has been assembled yet.", 400);
    const abs = storageAbs(project.videoPath);
    if (!fs.existsSync(abs)) throw new AppError("The video file is missing on disk.", 404);
    res.setHeader("Content-Disposition", `attachment; filename="${safeName(project)}.mp4"`);
    res.sendFile(abs);
  })
);

export default router;
