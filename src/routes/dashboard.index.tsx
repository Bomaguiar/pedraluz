import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: OverviewPage,
});

const STAGES = ["inquiry", "consultation", "proposal", "design", "permits", "construction", "punchlist", "complete"];

function OverviewPage() {
  const clients = useQuery({
    queryKey: ["clients-summary"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("id, status, created_at").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const projects = useQuery({
    queryKey: ["projects-summary"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("id, name, stage, estimated_value, due_date, created_at").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const activeProjects = (projects.data ?? []).filter((p) => !["complete"].includes(p.stage)).length;
  const pipelineValue = (projects.data ?? []).reduce((sum, p) => sum + (Number(p.estimated_value) || 0), 0);
  const newInquiries = (clients.data ?? []).filter((c) => c.status === "inquiry").length;

  return (
    <div className="p-4 md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-tag text-[var(--brass-dark)]">Overview</p>
          <h1 className="font-display mt-2 text-4xl">Studio dashboard</h1>
        </div>
      </div>

      <div className="mt-10 grid gap-px bg-border md:grid-cols-4">
        <KPI label="Active Projects" value={activeProjects} />
        <KPI label="Pipeline Value" value={`€${pipelineValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`} />
        <KPI label="New Inquiries" value={newInquiries} />
        <KPI label="Total Clients" value={(clients.data ?? []).length} />
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <Card title="Recent inquiries" linkTo="/dashboard/clients">
          <ul className="divide-y divide-border">
            {(clients.data ?? []).slice(0, 6).map((c: any) => (
              <li key={c.id} className="flex items-center justify-between py-3 text-sm">
                <span className="text-foreground">{c.name ?? "—"}</span>
                <span className="label-tag text-muted-foreground">{c.status}</span>
              </li>
            ))}
            {(clients.data ?? []).length === 0 && <li className="py-6 text-sm text-muted-foreground">No clients yet.</li>}
          </ul>
        </Card>

        <Card title="Pipeline by stage" linkTo="/dashboard/projects">
          <ul className="space-y-3">
            {STAGES.map((s) => {
              const count = (projects.data ?? []).filter((p: any) => p.stage === s).length;
              return (
                <li key={s} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-foreground">{s}</span>
                  <span className="label-tag text-muted-foreground">{count}</span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-background p-8">
      <p className="label-tag text-muted-foreground">{label}</p>
      <p className="font-display mt-3 text-4xl">{value}</p>
    </div>
  );
}

function Card({ title, children, linkTo }: { title: string; children: React.ReactNode; linkTo: string }) {
  return (
    <div className="border border-border bg-card p-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">{title}</h2>
        <Link to={linkTo} className="label-tag inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}
