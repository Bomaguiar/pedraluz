import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { askProjectBot, syncGoogleDoc } from "@/lib/projectCollab.functions";
import {
  Plus,
  Trash2,
  Loader2,
  Save,
  Upload,
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Circle,
  Bot,
  Send,
  Eye,
  EyeOff,
  BookOpen,
  RefreshCw,
} from "lucide-react";

/* ─────────────── SCOPE & CHECKLIST ─────────────── */

export function ScopeChecklistAdmin({ projectId }: { projectId: string }) {
  const qc = useQueryClient();
  const scopeQ = useQuery({
    queryKey: ["admin-scope", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_scope")
        .select("*")
        .eq("project_id", projectId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const checklistQ = useQuery({
    queryKey: ["admin-checklist", projectId],
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

  const [clientNeeds, setClientNeeds] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [seeded, setSeeded] = useState(false);
  if (!seeded && scopeQ.data) {
    setClientNeeds(scopeQ.data.client_needs ?? "");
    setInternalNotes(scopeQ.data.internal_notes ?? "");
    setSeeded(true);
  }

  const saveScope = useMutation({
    mutationFn: async () => {
      const payload = { project_id: projectId, client_needs: clientNeeds, internal_notes: internalNotes };
      const { error } = await supabase
        .from("project_scope")
        .upsert(payload, { onConflict: "project_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-scope", projectId] });
      toast.success("Scope saved");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const items = checklistQ.data ?? [];

  const addItem = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("project_checklist_items").insert({
        project_id: projectId,
        title: "New task",
        sort_order: items.length,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-checklist", projectId] }),
    onError: (e: any) => toast.error(e.message),
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: any }) => {
      const { error } = await supabase.from("project_checklist_items").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-checklist", projectId] }),
  });

  const delItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("project_checklist_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-checklist", projectId] }),
  });

  return (
    <div className="space-y-8">
      <div className="border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl">Scope</h3>
          <button
            onClick={() => saveScope.mutate()}
            disabled={saveScope.isPending}
            className="inline-flex items-center gap-2 bg-foreground px-4 py-2 text-xs uppercase tracking-[0.2em] text-background hover:bg-[var(--brass-dark)] disabled:opacity-60"
          >
            {saveScope.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save
          </button>
        </div>
        <label className="label-tag mt-4 block text-muted-foreground">What the client needs (visible to client)</label>
        <textarea
          value={clientNeeds}
          onChange={(e) => setClientNeeds(e.target.value)}
          rows={6}
          className="mt-2 w-full border border-input bg-background px-3 py-2 text-sm"
          placeholder="Describe the client's goals, must-haves, style preferences, scope of renovation…"
        />
        <label className="label-tag mt-4 block text-muted-foreground">Internal notes (private)</label>
        <textarea
          value={internalNotes}
          onChange={(e) => setInternalNotes(e.target.value)}
          rows={4}
          className="mt-2 w-full border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl">Renovation checklist</h3>
          <button
            onClick={() => addItem.mutate()}
            className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-[0.2em] hover:bg-secondary"
          >
            <Plus className="h-3 w-3" /> Add task
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {items.map((it: any) => (
            <div key={it.id} className="grid grid-cols-12 items-center gap-2 border border-border p-3">
              <button
                onClick={() => updateItem.mutate({ id: it.id, patch: { done: !it.done, done_at: !it.done ? new Date().toISOString() : null } })}
                className="col-span-1"
              >
                {it.done ? <CheckCircle2 className="h-5 w-5 text-[var(--brass-dark)]" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
              </button>
              <input
                defaultValue={it.title}
                onBlur={(e) => updateItem.mutate({ id: it.id, patch: { title: e.target.value } })}
                className="input col-span-4"
              />
              <input
                defaultValue={it.category ?? ""}
                placeholder="Category"
                onBlur={(e) => updateItem.mutate({ id: it.id, patch: { category: e.target.value || null } })}
                className="input col-span-2"
              />
              <input
                defaultValue={it.description ?? ""}
                placeholder="Description"
                onBlur={(e) => updateItem.mutate({ id: it.id, patch: { description: e.target.value } })}
                className="input col-span-3"
              />
              <label className="col-span-1 flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                <input
                  type="checkbox"
                  defaultChecked={it.requires_client_signoff}
                  onChange={(e) => updateItem.mutate({ id: it.id, patch: { requires_client_signoff: e.target.checked } })}
                />
                Sign-off
              </label>
              <button onClick={() => delItem.mutate(it.id)} className="col-span-1 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
              {it.client_signed_off && (
                <p className="col-span-12 text-xs text-[var(--brass-dark)]">
                  ✓ Signed off by {it.signed_off_by_name} on {new Date(it.client_signed_off_at).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
          {items.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No tasks yet.</p>}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── DOCUMENTS ─────────────── */

export function DocumentsAdmin({ projectId }: { projectId: string }) {
  const qc = useQueryClient();
  const docsQ = useQuery({
    queryKey: ["admin-docs", projectId],
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

  const [gdocUrl, setGdocUrl] = useState("");
  const [gdocTitle, setGdocTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  const addGoogleDoc = useMutation({
    mutationFn: async () => {
      if (!gdocUrl.trim() || !gdocTitle.trim()) throw new Error("Title and URL required");
      const { error } = await supabase.from("project_documents").insert({
        project_id: projectId,
        title: gdocTitle,
        external_url: gdocUrl,
        kind: "google_doc",
        mime_type: "application/vnd.google-apps.document",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-docs", projectId] });
      setGdocUrl("");
      setGdocTitle("");
      toast.success("Google Doc linked");
    },
    onError: (e: any) => toast.error(e.message),
  });

  async function uploadFile(file: File) {
    setUploading(true);
    try {
      const path = `${projectId}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("project-files").upload(path, file);
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("project-files").getPublicUrl(path);
      const isImage = file.type.startsWith("image/");
      const { error } = await supabase.from("project_documents").insert({
        project_id: projectId,
        title: file.name,
        file_url: pub.publicUrl,
        mime_type: file.type,
        kind: isImage ? "photo" : "document",
      });
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["admin-docs", projectId] });
      toast.success("Uploaded");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  }

  const updateDoc = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: any }) => {
      const { error } = await supabase.from("project_documents").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-docs", projectId] }),
  });

  const delDoc = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("project_documents").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-docs", projectId] }),
  });

  const syncFn = useServerFn(syncGoogleDoc);
  const syncDoc = useMutation({
    mutationFn: async (documentId: string) => syncFn({ data: { documentId } }),
    onSuccess: (r: any) => {
      toast.success(`Synced ${r?.chars ?? 0} chars into the bot's knowledge`);
      qc.invalidateQueries({ queryKey: ["admin-knowledge", projectId] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 border border-border bg-card p-6 sm:grid-cols-2">
        <div>
          <h4 className="label-tag text-muted-foreground">Upload file or photo</h4>
          <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 border border-dashed border-border px-4 py-6 text-sm hover:bg-secondary">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Uploading…" : "Choose file"}
            <input
              type="file"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFile(f);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        <div>
          <h4 className="label-tag text-muted-foreground">Link a Google Doc</h4>
          <input
            value={gdocTitle}
            onChange={(e) => setGdocTitle(e.target.value)}
            placeholder="Title"
            className="mt-3 w-full border border-input bg-background px-3 py-2 text-sm"
          />
          <input
            value={gdocUrl}
            onChange={(e) => setGdocUrl(e.target.value)}
            placeholder="https://docs.google.com/document/d/…"
            className="mt-2 w-full border border-input bg-background px-3 py-2 text-sm"
          />
          <button
            onClick={() => addGoogleDoc.mutate()}
            disabled={addGoogleDoc.isPending}
            className="mt-2 inline-flex items-center gap-2 bg-foreground px-4 py-2 text-xs uppercase tracking-[0.2em] text-background hover:bg-[var(--brass-dark)] disabled:opacity-60"
          >
            <LinkIcon className="h-3 w-3" /> Link doc
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {(docsQ.data ?? []).map((d: any) => (
          <div key={d.id} className="flex items-start gap-4 border border-border bg-card p-4">
            <div className="mt-1 text-muted-foreground">
              {d.kind === "photo" ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <a
                  href={d.external_url || d.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-display text-lg hover:text-[var(--brass-dark)]"
                >
                  {d.title}
                </a>
                <span className="label-tag text-muted-foreground">{d.kind}</span>
              </div>
              {d.description && <p className="mt-1 text-sm text-muted-foreground">{d.description}</p>}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                <button
                  onClick={() => updateDoc.mutate({ id: d.id, patch: { visible_to_client: !d.visible_to_client } })}
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                >
                  {d.visible_to_client ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  {d.visible_to_client ? "Visible to client" : "Hidden"}
                </button>
                <label className="inline-flex items-center gap-1 text-muted-foreground">
                  <input
                    type="checkbox"
                    defaultChecked={d.awaiting_signoff}
                    onChange={(e) => updateDoc.mutate({ id: d.id, patch: { awaiting_signoff: e.target.checked } })}
                  />
                  Awaiting sign-off
                </label>
                {d.client_signed_off && (
                  <span className="text-[var(--brass-dark)]">
                    ✓ Signed by {d.signed_off_by_name} on {new Date(d.client_signed_off_at).toLocaleDateString()}
                  </span>
                )}
                {d.kind === "google_doc" && d.external_url && (
                  <button
                    onClick={() => syncDoc.mutate(d.id)}
                    disabled={syncDoc.isPending && syncDoc.variables === d.id}
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground disabled:opacity-60"
                    title="Fetch the Google Doc text so the project bot can read it"
                  >
                    {syncDoc.isPending && syncDoc.variables === d.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3 w-3" />
                    )}
                    Sync content
                  </button>
                )}
              </div>
            </div>
            <button onClick={() => delDoc.mutate(d.id)} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {(docsQ.data ?? []).length === 0 && (
          <p className="border border-border bg-card p-6 text-center text-sm text-muted-foreground">No documents yet.</p>
        )}
      </div>
    </div>
  );
}

/* ─────────────── UPDATES ─────────────── */

export function UpdatesAdmin({ projectId }: { projectId: string }) {
  const qc = useQueryClient();
  const updatesQ = useQuery({
    queryKey: ["admin-updates", projectId],
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

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [notify, setNotify] = useState(true);
  const [photos, setPhotos] = useState<File[]>([]);
  const [posting, setPosting] = useState(false);

  async function post() {
    if (!title.trim()) return toast.error("Title required");
    setPosting(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      const { data: u, error } = await supabase
        .from("project_updates")
        .insert({
          project_id: projectId,
          title,
          body,
          notify_client: notify,
          author_id: user.user?.id,
          author_name: user.user?.email,
        })
        .select()
        .single();
      if (error) throw error;
      for (let i = 0; i < photos.length; i++) {
        const f = photos[i];
        const path = `${projectId}/updates/${u.id}/${Date.now()}-${f.name}`;
        const { error: upErr } = await supabase.storage.from("project-files").upload(path, f);
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("project-files").getPublicUrl(path);
        await supabase.from("project_update_photos").insert({
          update_id: u.id,
          photo_url: pub.publicUrl,
          sort_order: i,
        });
      }
      qc.invalidateQueries({ queryKey: ["admin-updates", projectId] });
      setTitle("");
      setBody("");
      setPhotos([]);
      toast.success(notify ? "Update posted. Email notification will go out once email domain is configured." : "Update posted");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setPosting(false);
    }
  }

  const delUpdate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("project_updates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-updates", projectId] }),
  });

  return (
    <div className="space-y-6">
      <div className="border border-border bg-card p-6">
        <h3 className="font-display text-2xl">New update</h3>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="mt-4 w-full border border-input bg-background px-3 py-2 text-sm"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          placeholder="What's new on site…"
          className="mt-2 w-full border border-input bg-background px-3 py-2 text-sm"
        />
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <label className="inline-flex cursor-pointer items-center gap-2 border border-dashed border-border px-3 py-2 text-xs uppercase tracking-wider hover:bg-secondary">
            <ImageIcon className="h-3.5 w-3.5" />
            Add photos
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => setPhotos(Array.from(e.target.files ?? []))}
            />
          </label>
          {photos.length > 0 && <span className="text-xs text-muted-foreground">{photos.length} photo(s) selected</span>}
          <label className="ml-auto inline-flex items-center gap-2 text-xs text-muted-foreground">
            <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
            Notify client by email
          </label>
          <button
            onClick={post}
            disabled={posting}
            className="inline-flex items-center gap-2 bg-foreground px-4 py-2 text-xs uppercase tracking-[0.2em] text-background hover:bg-[var(--brass-dark)] disabled:opacity-60"
          >
            {posting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            Post update
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {(updatesQ.data ?? []).map((u: any) => (
          <div key={u.id} className="border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-display text-xl">{u.title}</h4>
                <p className="text-xs text-muted-foreground">
                  {new Date(u.created_at).toLocaleString()} · {u.author_name ?? "team"} {u.notify_client && "· email sent"}
                </p>
              </div>
              <button onClick={() => delUpdate.mutate(u.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {u.body && <p className="mt-2 whitespace-pre-wrap text-sm">{u.body}</p>}
            {u.project_update_photos?.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
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
    </div>
  );
}

/* ─────────────── KNOWLEDGE + BOT ─────────────── */

export function KnowledgeAdmin({ projectId }: { projectId: string }) {
  const qc = useQueryClient();
  const kQ = useQuery({
    queryKey: ["admin-knowledge", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_knowledge")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const [text, setText] = useState("");

  const add = useMutation({
    mutationFn: async () => {
      if (!text.trim()) throw new Error("Empty");
      const { data: user } = await supabase.auth.getUser();
      const { error } = await supabase.from("project_knowledge").insert({
        project_id: projectId,
        content: text,
        source: "manual",
        created_by: user.user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-knowledge", projectId] });
      setText("");
      toast.success("Added to bot knowledge");
    },
    onError: (e: any) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("project_knowledge").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-knowledge", projectId] }),
  });

  return (
    <div className="space-y-6">
      <div className="border border-border bg-card p-6">
        <h3 className="font-display text-2xl flex items-center gap-2">
          <BookOpen className="h-5 w-5" /> Bot knowledge
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Anything you add here is given to the support bot as extra context for this project. Use it for client preferences, supplier choices, on-site decisions, anything the bot should remember.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="e.g. Client prefers matte brass fittings throughout. Marble countertops sourced from Estremoz."
          className="mt-3 w-full border border-input bg-background px-3 py-2 text-sm"
        />
        <button
          onClick={() => add.mutate()}
          disabled={add.isPending}
          className="mt-2 inline-flex items-center gap-2 bg-foreground px-4 py-2 text-xs uppercase tracking-[0.2em] text-background hover:bg-[var(--brass-dark)] disabled:opacity-60"
        >
          <Plus className="h-3 w-3" /> Add entry
        </button>
      </div>
      <div className="space-y-2">
        {(kQ.data ?? []).map((k: any) => (
          <div key={k.id} className="flex items-start gap-3 border border-border bg-card p-4">
            <p className="flex-1 whitespace-pre-wrap text-sm">{k.content}</p>
            <button onClick={() => del.mutate(k.id)} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {(kQ.data ?? []).length === 0 && (
          <p className="border border-border bg-card p-6 text-center text-sm text-muted-foreground">No knowledge entries yet.</p>
        )}
      </div>

      <BotChat projectId={projectId} />
    </div>
  );
}

export function BotChat({ projectId }: { projectId: string }) {
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
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-border bg-card p-6">
      <h3 className="font-display text-2xl flex items-center gap-2">
        <Bot className="h-5 w-5" /> Ask the project bot
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        The bot knows about this project's scope, checklist, documents, recent updates, and knowledge entries.
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
          placeholder="Ask about this project…"
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
