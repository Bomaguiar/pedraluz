import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { ArrowRight, Folder } from "lucide-react";

export const Route = createFileRoute("/portal/")({
  component: PortalIndex,
});

function PortalIndex() {
  const navigate = useNavigate();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["portal-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_clients")
        .select("project_id, projects(id, name, stage, address)");
      if (error) throw error;
      return (data ?? [])
        .map((row: any) => row.projects)
        .filter(Boolean);
    },
  });

  useEffect(() => {
    if (projects && projects.length === 1) {
      navigate({ to: "/portal/$projectId", params: { projectId: projects[0].id } });
    }
  }, [projects, navigate]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="label-tag text-[var(--brass-dark)]">Client Portal</p>
      <h1 className="font-display mt-3 text-5xl">Your projects</h1>

      {isLoading && <p className="mt-12 text-sm text-muted-foreground">Loading…</p>}

      {!isLoading && (!projects || projects.length === 0) && (
        <div className="mt-12 border border-border bg-card p-12 text-center">
          <Folder className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">
            No projects assigned yet. Your studio contact will invite you when a proposal is ready.
          </p>
        </div>
      )}

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {(projects ?? []).map((p: any) => (
          <Link
            key={p.id}
            to="/portal/$projectId"
            params={{ projectId: p.id }}
            className="group block border border-border bg-card p-6 transition-colors hover:border-foreground"
          >
            <p className="label-tag text-muted-foreground capitalize">{p.stage}</p>
            <h2 className="font-display mt-2 text-2xl">{p.name}</h2>
            {p.address && <p className="mt-1 text-sm text-muted-foreground">{p.address}</p>}
            <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--brass-dark)] group-hover:text-foreground">
              Open <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
