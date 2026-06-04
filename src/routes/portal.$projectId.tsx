import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  PortalScope,
  PortalDocuments,
  PortalUpdates,
  PortalBot,
} from "@/components/portal/PortalCollab";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  FileText,
  ListChecks,
  MessageSquare,
  Mail,
  Phone,
  Send,
  Loader2,
  Image as ImageIcon,
  Bot,
} from "lucide-react";

export const Route = createFileRoute("/portal/$projectId")({
  component: PortalProjectPage,
});

type Tab = "proposal" | "scope" | "docs" | "updates" | "bot" | "progress" | "manager";

function PortalProjectPage() {
  const { projectId } = Route.useParams();
  const [tab, setTab] = useState<Tab>("proposal");

  const project = useQuery({
    queryKey: ["portal-project", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, project_managers(*)")
        .eq("id", projectId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (project.isLoading) {
    return <div className="p-12 text-sm text-muted-foreground">Loading…</div>;
  }
  if (project.error || !project.data) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="label-tag text-muted-foreground">Not available</p>
        <h1 className="font-display mt-3 text-3xl">Project not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          You don't have access to this project, or it no longer exists.
        </p>
        <Link to="/portal" className="mt-8 inline-block text-xs uppercase tracking-[0.2em] text-[var(--brass-dark)] hover:text-foreground">
          ← Back to portal
        </Link>
      </div>
    );
  }

  const p = project.data as any;

  return (
    <div>
      {/* Breadcrumb / Project hero strip */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Link to="/portal" className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> All projects
          </Link>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="label-tag text-[var(--brass-dark)] capitalize">{p.stage}</p>
              <h1 className="font-display mt-2 text-4xl sm:text-5xl">{p.name}</h1>
              {p.address && <p className="mt-2 text-sm text-muted-foreground">{p.address}</p>}
            </div>
            {p.due_date && (
              <div className="text-right">
                <p className="label-tag text-muted-foreground">Target completion</p>
                <p className="font-display mt-1 text-2xl">{new Date(p.due_date).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[57px] z-20 border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-1 px-6">
          <TabButton active={tab === "proposal"} onClick={() => setTab("proposal")} icon={FileText} label="Proposal" />
          <TabButton active={tab === "scope"} onClick={() => setTab("scope")} icon={ListChecks} label="Scope & Checklist" />
          <TabButton active={tab === "docs"} onClick={() => setTab("docs")} icon={FileText} label="Documents" />
          <TabButton active={tab === "updates"} onClick={() => setTab("updates")} icon={ImageIcon} label="Updates" />
          <TabButton active={tab === "progress"} onClick={() => setTab("progress")} icon={ListChecks} label="Progress" />
          <TabButton active={tab === "bot"} onClick={() => setTab("bot")} icon={Bot} label="Ask" />
          <TabButton active={tab === "manager"} onClick={() => setTab("manager")} icon={MessageSquare} label="Project Manager" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {tab === "proposal" && <ProposalTab projectId={projectId} project={p} />}
        {tab === "scope" && <PortalScope projectId={projectId} />}
        {tab === "docs" && <PortalDocuments projectId={projectId} />}
        {tab === "updates" && <PortalUpdates projectId={projectId} />}
        {tab === "progress" && <ProgressTab projectId={projectId} />}
        {tab === "bot" && <PortalBot projectId={projectId} />}
        {tab === "manager" && <ManagerTab projectId={projectId} manager={p.project_managers} />}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 border-b-2 px-5 py-4 text-xs uppercase tracking-[0.2em] transition-colors ${
        active
          ? "border-[var(--brass-dark)] text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

/* ──────────────────────────── PROPOSAL ──────────────────────────── */

function ProposalTab({ projectId, project }: { projectId: string; project: any }) {
  const qc = useQueryClient();

  const proposalQ = useQuery({
    queryKey: ["portal-proposal", projectId],
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

  const [acceptName, setAcceptName] = useState("");

  const accept = useMutation({
    mutationFn: async (proposalId: string) => {
      const { error } = await supabase
        .from("proposals")
        .update({
          status: "accepted",
          accepted_at: new Date().toISOString(),
          accepted_by_name: acceptName,
        })
        .eq("id", proposalId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["portal-proposal", projectId] });
      toast.success("Proposal accepted. Thank you.");
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (proposalQ.isLoading) return <p className="text-sm text-muted-foreground">Loading proposal…</p>;
  const proposal = proposalQ.data as any;

  if (!proposal) {
    return (
      <div className="border border-border bg-card p-12 text-center">
        <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
        <h2 className="font-display mt-4 text-2xl">Proposal in preparation</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your studio team is finalizing your proposal. You'll be notified when it's ready to review.
        </p>
      </div>
    );
  }

  const items = (proposal.proposal_items ?? []).sort(
    (a: any, b: any) => a.sort_order - b.sort_order,
  );
  const milestones = (proposal.proposal_milestones ?? []).sort(
    (a: any, b: any) => a.sort_order - b.sort_order,
  );

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: proposal.currency || "EUR", maximumFractionDigits: 0 }).format(
      Number(n) || 0,
    );

  const accepted = proposal.status === "accepted";

  return (
    <article className="border border-border bg-card shadow-sm">
      {/* Cover */}
      <header
        className="relative overflow-hidden border-b border-white/10 px-10 py-16 text-white sm:px-16 sm:py-20"
        style={{ backgroundColor: "var(--surface-darker)" }}
      >
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, var(--brass) 0, transparent 40%), radial-gradient(circle at 80% 70%, var(--brass) 0, transparent 35%)",
        }} />
        <div className="relative">
          <p className="label-tag text-[var(--brass)]">Proposal</p>
          <h2 className="font-display mt-4 text-4xl leading-[1.05] sm:text-6xl">{proposal.title}</h2>
          <div className="mt-10 grid gap-6 text-sm sm:grid-cols-3">
            <Field label="Prepared for" value={proposal.client_display_name || "—"} />
            <Field label="Project" value={project.name} />
            <Field label="Status" value={proposal.status} valueClass="capitalize" />
          </div>
        </div>
      </header>

      <div className="px-10 py-12 sm:px-16">
        {/* Scope */}
        {proposal.scope && (
          <Section eyebrow="01" title="Scope & deliverables">
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">{proposal.scope}</div>
          </Section>
        )}

        {/* Pricing table */}
        <Section eyebrow="02" title="Investment">
          <div className="border-t border-border">
            <div className="grid grid-cols-12 gap-4 border-b border-border py-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <div className="col-span-7">Service</div>
              <div className="col-span-1 text-right">Qty</div>
              <div className="col-span-2 text-right">Unit</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>
            {items.length === 0 && (
              <p className="py-6 text-sm text-muted-foreground">No line items.</p>
            )}
            {items.map((item: any) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 border-b border-border py-4 text-sm">
                <div className="col-span-7">
                  <div className="font-medium text-foreground">{item.name}</div>
                  {item.description && (
                    <div className="mt-1 text-xs text-muted-foreground">{item.description}</div>
                  )}
                </div>
                <div className="col-span-1 text-right text-muted-foreground">{Number(item.qty)}</div>
                <div className="col-span-2 text-right text-muted-foreground">{fmt(item.unit_price)}</div>
                <div className="col-span-2 text-right">{fmt(item.subtotal)}</div>
              </div>
            ))}
            <div className="grid grid-cols-12 gap-4 py-5">
              <div className="col-span-10 text-right text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Total
              </div>
              <div className="col-span-2 text-right">
                <span className="font-display text-3xl">{fmt(proposal.total)}</span>
              </div>
            </div>
          </div>
        </Section>

        {/* Timeline */}
        {milestones.length > 0 && (
          <Section eyebrow="03" title="Timeline">
            <ol className="relative space-y-6 border-l border-border pl-8">
              {milestones.map((m: any, i: number) => (
                <li key={m.id} className="relative">
                  <span className="absolute -left-[37px] top-1 flex h-4 w-4 items-center justify-center rounded-full border border-[var(--brass-dark)] bg-background">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--brass-dark)]" />
                  </span>
                  <p className="label-tag text-[var(--brass-dark)]">Phase {String(i + 1).padStart(2, "0")}</p>
                  <h4 className="font-display mt-1 text-xl">{m.title}</h4>
                  {m.target_date && (
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {new Date(m.target_date).toLocaleDateString(undefined, {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                  {m.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{m.description}</p>
                  )}
                </li>
              ))}
            </ol>
          </Section>
        )}

        {/* Terms */}
        {proposal.terms && (
          <Section eyebrow="04" title="Terms">
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{proposal.terms}</div>
          </Section>
        )}

        {/* Founder signature */}
        <div className="mt-16 flex flex-wrap items-end justify-between gap-8 border-t border-border pt-10">
          <div>
            <p className="label-tag text-muted-foreground">Founder</p>
            <p className="font-display mt-3 text-3xl italic text-[var(--brass-dark)]">
              {proposal.founder_name || project.founder_name || "Pedra & Luz"}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {proposal.founder_title || project.founder_title || "Principal Architect"}
            </p>
          </div>

          {/* Accept block */}
          <div className="w-full max-w-sm border border-border bg-background p-6">
            {accepted ? (
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-[var(--brass-dark)]" />
                <p className="font-display mt-3 text-xl">Accepted</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  by {proposal.accepted_by_name} ·{" "}
                  {proposal.accepted_at ? new Date(proposal.accepted_at).toLocaleDateString() : ""}
                </p>
              </div>
            ) : (
              <>
                <p className="label-tag text-muted-foreground">Accept proposal</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  By signing, you confirm you have read and agree to the terms.
                </p>
                <input
                  type="text"
                  value={acceptName}
                  onChange={(e) => setAcceptName(e.target.value)}
                  placeholder="Type your full name"
                  className="mt-3 w-full border border-input bg-card px-3 py-2 text-sm outline-none focus:border-foreground"
                />
                <button
                  type="button"
                  disabled={!acceptName.trim() || accept.isPending}
                  onClick={() => accept.mutate(proposal.id)}
                  className="mt-3 flex w-full items-center justify-center gap-2 bg-foreground py-3 text-[11px] uppercase tracking-[0.2em] text-background hover:bg-[var(--brass-dark)] disabled:opacity-60"
                >
                  {accept.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Accept & sign
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12 first:mt-0">
      <div className="flex items-baseline gap-4">
        <span className="font-display text-xl text-[var(--brass-dark)]">{eyebrow}</span>
        <h3 className="font-display text-3xl">{title}</h3>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Field({ label, value, valueClass = "" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div>
      <p className="label-tag text-white/40">{label}</p>
      <p className={`mt-1.5 text-base text-white ${valueClass}`}>{value}</p>
    </div>
  );
}

/* ──────────────────────────── PROGRESS ──────────────────────────── */

function ProgressTab({ projectId }: { projectId: string }) {
  const milestonesQ = useQuery({
    queryKey: ["portal-milestones", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_milestones")
        .select("*")
        .eq("project_id", projectId)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  if (milestonesQ.isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  const milestones = milestonesQ.data ?? [];
  const total = milestones.length;
  const done = milestones.filter((m: any) => m.done).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div>
      <div className="border border-border bg-card p-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="label-tag text-muted-foreground">Overall completion</p>
            <p className="font-display mt-2 text-5xl">{pct}%</p>
          </div>
          <p className="text-sm text-muted-foreground">
            {done} of {total} milestones complete
          </p>
        </div>
        <div className="mt-6 h-1 w-full bg-secondary">
          <div className="h-1 bg-[var(--brass-dark)] transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-8">
        {total === 0 ? (
          <div className="border border-border bg-card p-12 text-center">
            <ListChecks className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              Milestones will appear here once your studio team sets them up.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border border border-border bg-card">
            {milestones.map((m: any) => (
              <li key={m.id} className="flex items-start gap-4 p-5">
                {m.done ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brass-dark)]" />
                ) : (
                  <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                )}
                <div className="flex-1">
                  <p className={`font-medium ${m.done ? "text-foreground" : "text-foreground"}`}>{m.title}</p>
                  {m.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
                  )}
                  {m.done && m.done_at && (
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--brass-dark)]">
                      Completed {new Date(m.done_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────── MANAGER ──────────────────────────── */

function ManagerTab({ projectId, manager }: { projectId: string; manager: any }) {
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const messagesQ = useQuery({
    queryKey: ["portal-messages", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_messages")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesQ.data]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`portal-messages-${projectId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "project_messages", filter: `project_id=eq.${projectId}` },
        () => qc.invalidateQueries({ queryKey: ["portal-messages", projectId] }),
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
        sender_role: "client",
        sender_name: u.user.email,
        body: body.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setBody("");
      qc.invalidateQueries({ queryKey: ["portal-messages", projectId] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      {/* Contact card */}
      <aside className="self-start border border-border bg-card">
        <div
          className="px-6 py-8 text-center text-white"
          style={{ backgroundColor: "var(--surface-darker)" }}
        >
          {manager?.photo_url ? (
            <img
              src={manager.photo_url}
              alt={manager.name}
              className="mx-auto h-24 w-24 rounded-full border-2 border-[var(--brass)] object-cover"
            />
          ) : (
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-[var(--brass)] text-2xl text-[var(--brass)]">
              {(manager?.name ?? "PM").slice(0, 1)}
            </div>
          )}
          <p className="label-tag mt-6 text-[var(--brass)]">Project Manager</p>
          <h3 className="font-display mt-2 text-2xl">{manager?.name ?? "Not assigned yet"}</h3>
          {manager?.role && <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/60">{manager.role}</p>}
        </div>
        {manager && (
          <div className="space-y-3 p-6">
            {manager.bio && <p className="text-sm text-muted-foreground">{manager.bio}</p>}
            {manager.email && (
              <a
                href={`mailto:${manager.email}`}
                className="flex items-center gap-3 border border-border bg-background px-4 py-3 text-sm transition-colors hover:border-foreground"
              >
                <Mail className="h-4 w-4 text-[var(--brass-dark)]" />
                <span>{manager.email}</span>
              </a>
            )}
            {manager.phone && (
              <a
                href={`tel:${manager.phone}`}
                className="flex items-center gap-3 border border-border bg-background px-4 py-3 text-sm transition-colors hover:border-foreground"
              >
                <Phone className="h-4 w-4 text-[var(--brass-dark)]" />
                <span>{manager.phone}</span>
              </a>
            )}
            {manager.whatsapp && (
              <a
                href={`https://wa.me/${manager.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 border border-border bg-background px-4 py-3 text-sm transition-colors hover:border-foreground"
              >
                <MessageSquare className="h-4 w-4 text-[var(--brass-dark)]" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        )}
      </aside>

      {/* Thread */}
      <section className="flex h-[600px] flex-col border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <p className="label-tag text-muted-foreground">Direct messages</p>
          <h3 className="font-display mt-1 text-xl">Conversation</h3>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-6">
          {messagesQ.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {messagesQ.data && messagesQ.data.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              No messages yet. Send a note to start the conversation.
            </p>
          )}
          {(messagesQ.data ?? []).map((m: any) => {
            const fromClient = m.sender_role === "client";
            return (
              <div key={m.id} className={`flex ${fromClient ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-4 py-2.5 text-sm ${
                    fromClient
                      ? "bg-foreground text-background"
                      : "border border-border bg-background text-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.body}</p>
                  <p
                    className={`mt-1 text-[10px] uppercase tracking-[0.15em] ${
                      fromClient ? "text-background/60" : "text-muted-foreground"
                    }`}
                  >
                    {new Date(m.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
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
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write a message…"
            className="flex-1 border border-input bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
            maxLength={2000}
          />
          <button
            type="submit"
            disabled={send.isPending || !body.trim()}
            className="flex items-center gap-2 bg-foreground px-4 py-2 text-xs uppercase tracking-[0.2em] text-background hover:bg-[var(--brass-dark)] disabled:opacity-60"
          >
            {send.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
