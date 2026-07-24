import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useStore } from "../lib/store";
import { useToast } from "../components/ui/Toast";
import { Spinner } from "../components/ui/misc";
import type { Settings } from "../lib/types";

export function SettingsPage() {
  const { meta } = useStore();
  const toast = useToast();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getSettings().then(setSettings).catch((e) => toast.error(e.message));
  }, [toast]);

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const saved = await api.updateSettings(settings);
      setSettings(saved);
      toast.success("Settings saved. Rebuild prompts on a project to apply the new style.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="mb-1 text-2xl font-bold">Settings</h1>
      <p className="mb-8 text-sm text-muted">
        Reusable presets applied when building image prompts. Editing these does not touch existing
        prompts until you rebuild them on a project.
      </p>

      {!settings ? (
        <p className="text-muted">Loading…</p>
      ) : (
        <div className="space-y-6">
          <div className="card">
            <div className="mb-2 flex items-center justify-between">
              <label className="label mb-0">Base Style (enforced on every frame)</label>
              {meta && (
                <button
                  className="text-xs text-accent hover:underline"
                  onClick={() => setSettings({ ...settings, baseStyle: meta.defaults.baseStyle })}
                >
                  Reset to default
                </button>
              )}
            </div>
            <textarea
              className="input h-40 resize-none font-mono text-xs leading-relaxed"
              value={settings.baseStyle}
              onChange={(e) => setSettings({ ...settings, baseStyle: e.target.value })}
            />
          </div>

          <div className="card">
            <div className="mb-2 flex items-center justify-between">
              <label className="label mb-0">Background preset</label>
              {meta && (
                <button
                  className="text-xs text-accent hover:underline"
                  onClick={() =>
                    setSettings({ ...settings, backgroundPreset: meta.defaults.backgroundPreset })
                  }
                >
                  Reset to default
                </button>
              )}
            </div>
            <textarea
              className="input h-24 resize-none font-mono text-xs leading-relaxed"
              value={settings.backgroundPreset}
              onChange={(e) => setSettings({ ...settings, backgroundPreset: e.target.value })}
            />
          </div>

          <button className="btn-primary" onClick={save} disabled={saving}>
            {saving && <Spinner />}
            Save settings
          </button>
        </div>
      )}

      {meta && (
        <div className="card mt-8">
          <h3 className="mb-3 font-semibold">Connected providers</h3>
          <p className="mb-4 text-xs text-muted">
            Configured via environment variables in <code className="text-slate-300">.env</code>.
            Restart the server after changing them.
          </p>
          <ul className="space-y-2 text-sm">
            <ProviderLine label="Script — Anthropic Claude" ok={meta.anthropicConfigured} />
            <ProviderLine label={`Images — ${meta.imageProvider}`} ok={meta.imageConfigured} />
            <ProviderLine
              label={`Text-to-speech — ${meta.ttsProvider}`}
              ok={meta.ttsConfigured}
              optional={meta.ttsProvider === "none"}
            />
          </ul>
        </div>
      )}
    </div>
  );
}

function ProviderLine({ label, ok, optional }: { label: string; ok: boolean; optional?: boolean }) {
  return (
    <li className="flex items-center justify-between">
      <span>{label}</span>
      <span
        className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
          ok
            ? "bg-success/15 text-green-300"
            : optional
              ? "bg-surface2 text-muted"
              : "bg-danger/15 text-red-300"
        }`}
      >
        {ok ? "Connected" : optional ? "Disabled" : "Not configured"}
      </span>
    </li>
  );
}
