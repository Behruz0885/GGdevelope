import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "./api";
import type { Meta, Project } from "./types";

interface Store {
  projects: Project[];
  meta: Meta | null;
  loading: boolean;
  refreshProjects: () => Promise<void>;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProjects = useCallback(async () => {
    setProjects(await api.listProjects());
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [p, m] = await Promise.all([api.listProjects(), api.meta()]);
        if (!active) return;
        setProjects(p);
        setMeta(m);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<Store>(
    () => ({ projects, meta, loading, refreshProjects }),
    [projects, meta, loading, refreshProjects]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
