import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { inviteClientToProject } from "@/server/portal.functions";
import {
  ScopeChecklistAdmin,
  DocumentsAdmin,
  UpdatesAdmin,
  KnowledgeAdmin,
} from "@/components/dashboard/ProjectCollab";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  Save,
  Send,
  Mail,
  CheckCircle2,
  Circle,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/projects/$projectId")({
  component: AdminProjectDetail,
});

function AdminProjectDetail() {
  const { projectId } = Route.useParams();
  const [tab, setTab] = useState<"proposal" | "scope" | "docs" | "updates" | "knowledge" | "milestones" | "clients" | "messages">("proposal");

  const projectQ = useQuery({
    queryKey: ["admin-project", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, clients(name, email, id), project_managers(*)")
        .eq("id", projectId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const managersQ = useQuery({
    queryKey: ["admin-managers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("project_managers").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const qc = useQueryClient();
  const updateProject = useMutation({
    mutationFn: async (payload: any) => {
      const { error } = await supabase.from("projects").update(payload).eq("id", projectId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-project", projectId] });
      toast.success("Saved");
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (projectQ.isLoading)
    return <div className="p-4 md:p-10 text-sm text-muted-foreground">Loading…</div>;
  if (!projectQ.data) return <div className="p-4 md:p-10">Project not found</div>;
  const p = projectQ.data as any;

  return (
    <div className="p-4 md:p-10">
      <Link to="/dashboard/projects" className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> All projects
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-tag text-[var(--brass-dark)] capitalize">{p.stage}</p>
          <h1 className="font-display mt-2 text-3xl md:text-4xl">{p.name}</h1>
          {p.clients?.name && (
            <p className="mt-1 text-sm text-muted-foreground">Client: {p.clients.name}</p>
          )}
        </div>
        <Link
          to="/portal/$projectId"
          params={{ projectId }}
          target="_blank"
          className="flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.2em] hover:bg-secondary"
        >
          <ExternalLink className="h-3 w-3" /> Preview portal
        </Link>
      </div>

      {/* Project meta editor */}
      <div className="mt-8 grid gap-4 border border-border bg-card p-6 sm:grid-cols-3">
        <div>
          <label className="label-tag text-muted-foreground">Project Manager</label>
          <select
            defaultValue={p.manager_id ?? ""}
            onChange={(e) => updateProject.mutate({ manager_id: e.target.value || null })}
            className="mt-2 w-full border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">— None —</option>
            {(managersQ.data ?? []).map((m: any) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-tag text-muted-foreground">Founder name</label>
          <input
            defaultValue={p.founder_name ?? ""}
            onBlur={(e) => updateProject.mutate({ founder_name: e.target.value || null })}
            className="mt-2 w-full border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="label-tag text-muted-foreground">Founder title</label>
          <input
            defaultValue={p.founder_title ?? ""}
            onBlur={(e) => updateProject.mutate({ founder_title: e.target.value || null })}
            className="mt-2 w-full border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10 flex gap-1 border-b border-border">
        {[
          { k: "proposal", l: "Proposal" },
          { k: "scope", l: "Scope & Checklist" },
          { k: "docs", l: "Documents" },
          { k: "updates", l: "Updates" },
          { k: "knowledge", l: "Bot & Knowledge" },
          { k: "milestones", l: "Progress milestones" },
          { k: "clients", l: "Client access" },
          { k: "messages", l: "Messages" },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k as any)}
            className={`border-b-2 px-5 py-3 text-xs uppercase tracking-[0.2em] ${
              tab === t.k ? "border-[var(--brass-dark)] text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.l}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "proposal" && <ProposalEditor projectId={projectId} project={p} />}
        {tab === "scope" && <ScopeChecklistAdmin projectId={projectId} />}
        {tab === "docs" && <DocumentsAdmin projectId={projectId} />}
        {tab === "updates" && <UpdatesAdmin projectId={projectId} />}
        {tab === "knowledge" && <KnowledgeAdmin projectId={projectId} />}
        {tab === "milestones" && <MilestonesEditor projectId={projectId} />}
        {tab === "clients" && <ClientsAccess projectId={projectId} project={p} />}
        {tab === "messages" && <MessagesAdmin projectId={projectId} />}
      </div>
    </div>
  );
}

/* ──────────────────────────── PROPOSAL EDITOR ──────────────────────────── */

function ProposalEditor({ projectId, project }: { projectId: string; project: any }) {
  const qc = useQueryClient();
  const proposalQ = useQuery({
    queryKey: ["admin-proposal", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("proposals")
        .select("*, proposal_items(*), proposal_milestones(*)")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("proposals").insert({
        project_id: projectId,
        title: `Proposal — ${project.name}`,
        client_display_name: project.clients?.name ?? null,
        founder_name: project.founder_name,
        founder_title: project.founder_title,
        status: "draft",
        total: 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-proposal", projectId] });
      toast.success("Proposal created");
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (proposalQ.isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  const proposal = proposalQ.data as any;

  if (!proposal) {
    return (
      <div className="border border-border bg-card p-12 text-center">
        <p className="label-tag text-muted-foreground">No proposal yet</p>
        <h3 className="font-display mt-3 text-2xl">Create proposal</h3>
        <button
          onClick={() => create.mutate()}
          disabled={create.isPending}
          className="mt-6 inline-flex items-center gap-2 bg-foreground px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-background hover:bg-[var(--brass-dark)] disabled:opacity-60"
        >
          {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          <Plus className="h-3.5 w-3.5" /> New proposal
        </button>
      </div>
    );
  }

  return <ProposalForm proposal={proposal} />;
}

function ProposalForm({ proposal }: { proposal: any }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: proposal.title ?? "",
    client_display_name: proposal.client_display_name ?? "",
    scope: proposal.scope ?? "",
    terms: proposal.terms ?? "",
    currency: proposal.currency ?? "EUR",
    founder_name: proposal.founder_name ?? "",
    founder_title: proposal.founder_title ?? "",
    status: proposal.status ?? "draft",
  });

  const items = (proposal.proposal_items ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order);
  const milestones = (proposal.proposal_milestones ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order);
  const total = items.reduce((s: number, i: any) => s + Number(i.subtotal || 0), 0);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("proposals")
        .update({ ...form, total })
        .eq("id", proposal.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-proposal", proposal.project_id] });
      toast.success("Proposal saved");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const addItem = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("proposal_items").insert({
        proposal_id: proposal.id,
        name: "New service",
        qty: 1,
        unit_price: 0,
        subtotal: 0,
        sort_order: items.length,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-proposal", proposal.project_id] }),
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: any }) => {
      const { error } = await supabase.from("proposal_items").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-proposal", proposal.project_id] }),
  });

  const delItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("proposal_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-proposal", proposal.project_id] }),
  });

  const addMilestone = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("proposal_milestones").insert({
        proposal_id: proposal.id,
        title: "New phase",
        sort_order: milestones.length,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-proposal", proposal.project_id] }),
  });

  const updateMilestone = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: any }) => {
      const { error } = await supabase.from("proposal_milestones").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-proposal", proposal.project_id] }),
  });

  const delMilestone = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("proposal_milestones").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-proposal", proposal.project_id] }),
  });

  return (
    <div className="space-y-8">
      <div className="border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl">Header</h3>
          <button
            onClick={() => save.mutate()}
            disabled={save.isPending}
            className="inline-flex items-center gap-2 bg-foreground px-4 py-2 text-xs uppercase tracking-[0.2em] text-background hover:bg-[var(--brass-dark)] disabled:opacity-60"
          >
            {save.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save
          </button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
          </Field>
          <Field label="Client display name">
            <input value={form.client_display_name} onChange={(e) => setForm({ ...form, client_display_name: e.target.value })} className="input" />
          </Field>
          <Field label="Currency">
            <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="input">
              {["EUR", "USD", "GBP"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input">
              {["draft", "sent", "accepted", "declined"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Founder name">
            <input value={form.founder_name} onChange={(e) => setForm({ ...form, founder_name: e.target.value })} className="input" />
          </Field>
          <Field label="Founder title">
            <input value={form.founder_title} onChange={(e) => setForm({ ...form, founder_title: e.target.value })} className="input" />
          </Field>
        </div>
        <Field label="Scope & deliverables">
          <textarea rows={5} value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} className="input" />
        </Field>
        <Field label="Terms">
          <textarea rows={4} value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} className="input" />
        </Field>
      </div>

      {/* Line items */}
      <div className="border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl">Line items</h3>
          <button
            onClick={() => addItem.mutate()}
            className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-[0.2em] hover:bg-secondary"
          >
            <Plus className="h-3 w-3" /> Add item
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {items.map((it: any) => (
            <div key={it.id} className="grid grid-cols-12 items-center gap-2 border border-border p-3">
              <input
                defaultValue={it.name}
                onBlur={(e) => updateItem.mutate({ id: it.id, patch: { name: e.target.value } })}
                className="input col-span-4"
                placeholder="Service name"
              />
              <input
                defaultValue={it.description ?? ""}
                onBlur={(e) => updateItem.mutate({ id: it.id, patch: { description: e.target.value } })}
                className="input col-span-3"
                placeholder="Description"
              />
              <input
                type="number"
                step="0.01"
                defaultValue={it.qty}
                onBlur={(e) => {
                  const qty = Number(e.target.value);
                  updateItem.mutate({ id: it.id, patch: { qty, subtotal: qty * Number(it.unit_price) } });
                }}
                className="input col-span-1"
              />
              <input
                type="number"
                step="0.01"
                defaultValue={it.unit_price}
                onBlur={(e) => {
                  const unit_price = Number(e.target.value);
                  updateItem.mutate({ id: it.id, patch: { unit_price, subtotal: Number(it.qty) * unit_price } });
                }}
                className="input col-span-2"
              />
              <div className="col-span-1 text-right text-sm">{Number(it.subtotal).toFixed(2)}</div>
              <button onClick={() => delItem.mutate(it.id)} className="col-span-1 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div className="flex justify-end pt-2 text-sm">
            <span className="text-muted-foreground">Total: </span>
            <span className="ml-2 font-display text-xl">{total.toFixed(2)} {form.currency}</span>
          </div>
        </div>
      </div>

      {/* Timeline milestones */}
      <div className="border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl">Timeline phases</h3>
          <button
            onClick={() => addMilestone.mutate()}
            className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-[0.2em] hover:bg-secondary"
          >
            <Plus className="h-3 w-3" /> Add phase
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {milestones.map((m: any) => (
            <div key={m.id} className="grid grid-cols-12 items-start gap-2 border border-border p-3">
              <input
                defaultValue={m.title}
                onBlur={(e) => updateMilestone.mutate({ id: m.id, patch: { title: e.target.value } })}
                className="input col-span-4"
              />
              <input
                type="date"
                defaultValue={m.target_date ?? ""}
                onBlur={(e) => updateMilestone.mutate({ id: m.id, patch: { target_date: e.target.value || null } })}
                className="input col-span-3"
              />
              <input
                defaultValue={m.description ?? ""}
                onBlur={(e) => updateMilestone.mutate({ id: m.id, patch: { description: e.target.value } })}
                className="input col-span-4"
                placeholder="Description"
              />
              <button onClick={() => delMilestone.mutate(m.id)} className="col-span-1 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────── MILESTONES (PROGRESS) ──────────────────────────── */

function MilestonesEditor({ projectId }: { projectId: string }) {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin-progress-milestones", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_milestones")
        .select("*")
        .eq("project_id", projectId)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("project_milestones").insert({
        project_id: projectId,
        title: "New milestone",
        sort_order: (q.data ?? []).length,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-progress-milestones", projectId] }),
  });

  const upd = useMutation({
    mutationFn: async ({ id, patch }: any) => {
      const { error } = await supabase.from("project_milestones").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-progress-milestones", projectId] }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("project_milestones").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-progress-milestones", projectId] }),
  });

  return (
    <div className="border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl">Progress milestones</h3>
        <button
          onClick={() => add.mutate()}
          className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-[0.2em] hover:bg-secondary"
        >
          <Plus className="h-3 w-3" /> Add milestone
        </button>
      </div>
      <div className="mt-4 space-y-2">
        {(q.data ?? []).map((m: any) => (
          <div key={m.id} className="grid grid-cols-12 items-center gap-2 border border-border p-3">
            <button
              onClick={() =>
                upd.mutate({
                  id: m.id,
                  patch: { done: !m.done, done_at: !m.done ? new Date().toISOString() : null },
                })
              }
              className="col-span-1"
            >
              {m.done ? (
                <CheckCircle2 className="h-5 w-5 text-[var(--brass-dark)]" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            <input
              defaultValue={m.title}
              onBlur={(e) => upd.mutate({ id: m.id, patch: { title: e.target.value } })}
              className="input col-span-5"
            />
            <input
              defaultValue={m.description ?? ""}
              onBlur={(e) => upd.mutate({ id: m.id, patch: { description: e.target.value } })}
              className="input col-span-5"
              placeholder="Description"
            />
            <button onClick={() => del.mutate(m.id)} className="col-span-1 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {(q.data ?? []).length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">No milestones yet.</p>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────── CLIENT ACCESS ──────────────────────────── */

function ClientsAccess({ projectId, project }: { projectId: string; project: any }) {
  const qc = useQueryClient();
  const inviteFn = useServerFn(inviteClientToProject);
  const [email, setEmail] = useState(project.clients?.email ?? "");
  const [busy, setBusy] = useState(false);

  const accessQ = useQuery({
    queryKey: ["project-clients", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_clients")
        .select("*")
        .eq("project_id", projectId);
      if (error) throw error;
      return data;
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("project_clients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["project-clients", projectId] }),
  });

  async function invite() {
    if (!email) return toast.error("Email required");
    setBusy(true);
    try {
      await inviteFn({
        data: {
          email,
          projectId,
          clientId: project.client_id ?? null,
          redirectTo: `${window.location.origin}/auth`,
        },
      });
      toast.success("Invite sent. Magic link emailed.");
      qc.invalidateQueries({ queryKey: ["project-clients", projectId] });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border border-border bg-card p-6">
      <h3 className="font-display text-2xl">Who can view this project's portal</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Invite a client by email. They'll receive a magic-link sign-in to access the proposal, progress, and message thread for this project.
      </p>

      <div className="mt-6 flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="client@example.com"
          className="input flex-1"
        />
        <button
          onClick={invite}
          disabled={busy}
          className="inline-flex items-center gap-2 bg-foreground px-5 py-2 text-xs uppercase tracking-[0.2em] text-background hover:bg-[var(--brass-dark)] disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          Invite
        </button>
      </div>

      <div className="mt-8">
        <p className="label-tag text-muted-foreground">Current access</p>
        <ul className="mt-3 divide-y divide-border border border-border">
          {(accessQ.data ?? []).length === 0 && (
            <li className="p-4 text-sm text-muted-foreground">No clients invited yet.</li>
          )}
          {(accessQ.data ?? []).map((row: any) => (
            <li key={row.id} className="flex items-center justify-between p-4 text-sm">
              <span className="font-mono text-xs text-muted-foreground">{row.user_id}</span>
              <button onClick={() => remove.mutate(row.id)} className="text-xs text-muted-foreground hover:text-destructive">
                Revoke
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ──────────────────────────── MESSAGES (ADMIN) ──────────────────────────── */

function MessagesAdmin({ projectId }: { projectId: string }) {
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const messagesQ = useQuery({
    queryKey: ["admin-messages", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_messages")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesQ.data]);

  useEffect(() => {
    const channel = supabase
      .channel(`admin-msgs-${projectId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "project_messages", filter: `project_id=eq.${projectId}` },
        () => qc.invalidateQueries({ queryKey: ["admin-messages", projectId] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, qc]);

  const send = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const { error } = await supabase.from("project_messages").insert({
        project_id: projectId,
        sender_id: u.user.id,
        sender_role: "admin",
        sender_name: u.user.email,
        body: body.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => setBody(""),
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="flex h-[600px] flex-col border border-border bg-card">
      <div className="flex-1 space-y-3 overflow-y-auto p-6">
        {(messagesQ.data ?? []).map((m: any) => {
          const fromAdmin = m.sender_role === "admin";
          return (
            <div key={m.id} className={`flex ${fromAdmin ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-4 py-2.5 text-sm ${
                  fromAdmin ? "bg-foreground text-background" : "border border-border bg-background"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.body}</p>
                <p className={`mt-1 text-[10px] uppercase tracking-[0.15em] ${fromAdmin ? "text-background/60" : "text-muted-foreground"}`}>
                  {m.sender_name} · {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
        {(messagesQ.data ?? []).length === 0 && (
          <p className="text-center text-sm text-muted-foreground">No messages yet.</p>
        )}
        <div ref={endRef} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!body.trim()) return;
          send.mutate();
        }}
        className="flex gap-2 border-t border-border p-4"
      >
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Reply as PM…"
          className="input flex-1"
        />
        <button
          type="submit"
          disabled={send.isPending || !body.trim()}
          className="inline-flex items-center gap-2 bg-foreground px-4 py-2 text-xs uppercase tracking-[0.2em] text-background hover:bg-[var(--brass-dark)] disabled:opacity-60"
        >
          {send.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Send
        </button>
      </form>
    </div>
  );
}

/* helpers */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <label className="label-tag text-muted-foreground">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
