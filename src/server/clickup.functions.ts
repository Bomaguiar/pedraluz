import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  getAuthorizedTeams,
  listSpaces,
  listFolders,
  createListInSpace,
  createListInFolder,
  updateList,
  getListTasks,
  createWebhook,
  deleteWebhook,
} from "./clickup.server";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) {
    throw new Error("Admin access required");
  }
}

async function logSync(entry: {
  direction: "push" | "pull" | "webhook";
  entity_type: "client" | "list" | "task";
  entity_id?: string | null;
  clickup_id?: string | null;
  status: "success" | "error";
  payload?: any;
  error?: string | null;
}) {
  try {
    await supabaseAdmin.from("clickup_sync_log").insert(entry);
  } catch {
    // never block on logging
  }
}

// --- Test connection / list spaces ---
export const clickupTestConnection = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const teams = await getAuthorizedTeams();
    return { ok: true, teams: teams.teams };
  });

export const clickupListSpaces = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ workspaceId: z.string().min(1) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const res = await listSpaces(data.workspaceId);
    return { spaces: res.spaces };
  });

export const clickupListFolders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ spaceId: z.string().min(1) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const res = await listFolders(data.spaceId);
    return { folders: res.folders };
  });

// --- Save settings + register webhook ---
export const clickupSaveSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        workspaceId: z.string().min(1).max(100),
        spaceId: z.string().max(100).nullable().optional(),
        folderId: z.string().max(100).nullable().optional(),
        autoSync: z.boolean().default(true),
        webhookEndpoint: z.string().url().optional(),
      })
      .parse(d)
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    // Get existing settings (single row)
    const { data: existing } = await supabaseAdmin
      .from("clickup_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    let webhookId = existing?.webhook_id ?? null;

    // Re-register webhook if endpoint provided
    if (data.webhookEndpoint) {
      try {
        if (webhookId) {
          try {
            await deleteWebhook(webhookId);
          } catch {
            /* ignore stale webhook */
          }
        }
        const wh = await createWebhook(data.workspaceId, data.webhookEndpoint);
        webhookId = wh.id ?? wh.webhook?.id ?? null;
      } catch (e: any) {
        // Don't block settings save if webhook fails (token may lack scope)
        await logSync({
          direction: "push",
          entity_type: "list",
          status: "error",
          error: `Webhook setup failed: ${e.message}`,
        });
      }
    }

    const payload = {
      workspace_id: data.workspaceId,
      space_id: data.spaceId ?? null,
      folder_id: data.folderId ?? null,
      auto_sync: data.autoSync,
      webhook_id: webhookId,
    };

    if (existing) {
      const { error } = await supabaseAdmin
        .from("clickup_settings")
        .update(payload)
        .eq("id", existing.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("clickup_settings")
        .insert(payload);
      if (error) throw new Error(error.message);
    }

    return { ok: true, webhookId };
  });

export const clickupGetSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data } = await supabaseAdmin
      .from("clickup_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    return { settings: data };
  });

// --- Create a List for a client ---
export const clickupCreateClientList = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ clientId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    const { data: settings } = await supabaseAdmin
      .from("clickup_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (!settings) throw new Error("Configure ClickUp settings first");

    const { data: client, error: clientErr } = await supabaseAdmin
      .from("clients")
      .select("*")
      .eq("id", data.clientId)
      .maybeSingle();
    if (clientErr || !client) throw new Error("Client not found");
    if (client.clickup_list_id) {
      return { ok: true, listId: client.clickup_list_id, alreadyLinked: true };
    }

    const listName = client.company
      ? `${client.name} — ${client.company}`
      : client.name;
    const content = [
      client.email ? `Email: ${client.email}` : null,
      client.phone ? `Phone: ${client.phone}` : null,
      client.service_type ? `Service: ${client.service_type}` : null,
      client.notes ? `\n${client.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    let created;
    try {
      if (settings.folder_id) {
        created = await createListInFolder(settings.folder_id, listName, content);
      } else if (settings.space_id) {
        created = await createListInSpace(settings.space_id, listName, content);
      } else {
        throw new Error("ClickUp space or folder not configured");
      }
    } catch (e: any) {
      await logSync({
        direction: "push",
        entity_type: "client",
        entity_id: client.id,
        status: "error",
        error: e.message,
      });
      throw e;
    }

    await supabaseAdmin
      .from("clients")
      .update({ clickup_list_id: created.id })
      .eq("id", client.id);

    await logSync({
      direction: "push",
      entity_type: "client",
      entity_id: client.id,
      clickup_id: created.id,
      status: "success",
      payload: { name: listName },
    });

    return { ok: true, listId: created.id };
  });

// --- Pull tasks for a client's list ---
export const clickupGetClientTasks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ clientId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    const { data: client } = await supabaseAdmin
      .from("clients")
      .select("clickup_list_id")
      .eq("id", data.clientId)
      .maybeSingle();
    if (!client?.clickup_list_id) return { tasks: [] };

    try {
      const res = await getListTasks(client.clickup_list_id);
      const tasks = (res.tasks || []).map((t: any) => ({
        id: t.id,
        name: t.name,
        status: t.status?.status ?? null,
        statusColor: t.status?.color ?? null,
        url: t.url,
        dueDate: t.due_date ? Number(t.due_date) : null,
        assignees: (t.assignees || []).map((a: any) => a.username),
      }));
      await logSync({
        direction: "pull",
        entity_type: "task",
        entity_id: data.clientId,
        clickup_id: client.clickup_list_id,
        status: "success",
        payload: { count: tasks.length },
      });
      return { tasks };
    } catch (e: any) {
      await logSync({
        direction: "pull",
        entity_type: "task",
        entity_id: data.clientId,
        status: "error",
        error: e.message,
      });
      throw e;
    }
  });

// --- Push client update to its ClickUp list ---
export const clickupSyncClient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ clientId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    const { data: client } = await supabaseAdmin
      .from("clients")
      .select("*")
      .eq("id", data.clientId)
      .maybeSingle();
    if (!client) throw new Error("Client not found");
    if (!client.clickup_list_id) throw new Error("Client has no linked ClickUp List");

    const listName = client.company
      ? `${client.name} — ${client.company}`
      : client.name;
    const content = [
      client.email ? `Email: ${client.email}` : null,
      client.phone ? `Phone: ${client.phone}` : null,
      client.service_type ? `Service: ${client.service_type}` : null,
      `Status: ${client.status}`,
      client.notes ? `\n${client.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    await updateList(client.clickup_list_id, { name: listName, content });
    await logSync({
      direction: "push",
      entity_type: "client",
      entity_id: client.id,
      clickup_id: client.clickup_list_id,
      status: "success",
    });
    return { ok: true };
  });
