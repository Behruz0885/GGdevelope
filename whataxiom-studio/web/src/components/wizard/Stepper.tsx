import type { StepKey } from "./types";
import type { Project } from "../../lib/types";

const STEPS: { key: StepKey; label: string; n: number }[] = [
  { key: "topic", label: "Topic", n: 1 },
  { key: "script", label: "Script", n: 2 },
  { key: "prompts", label: "Prompts", n: 3 },
  { key: "generate", label: "Generate & Assemble", n: 4 },
];

function isComplete(key: StepKey, project: Project): boolean {
  switch (key) {
    case "topic":
      return Boolean(project.topic.trim());
    case "script":
      return project.status.script === "done";
    case "prompts":
      return project.status.prompts === "done";
    case "generate":
      return project.status.video === "done";
  }
}

export function Stepper({
  current,
  project,
  onSelect,
}: {
  current: StepKey;
  project: Project;
  onSelect: (step: StepKey) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step, i) => {
        const active = step.key === current;
        const done = isComplete(step.key, project);
        return (
          <div key={step.key} className="flex items-center gap-2">
            <button
              onClick={() => onSelect(step.key)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-accent text-white"
                  : "bg-surface2 text-muted hover:text-slate-200"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                  active ? "bg-white/20" : done ? "bg-success text-white" : "bg-border text-slate-300"
                }`}
              >
                {done && !active ? "✓" : step.n}
              </span>
              {step.label}
            </button>
            {i < STEPS.length - 1 && <span className="text-border">→</span>}
          </div>
        );
      })}
    </div>
  );
}
