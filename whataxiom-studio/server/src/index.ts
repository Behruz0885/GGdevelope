import path from "node:path";
import fs from "node:fs";
import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import { ZodError } from "zod";
import { config } from "./lib/config";
import { AppError } from "./lib/errors";
import { STORAGE_DIR } from "./lib/paths";

import projectsRouter from "./routes/projects";
import scriptRouter from "./routes/script";
import promptsRouter from "./routes/prompts";
import imagesRouter from "./routes/images";
import videoRouter from "./routes/video";
import exportRouter from "./routes/export";
import jobsRouter from "./routes/jobs";
import settingsRouter from "./routes/settings";
import metaRouter from "./routes/meta";

const app = express();

app.use(cors({ origin: config.clientOrigins.length ? config.clientOrigins : true }));
app.use(express.json({ limit: "10mb" }));

// Static hosting for generated frames, thumbnails and videos.
app.use("/storage", express.static(STORAGE_DIR));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// All /api/projects/* routers share the base path; each owns distinct sub-paths.
app.use("/api/projects", projectsRouter);
app.use("/api/projects", scriptRouter);
app.use("/api/projects", promptsRouter);
app.use("/api/projects", imagesRouter);
app.use("/api/projects", videoRouter);
app.use("/api/projects", exportRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/meta", metaRouter);

// In production, serve the built web client.
const webDist = path.resolve(__dirname, "../../web/dist");
if (fs.existsSync(webDist)) {
  app.use(express.static(webDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/storage")) return next();
    res.sendFile(path.join(webDist, "index.html"));
  });
}

// Central error handler.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    res.status(400).json({ error: "Invalid request.", details: err.issues });
    return;
  }
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  const message = err instanceof Error ? err.message : "Unexpected server error.";
  // eslint-disable-next-line no-console
  console.error("Unhandled error:", err);
  res.status(500).json({ error: message });
});

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`🎬 WhatAxiom Studio API listening on http://localhost:${config.port}`);
});
