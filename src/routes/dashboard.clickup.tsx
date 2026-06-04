import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plug, RefreshCw, CheckCircle2 } from "lucide-react";
import {
  clickupTestConnection,
  clickupListSpaces,
  clickupListFolders,
  clickupSaveSettings,
  clickupGetSettings,
} from "@/server/clickup.functions";

export const Route = createFileRoute("/dashboard/clickup")({
  head: () => ({ meta: [{ title: "ClickUp Integration — Pedra & Luz" }] }),
  component: ClickUpSettingsPage,
});

function ClickUpSettingsPage() {
  const qc = useQueryClient();
  const getSettings = useServerFn(clickupGetSettings);
  const testConn = useServerFn(clickupTestConnection);
  const listSpacesFn = useServerFn(clickupListSpaces);
  const listFoldersFn = useServerFn(clickupListFolders);
  const saveSettingsFn = useServerFn(clickupSaveSettings);

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ["clickup-settings"],
    queryFn: () => getSettings(),
  });
  const settings = settingsData?.settings;

  const [workspaceId, setWorkspaceId] = useState("");
  const [spaceId, setSpaceId] = useState<string>("");
  const [folderId, setFolderId] = useState<string>("");
  const [autoSync, setAutoSync] = useState(true);

  useEffect(() => {
    if (settings) {
      setWorkspaceId(settings.workspace_id ?? "");
      setSpaceId(settings.space_id ?? "");
      setFolderId(settings.folder_id ?? "");
      setAutoSync(settings.auto_sync ?? true);
    }
  }, [settings]);

  const test = useMutation({
    mutationFn: () => testConn(),
    onSuccess: (r) => toast.success(`Connected. ${r.teams.length} workspace(s) found.`),
    onError: (e: any) => toast.error(e.message),
  });

  const spacesQ = useQuery({
    queryKey: ["clickup-spaces", workspaceId],
    queryFn: () => listSpacesFn({ data: { workspaceId } }),
    enabled: !!workspaceId,
  });

  const foldersQ = useQuery({
    queryKey: ["clickup-folders", spaceId],
    queryFn: () => listFoldersFn({ data: { spaceId } }),
    enabled: !!spaceId,
  });

  const save = useMutation({
    mutationFn: () => {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      return saveSettingsFn({
        data: {
          workspaceId,
          spaceId: spaceId || null,
          folderId: folderId || null,
          autoSync,
          webhookEndpoint: origin
            ? `${origin}/api/public/clickup-webhook`
            : undefined,
        },
      });
    },
    onSuccess: (r) => {
      toast.success(
        r.webhookId
          ? "Settings saved & webhook registered"
          : "Settings saved (webhook not registered — check token scope)"
      );
      qc.invalidateQueries({ queryKey: ["clickup-settings"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="p-4 md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-tag text-[var(--brass-dark)]">Integrations</p>
          <h1 className="font-display mt-2 text-3xl md:text-4xl">ClickUp</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Two-way sync of <strong>Clients → ClickUp Lists</strong>. Each new client becomes a List
            under your selected Space (or Folder), and ClickUp task changes flow back via webhook.
          </p>
        </div>
        <button
          type="button"
          onClick={() => test.mutate()}
          disabled={test.isPending}
          className="inline-flex items-center gap-2 border border-foreground bg-background px-5 py-3 text-[11px] uppercase tracking-[0.2em] hover:bg-foreground hover:text-background"
        >
          {test.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plug className="h-3.5 w-3.5" />
          )}
          Test Connection
        </button>
      </div>

      {isLoading ? (
        <div className="mt-12 text-sm text-muted-foreground">Loading…</div>
      ) : (
        <div className="mt-10 max-w-2xl space-y-6 border border-border bg-card p-8">
          <Field label="Workspace ID *" hint="From your ClickUp URL: app.clickup.com/{workspace_id}/…">
            <input
              value={workspaceId}
              onChange={(e) => setWorkspaceId(e.target.value.trim())}
              placeholder="e.g. 90152377591"
              className="mt-2 w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
            />
          </Field>

          <Field label="Space" hint="Where new client Lists will live">
            <select
              value={spaceId}
              onChange={(e) => {
                setSpaceId(e.target.value);
                setFolderId("");
              }}
              disabled={!workspaceId || spacesQ.isLoading}
              className="mt-2 w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
            >
              <option value="">— Select a Space —</option>
              {spacesQ.data?.spaces.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Folder (optional)" hint="If selected, Lists are created inside this Folder instead of directly in the Space">
            <select
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              disabled={!spaceId || foldersQ.isLoading}
              className="mt-2 w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
            >
              <option value="">— None (use Space directly) —</option>
              {foldersQ.data?.folders.map((f: any) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </Field>

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
              className="h-4 w-4"
            />
            <span>Auto-sync new clients to ClickUp</span>
          </label>

          <div className="border-t border-border pt-6">
            <button
              type="button"
              onClick={() => save.mutate()}
              disabled={!workspaceId || save.isPending}
              className="inline-flex items-center gap-2 bg-foreground px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-background hover:bg-[var(--brass-dark)] disabled:opacity-50"
            >
              {save.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              Save & Register Webhook
            </button>
            {settings?.webhook_id && (
              <p className="mt-3 text-xs text-muted-foreground">
                Webhook active: <code>{settings.webhook_id}</code>
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 max-w-2xl text-xs text-muted-foreground">
        <RefreshCw className="mr-1 inline h-3 w-3" />
        Webhook URL: <code>/api/public/clickup-webhook</code>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label-tag text-muted-foreground">{label}</label>
      {hint && <p className="mt-1 text-xs text-muted-foreground/80">{hint}</p>}
      {children}
    </div>
  );
}
