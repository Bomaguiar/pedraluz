import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, X, Loader2, Trash2, Mail, Phone, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/dashboard/managers")({
  component: ManagersPage,
});

function ManagersPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: managers = [], isLoading } = useQuery({
    queryKey: ["managers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("project_managers").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async (payload: any) => {
      const { error } = await supabase.from("project_managers").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["managers"] });
      toast.success("Manager added");
      setOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const upd = useMutation({
    mutationFn: async ({ id, patch }: any) => {
      const { error } = await supabase.from("project_managers").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["managers"] }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("project_managers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["managers"] });
      toast.success("Removed");
    },
  });

  return (
    <div className="p-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="label-tag text-[var(--brass-dark)]">Team</p>
          <h1 className="font-display mt-2 text-4xl">Project Managers</h1>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 bg-foreground px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-background hover:bg-[var(--brass-dark)]"
        >
          <Plus className="h-3.5 w-3.5" /> New Manager
        </button>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {managers.map((m: any) => (
          <div key={m.id} className="border border-border bg-card">
            <div
              className="flex items-center gap-4 px-6 py-6 text-white"
              style={{ backgroundColor: "var(--surface-darker)" }}
            >
              {m.photo_url ? (
                <img src={m.photo_url} alt={m.name} className="h-14 w-14 rounded-full border border-[var(--brass)] object-cover" />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--brass)] text-[var(--brass)]">
                  {m.name.slice(0, 1)}
                </div>
              )}
              <div>
                <p className="font-display text-xl">{m.name}</p>
                {m.role && <p className="text-xs uppercase tracking-[0.18em] text-white/60">{m.role}</p>}
              </div>
            </div>
            <div className="space-y-3 p-5">
              <Row label="Name">
                <input className="input" defaultValue={m.name} onBlur={(e) => upd.mutate({ id: m.id, patch: { name: e.target.value } })} />
              </Row>
              <Row label="Role">
                <input className="input" defaultValue={m.role ?? ""} onBlur={(e) => upd.mutate({ id: m.id, patch: { role: e.target.value || null } })} />
              </Row>
              <Row label="Photo URL">
                <input className="input" defaultValue={m.photo_url ?? ""} onBlur={(e) => upd.mutate({ id: m.id, patch: { photo_url: e.target.value || null } })} />
              </Row>
              <Row label="Email">
                <input className="input" defaultValue={m.email ?? ""} onBlur={(e) => upd.mutate({ id: m.id, patch: { email: e.target.value || null } })} />
              </Row>
              <Row label="Phone">
                <input className="input" defaultValue={m.phone ?? ""} onBlur={(e) => upd.mutate({ id: m.id, patch: { phone: e.target.value || null } })} />
              </Row>
              <Row label="WhatsApp (with country code)">
                <input className="input" defaultValue={m.whatsapp ?? ""} onBlur={(e) => upd.mutate({ id: m.id, patch: { whatsapp: e.target.value || null } })} />
              </Row>
              <Row label="Bio">
                <textarea rows={3} className="input" defaultValue={m.bio ?? ""} onBlur={(e) => upd.mutate({ id: m.id, patch: { bio: e.target.value || null } })} />
              </Row>
              <button onClick={() => del.mutate(m.id)} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" /> Remove manager
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg border border-border bg-background p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">New Project Manager</h2>
              <button onClick={() => setOpen(false)}><X className="h-4 w-4" /></button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const payload: any = {
                  name: String(fd.get("name") || "").trim(),
                  role: String(fd.get("role") || "") || null,
                  email: String(fd.get("email") || "") || null,
                  phone: String(fd.get("phone") || "") || null,
                  whatsapp: String(fd.get("whatsapp") || "") || null,
                  photo_url: String(fd.get("photo_url") || "") || null,
                  bio: String(fd.get("bio") || "") || null,
                };
                if (!payload.name) return toast.error("Name required");
                create.mutate(payload);
              }}
              className="mt-6 space-y-3"
            >
              {[
                { name: "name", label: "Name *", required: true },
                { name: "role", label: "Role (e.g. Senior Project Manager)" },
                { name: "photo_url", label: "Photo URL" },
                { name: "email", label: "Email", type: "email" },
                { name: "phone", label: "Phone" },
                { name: "whatsapp", label: "WhatsApp" },
              ].map((f) => (
                <Row key={f.name} label={f.label}>
                  <input name={f.name} type={(f as any).type ?? "text"} required={(f as any).required} className="input" />
                </Row>
              ))}
              <Row label="Bio"><textarea name="bio" rows={3} className="input" /></Row>
              <button
                type="submit"
                disabled={create.isPending}
                className="flex w-full items-center justify-center gap-2 bg-foreground py-3 text-[11px] uppercase tracking-[0.2em] text-background hover:bg-[var(--brass-dark)] disabled:opacity-60"
              >
                {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Manager
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label-tag text-muted-foreground">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
