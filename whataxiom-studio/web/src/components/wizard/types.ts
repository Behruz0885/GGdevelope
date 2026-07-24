import type { Meta, Project } from "../../lib/types";

export type StepKey = "topic" | "script" | "prompts" | "generate";

export interface StepProps {
  project: Project;
  meta: Meta | null;
  /** Optimistically replace the project in local + global state. */
  setProject: (project: Project) => void;
  /** Re-fetch the project from the server. */
  reload: () => Promise<void>;
  goTo: (step: StepKey) => void;
}
