// Server-only ClickUp API helper. Uses the Personal API token from env.
// Never import this from client code.

const CLICKUP_API = "https://api.clickup.com/api/v2";

function token() {
  const t = process.env.CLICKUP_API_TOKEN;
  if (!t) throw new Error("CLICKUP_API_TOKEN is not configured");
  return t;
}

export async function clickupFetch<T = any>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${CLICKUP_API}${path}`, {
    ...init,
    headers: {
      Authorization: token(),
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let body: any;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    const msg =
      (body && (body.err || body.error || body.message)) ||
      `ClickUp API ${res.status}`;
    throw new Error(`ClickUp [${res.status}]: ${msg}`);
  }
  return body as T;
}

// --- Workspace & Spaces ---
export async function listSpaces(workspaceId: string) {
  return clickupFetch<{ spaces: { id: string; name: string }[] }>(
    `/team/${workspaceId}/space?archived=false`
  );
}

export async function listFolders(spaceId: string) {
  return clickupFetch<{ folders: { id: string; name: string }[] }>(
    `/space/${spaceId}/folder?archived=false`
  );
}

export async function getAuthorizedTeams() {
  return clickupFetch<{ teams: { id: string; name: string }[] }>(`/team`);
}

// --- Lists ---
export async function createListInSpace(
  spaceId: string,
  name: string,
  content?: string
) {
  return clickupFetch<{ id: string; name: string }>(
    `/space/${spaceId}/list`,
    {
      method: "POST",
      body: JSON.stringify({ name, content: content ?? "" }),
    }
  );
}

export async function createListInFolder(
  folderId: string,
  name: string,
  content?: string
) {
  return clickupFetch<{ id: string; name: string }>(
    `/folder/${folderId}/list`,
    {
      method: "POST",
      body: JSON.stringify({ name, content: content ?? "" }),
    }
  );
}

export async function updateList(listId: string, payload: Record<string, any>) {
  return clickupFetch(`/list/${listId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getListTasks(listId: string) {
  return clickupFetch<{ tasks: any[] }>(
    `/list/${listId}/task?archived=false&subtasks=true&include_closed=true`
  );
}

// --- Webhooks ---
export async function createWebhook(
  workspaceId: string,
  endpoint: string,
  events: string[] = [
    "taskCreated",
    "taskUpdated",
    "taskDeleted",
    "taskStatusUpdated",
    "listCreated",
    "listUpdated",
  ]
) {
  return clickupFetch<{ id: string; webhook: { id: string; secret: string } }>(
    `/team/${workspaceId}/webhook`,
    {
      method: "POST",
      body: JSON.stringify({ endpoint, events }),
    }
  );
}

export async function deleteWebhook(webhookId: string) {
  return clickupFetch(`/webhook/${webhookId}`, { method: "DELETE" });
}
