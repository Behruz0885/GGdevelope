import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useStore } from "../lib/store";
import { useToast } from "../components/ui/Toast";
import { formatDuration } from "../lib/format";
import { Stepper } from "../components/wizard/Stepper";
import { TopicStep } from "../components/wizard/TopicStep";
import { ScriptStep } from "../components/wizard/ScriptStep";
import { PromptsStep } from "../components/wizard/PromptsStep";
import { GenerateStep } from "../components/wizard/GenerateStep";
import type { StepKey } from "../components/wizard/types";
import type { Project } from "../lib/types";

export function Wizard() {
  const { id } = useParams<{ id: string }>();
  const { meta, refreshProjects } = useStore();
  const toast = useToast();

  const [project, setProjectState] = useState<Project | null>(null);
  const [step, setStep] = useState<StepKey>("topic");
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!id) return;
    const p = await api.getProject(id);
    setProjectState(p);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    reload()
      .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load project"))
      .finally(() => setLoading(false));
  }, [reload, toast]);

  const setProject = useCallback(
    (p: Project) => {
      setProjectState(p);
      void refreshProjects();
    },
    [refreshProjects]
  );

  if (loading) return <div className="p-8 text-muted">Loading project…</div>;
  if (!project) return <div className="p-8 text-muted">Project not found.</div>;

  const stepProps = { project, meta, setProject, reload, goTo: setStep };

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
          <span className="rounded bg-surface2 px-2 py-0.5 font-medium text-slate-300">
            {project.channelType === "long" ? "Long-form" : "Shorts"}
          </span>
          <span>{project.aspectRatio}</span>
          <span className="font-semibold text-slate-300">{project.frameCount} frames</span>
          <span>~{formatDuration(project.estimatedSeconds)} estimated</span>
        </div>
      </div>

      <div className="mb-8">
        <Stepper current={step} project={project} onSelect={setStep} />
      </div>

      {step === "topic" && <TopicStep {...stepProps} />}
      {step === "script" && <ScriptStep {...stepProps} />}
      {step === "prompts" && <PromptsStep {...stepProps} />}
      {step === "generate" && <GenerateStep {...stepProps} />}
    </div>
  );
}
