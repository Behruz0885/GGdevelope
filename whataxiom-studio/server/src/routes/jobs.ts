import { Router } from "express";
import { jobs } from "../lib/jobs";

const router = Router();

// GET /api/jobs/:jobId/stream — Server-Sent Events for image/video progress.
router.get("/:jobId/stream", (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job) {
    res.status(404).json({ error: "Unknown job." });
    return;
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.write(": connected\n\n");

  const send = (event: unknown) => res.write(`data: ${JSON.stringify(event)}\n\n`);
  const heartbeat = setInterval(() => res.write(": ping\n\n"), 15000);

  const unsubscribe = jobs.subscribe(req.params.jobId, (event) => {
    send(event);
    if (event.kind === "done" || event.kind === "error") {
      clearInterval(heartbeat);
      res.end();
    }
  });

  req.on("close", () => {
    clearInterval(heartbeat);
    unsubscribe();
  });
});

export default router;
