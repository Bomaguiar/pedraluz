import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, X, Loader2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/clients")({
  component: ClientsPage,
});

const SERVICES = ["New Home Build", "Remodeling", "Home Addition", "Commercial"];
const STATUSES = ["inquiry", "active", "on_hold", "complete", "lost"];

function ClientsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async (payload: any) => {
      const { error } = await supabase.from("clients").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["clients-summary"] });
      toast.success("Client added");
      setOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("clients").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client deleted");
    },
  });

  return (
    <div className="p-4 md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-tag text-[var(--brass-dark)]">CRM</p>
          <h1 className="font-display mt-2 text-3xl md:text-4xl">Clients</h1>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 bg-foreground px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-background hover:bg-[var(--brass-dark)]"
        >
          <Plus className="h-3.5 w-3.5" /> New Client
        </button>
      </div>

      <div className="mt-10 overflow-x-auto border border-border bg-card">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="label-tag p-4 text-muted-foreground">Name</th>
              <th className="label-tag p-4 text-muted-foreground">Company</th>
              <th className="label-tag p-4 text-muted-foreground">Service</th>
              <th className="label-tag p-4 text-muted-foreground">Source</th>
              <th className="label-tag p-4 text-muted-foreground">Status</th>
              <th className="label-tag p-4 text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Loading…</td></tr>
            )}
            {!isLoading && clients.length === 0 && (
              <tr><td colSpan={6} className="p-12 text-center text-muted-foreground">No clients yet. Add your first one.</td></tr>
            )}
            {clients.map((c: any) => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                <td className="p-4 text-foreground">
                  <div>{c.name}</div>
                  {c.email && <div className="text-xs text-muted-foreground">{c.email}</div>}
                </td>
                <td className="p-4 text-muted-foreground">{c.company || "—"}</td>
                <td className="p-4 text-muted-foreground">{c.service_type || "—"}</td>
                <td className="p-4 text-muted-foreground">{c.source || "—"}</td>
                <td className="p-4">
                  <select
                    value={c.status}
                    onChange={(e) => updateStatus.mutate({ id: c.id, status: e.target.value })}
                    className="border border-input bg-background px-2 py-1 text-xs"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => del.mutate(c.id)} className="text-xs text-muted-foreground hover:text-destructive">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg border border-border bg-background p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">New Client</h2>
              <button onClick={() => setOpen(false)}><X className="h-4 w-4" /></button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const payload = {
                  name: String(fd.get("name") || "").trim(),
                  company: String(fd.get("company") || "") || null,
                  email: String(fd.get("email") || "") || null,
                  phone: String(fd.get("phone") || "") || null,
                  service_type: String(fd.get("service_type") || "") || null,
                  source: String(fd.get("source") || "") || null,
                  notes: String(fd.get("notes") || "") || null,
                  status: "active",
                };
                if (!payload.name) return toast.error("Name required");
                create.mutate(payload);
              }}
              className="mt-6 space-y-4"
            >
              <Input label="Name *" name="name" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Company" name="company" />
                <Input label="Email" name="email" type="email" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Phone" name="phone" />
                <Select label="Source" name="source" options={["website", "referral", "direct", "partner"]} />
              </div>
              <Select label="Service Type" name="service_type" options={SERVICES} />
              <div>
                <label className="label-tag text-muted-foreground">Notes</label>
                <textarea name="notes" rows={3}
                  className="mt-2 w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-foreground" />
              </div>
              <button
                type="submit"
                disabled={create.isPending}
                className="flex w-full items-center justify-center gap-2 bg-foreground py-3 text-[11px] uppercase tracking-[0.2em] text-background hover:bg-[var(--brass-dark)] disabled:opacity-60"
              >
                {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Client
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

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div>
      <label className="label-tag text-muted-foreground">{label}</label>
      <select name={name} defaultValue=""
        className="mt-2 w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-foreground">
        <option value="">—</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
