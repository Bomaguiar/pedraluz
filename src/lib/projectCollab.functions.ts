import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const AskInput = z.object({
  projectId: z.string().uuid(),
  question: z.string().min(1).max(2000),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .max(20)
    .optional(),
});

export const askProjectBot = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => AskInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    // Pull project context (relies on RLS — admin or assigned client can read)
    const [project, scope, checklist, docs, updates, knowledge] = await Promise.all([
      supabase.from("projects").select("name, address, stage, service_type, due_date, notes, founder_name").eq("id", data.projectId).maybeSingle(),
      supabase.from("project_scope").select("client_needs, internal_notes").eq("project_id", data.projectId).maybeSingle(),
      supabase.from("project_checklist_items").select("title, description, category, done, requires_client_signoff, client_signed_off").eq("project_id", data.projectId).order("sort_order"),
      supabase.from("project_documents").select("title, description, kind, external_url, awaiting_signoff, client_signed_off").eq("project_id", data.projectId).order("created_at", { ascending: false }),
      supabase.from("project_updates").select("title, body, created_at").eq("project_id", data.projectId).order("created_at", { ascending: false }).limit(20),
      supabase.from("project_knowledge").select("content, source").eq("project_id", data.projectId).order("created_at", { ascending: false }).limit(50),
    ]);

    if (!project.data) throw new Error("Project not found or access denied");

    const ctx = {
      project: project.data,
      scope: scope.data,
      checklist: checklist.data ?? [],
      documents: docs.data ?? [],
      recent_updates: updates.data ?? [],
      knowledge: (knowledge.data ?? []).map((k) => k.content),
    };

    const systemPrompt = `You are the Pedra Luz project support assistant. You help the team and the client understand the status of a specific renovation/architecture project. Be concise, accurate, and reference the project's actual data. If the answer isn't in the provided context, say so.

PROJECT CONTEXT (JSON):
${JSON.stringify(ctx, null, 2)}`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(data.history ?? []),
      { role: "user", content: data.question },
    ];

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
      }),
    });

    if (res.status === 429) throw new Error("Rate limit hit. Try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in workspace settings.");
    if (!res.ok) throw new Error(`AI gateway error: ${res.status}`);

    const json = await res.json();
    const answer: string = json.choices?.[0]?.message?.content ?? "(no response)";
    return { answer };
  });

/* ─────────── Google Docs sync ─────────── */

const SyncInput = z.object({ documentId: z.string().uuid() });

function extractDocId(url: string): string | null {
  const m = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

type GDocElement = {
  paragraph?: {
    elements?: Array<{ textRun?: { content?: string } }>;
  };
  table?: {
    tableRows?: Array<{
      tableCells?: Array<{ content?: GDocElement[] }>;
    }>;
  };
};

function extractText(content: GDocElement[] | undefined): string {
  if (!content) return "";
  let out = "";
  for (const el of content) {
    if (el.paragraph?.elements) {
      for (const e of el.paragraph.elements) {
        if (e.textRun?.content) out += e.textRun.content;
      }
    } else if (el.table?.tableRows) {
      for (const row of el.table.tableRows) {
        for (const cell of row.tableCells ?? []) {
          out += extractText(cell.content);
        }
      }
    }
  }
  return out;
}

export const syncGoogleDoc = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SyncInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const lovableKey = process.env.LOVABLE_API_KEY;
    const gdocsKey = process.env.GOOGLE_DOCS_API_KEY;
    if (!lovableKey || !gdocsKey) throw new Error("Google Docs connector not configured");

    const { data: doc, error } = await supabase
      .from("project_documents")
      .select("id, project_id, title, external_url")
      .eq("id", data.documentId)
      .maybeSingle();
    if (error) throw error;
    if (!doc) throw new Error("Document not found or access denied");
    if (!doc.external_url) throw new Error("Document has no Google Doc URL");

    const docId = extractDocId(doc.external_url);
    if (!docId) throw new Error("Could not parse Google Doc ID from URL");

    const res = await fetch(`https://connector-gateway.lovable.dev/google_docs/v1/documents/${docId}`, {
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": gdocsKey,
      },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Google Docs fetch failed (${res.status}): ${body.slice(0, 200)}`);
    }
    const json: { title?: string; body?: { content?: GDocElement[] } } = await res.json();
    const text = extractText(json.body?.content).trim();
    if (!text) throw new Error("Document is empty");

    // Replace prior synced content for this document
    const marker = `[GDOC:${doc.id}]`;
    await supabase
      .from("project_knowledge")
      .delete()
      .eq("project_id", doc.project_id)
      .like("content", `${marker}%`);

    const content = `${marker} ${json.title ?? doc.title}\n\n${text}`.slice(0, 50000);
    const { error: insErr } = await supabase.from("project_knowledge").insert({
      project_id: doc.project_id,
      source: "google_doc",
      content,
    });
    if (insErr) throw insErr;

    return { ok: true, chars: text.length };
  });
