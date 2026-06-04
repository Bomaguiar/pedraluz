import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { askProjectBot } from "@/server/projectCollab.functions";
import { FileText, Image as ImageIcon, CheckCircle2, Circle, Bot, Send, Loader2, ExternalLink } from "lucide-react";

export function PortalScope({ projectId }: { projectId: string }) {
  const scopeQ = useQuery({
    queryKey: ["portal-scope", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_scope")
        .select("client_needs")
        .eq("project_id", projectId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const checklistQ = useQuery({
    queryKey: ["portal-checklist", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_checklist_items")
        .select("*")
        .eq("project_id", projectId)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
  const qc = useQueryClient();
  const [signName, setSignName] = useState("");

  const signOff = useMutation({
    mutationFn: async (id: string) => {
      if (!signName.trim()) throw new Error("Enter your name to sign off");
      const { error } = await supabase
        .from("project_checklist_items")
        .update({
          client_signed_off: true,
          client_signed_off_at: new Date().toISOString(),
          signed_off_by_name: signName,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["portal-checklist", projectId] });
      toast.success("Signed off");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="border border-border bg-card p-6">
        <h3 className="font-display text-2xl">Scope of work</h3>
        <p className="mt-3 whitespace-pre-wrap text-sm">
          {scopeQ.data?.client_needs || "Scope will be shared shortly."}
        </p>
      </div>
      <div className="border border-border bg-card p-6">
        <h3 className="font-display text-2xl">Renovation checklist</h3>
        <input
          value={signName}
          onChange={(e) => setSignName(e.target.value)}
          placeholder="Your full name (for sign-off)"
          className="mt-3 w-full max-w-sm border border-input bg-background px-3 py-2 text-sm"
        />
        <div className="mt-4 space-y-2">
          {(checklistQ.data ?? []).map((it: any) => (
            <div key={it.id} className="flex items-start gap-3 border border-border p-3">
              {it.done ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-[var(--brass-dark)]" />
              ) : (
                <Circle className="mt-0.5 h-5 w-5 text-muted-foreground" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{it.title}</p>
                {it.description && <p className="mt-1 text-xs text-muted-foreground">{it.description}</p>}
                {it.category && <p className="label-tag mt-1 text-muted-foreground">{it.category}</p>}
                {it.client_signed_off && (
                  <p className="mt-1 text-xs text-[var(--brass-dark)]">
                    ✓ Signed off by {it.signed_off_by_name} on {new Date(it.client_signed_off_at).toLocaleDateString()}
                  </p>
                )}
                {it.requires_client_signoff && !it.client_signed_off && (
                  <button
                    onClick={() => signOff.mutate(it.id)}
                    className="mt-2 inline-flex items-center gap-2 bg-foreground px-3 py-1.5 text-[11px] uppercase tracking-wider text-background hover:bg-[var(--brass-dark)]"
                  >
                    I approve
                  </button>
                )}
              </div>
            </div>
          ))}
          {(checklistQ.data ?? []).length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">No tasks yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function PortalDocuments({ projectId }: { projectId: string }) {
  const qc = useQueryClient();
  const docsQ = useQuery({
    queryKey: ["portal-docs", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_documents")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const [signName, setSignName] = useState("");

  const signOff = useMutation({
    mutationFn: async (id: string) => {
      if (!signName.trim()) throw new Error("Enter your name to sign off");
      const { error } = await supabase
        .from("project_documents")
        .update({
          client_signed_off: true,
          client_signed_off_at: new Date().toISOString(),
          signed_off_by_name: signName,
          awaiting_signoff: false,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["portal-docs", projectId] });
      toast.success("Signed off");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <input
        value={signName}
        onChange={(e) => setSignName(e.target.value)}
        placeholder="Your full name (for sign-off)"
        className="w-full max-w-sm border border-input bg-background px-3 py-2 text-sm"
      />
      {(docsQ.data ?? []).map((d: any) => (
        <div key={d.id} className="flex items-start gap-4 border border-border bg-card p-5">
          <div className="mt-1 text-muted-foreground">
            {d.kind === "photo" ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
          </div>
          <div className="flex-1">
            <a
              href={d.external_url || d.file_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-display text-lg hover:text-[var(--brass-dark)]"
            >
              {d.title} <ExternalLink className="h-3.5 w-3.5" />
            </a>
            {d.description && <p className="mt-1 text-sm text-muted-foreground">{d.description}</p>}
            {d.client_signed_off ? (
              <p className="mt-2 text-xs text-[var(--brass-dark)]">
                ✓ Signed off by {d.signed_off_by_name} on {new Date(d.client_signed_off_at).toLocaleDateString()}
              </p>
            ) : d.awaiting_signoff ? (
              <button
                onClick={() => signOff.mutate(d.id)}
                className="mt-2 inline-flex items-center gap-2 bg-foreground px-3 py-1.5 text-[11px] uppercase tracking-wider text-background hover:bg-[var(--brass-dark)]"
              >
                Confirm & sign off
              </button>
            ) : null}
          </div>
        </div>
      ))}
      {(docsQ.data ?? []).length === 0 && (
        <p className="border border-border bg-card p-6 text-center text-sm text-muted-foreground">No documents shared yet.</p>
      )}
    </div>
  );
}

export function PortalUpdates({ projectId }: { projectId: string }) {
  const updatesQ = useQuery({
    queryKey: ["portal-updates", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_updates")
        .select("*, project_update_photos(*)")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  return (
    <div className="space-y-4">
      {(updatesQ.data ?? []).map((u: any) => (
        <div key={u.id} className="border border-border bg-card p-5">
          <p className="label-tag text-muted-foreground">{new Date(u.created_at).toLocaleString()}</p>
          <h4 className="font-display mt-2 text-2xl">{u.title}</h4>
          {u.body && <p className="mt-2 whitespace-pre-wrap text-sm">{u.body}</p>}
          {u.project_update_photos?.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {u.project_update_photos.map((p: any) => (
                <a key={p.id} href={p.photo_url} target="_blank" rel="noreferrer">
                  <img src={p.photo_url} alt="" className="aspect-square w-full object-cover" />
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
      {(updatesQ.data ?? []).length === 0 && (
        <p className="border border-border bg-card p-6 text-center text-sm text-muted-foreground">No updates yet.</p>
      )}
    </div>
  );
}

export function PortalBot({ projectId }: { projectId: string }) {
  const ask = useServerFn(askProjectBot);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const q = input.trim();
    const next = [...messages, { role: "user" as const, content: q }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await ask({ data: { projectId, question: q, history: messages } });
      setMessages([...next, { role: "assistant", content: res.answer }]);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-border bg-card p-6">
      <h3 className="font-display text-2xl flex items-center gap-2">
        <Bot className="h-5 w-5" /> Ask about your project
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Your project assistant knows about your scope, checklist, documents, and recent updates.
      </p>
      <div className="mt-4 max-h-96 space-y-3 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : ""}>
            <div
              className={`inline-block max-w-[85%] whitespace-pre-wrap rounded px-3 py-2 text-sm ${
                m.role === "user" ? "bg-foreground text-background" : "bg-secondary"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask a question…"
          className="flex-1 border border-input bg-background px-3 py-2 text-sm"
        />
        <button
          onClick={send}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-foreground px-4 py-2 text-xs uppercase tracking-[0.2em] text-background hover:bg-[var(--brass-dark)] disabled:opacity-60"
        >
          <Send className="h-3.5 w-3.5" /> Ask
        </button>
      </div>
    </div>
  );
}
