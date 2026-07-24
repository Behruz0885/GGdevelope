import type { NextFunction, Request, Response } from "express";
import { getProject } from "./db";
import { AppError } from "./errors";
import type { Project } from "./types";

/** Wrap an async route so thrown errors reach the error middleware. */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

export function loadProject(id: string): Project {
  const project = getProject(id);
  if (!project) throw new AppError(`Project ${id} not found.`, 404);
  return project;
}
