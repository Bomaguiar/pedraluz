import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, X, Loader2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/projects")({
  component: ProjectsPage,
});

const STAGES = [
  { id: "inquiry", label: "Inquiry" },
  { id: "consultation", label: "Consultation" },
  { id: "proposal", label: "Proposal" },
  { id: "design", label: "Design" },
  { id: "permits", label: "Permits" },
  { id: "construction", label: "Construction" },
  { id: "punchlist", label: "Punch List" },
  { id: "complete", label: "Complete" },
];

const SERVICES = ["New Home Build", "Remodeling", "Home Addition", "Commercial"];

function ProjectsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, clients(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["clients-options"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("id, name").order("name");
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async (payload: any) => {
      const { error } = await supabase.from("projects").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["projects-summary"] });
      toast.success("Project created");
      setOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateStage = useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: string }) => {
      const { error } = await supabase.from("projects").update({ stage }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });

  return (
    <div className="p-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="label-tag text-[var(--brass-dark)]">Pipeline</p>
          <h1 className="font-display mt-2 text-4xl">Projects</h1>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 bg-foreground px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-background hover:bg-[var(--brass-dark)]"
        >
          <Plus className="h-3.5 w-3.5" /> New Project
        </button>
      </div>

      {isLoading ? (
        <div className="mt-12 text-sm text-muted-foreground">Loading…</div>
      ) : (
        <div className="mt-10 flex gap-4 overflow-x-auto pb-6">
          {STAGES.map((s) => {
            const items = projects.filter((p: any) => p.stage === s.id);
            return (
              <div
                key={s.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggingId) {
                    updateStage.mutate({ id: draggingId, stage: s.id });
                    setDraggingId(null);
                  }
                }}
                className="min-w-[260px] flex-1 border border-border bg-secondary/40 p-3"
              >
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <p className="label-tag text-muted-foreground">{s.label}</p>
                  <span className="text-xs text-muted-foreground">{items.length}</span>
                </div>
                <div className="mt-3 space-y-2">
                  {items.map((p: any) => (
                    <div
                      key={p.id}
                      draggable
                      onDragStart={() => setDraggingId(p.id)}
                      className="cursor-grab border border-border bg-card p-3 text-sm shadow-sm hover:shadow-md active:cursor-grabbing"
                    >
                      <Link to="/dashboard/projects/$projectId" params={{ projectId: p.id }} className="block">
                        <div className="font-medium text-foreground hover:text-[var(--brass-dark)]">{p.name}</div>
                        {p.clients?.name && (
                          <div className="mt-1 text-xs text-muted-foreground">{p.clients.name}</div>
                        )}
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{p.service_type ?? "—"}</span>
                          <span>{p.estimated_value ? `€${Number(p.estimated_value).toLocaleString("en-US")}` : "—"}</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <p className="py-6 text-center text-xs text-muted-foreground">Drop here</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg border border-border bg-background p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">New Project</h2>
              <button onClick={() => setOpen(false)}><X className="h-4 w-4" /></button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const name = String(fd.get("name") || "").trim();
                if (!name) return toast.error("Name required");
                const ev = String(fd.get("estimated_value") || "");
                create.mutate({
                  name,
                  client_id: String(fd.get("client_id") || "") || null,
                  address: String(fd.get("address") || "") || null,
                  service_type: String(fd.get("service_type") || "") || null,
                  estimated_value: ev ? Number(ev) : null,
                  due_date: String(fd.get("due_date") || "") || null,
                  stage: String(fd.get("stage") || "inquiry"),
                });
              }}
              className="mt-6 space-y-4"
            >
              <Input label="Project Name *" name="name" required />
              <div>
                <label className="label-tag text-muted-foreground">Client</label>
                <select name="client_id" defaultValue="" className="mt-2 w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-foreground">
                  <option value="">— None —</option>
                  {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <Input label="Address" name="address" />
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectF label="Service" name="service_type" options={SERVICES} />
                <SelectF label="Stage" name="stage" options={STAGES.map((s) => s.id)} defaultValue="inquiry" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Estimated Value (€)" name="estimated_value" type="number" />
                <Input label="Due Date" name="due_date" type="date" />
              </div>
              <button
                type="submit"
                disabled={create.isPending}
                className="flex w-full items-center justify-center gap-2 bg-foreground py-3 text-[11px] uppercase tracking-[0.2em] text-background hover:bg-[var(--brass-dark)] disabled:opacity-60"
              >
                {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Project
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="label-tag text-muted-foreground">{label}</label>
      <input {...rest} className="mt-2 w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-foreground" />
    </div>
  );
}

function SelectF({ label, name, options, defaultValue = "" }: { label: string; name: string; options: string[]; defaultValue?: string }) {
  return (
    <div>
      <label className="label-tag text-muted-foreground">{label}</label>
      <select name={name} defaultValue={defaultValue}
        className="mt-2 w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-foreground">
        {!defaultValue && <option value="">—</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
