import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// ClickUp signs webhook payloads with HMAC-SHA256 using the secret returned
// when the webhook was created. They send it in the `X-Signature` header.
// We verify against CLICKUP_WEBHOOK_SECRET (set as a project secret).
export const Route = createFileRoute("/api/public/clickup-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.CLICKUP_WEBHOOK_SECRET;
        const signature = request.headers.get("x-signature");
        const body = await request.text();

        if (!secret) {
          return new Response("Server not configured", { status: 500 });
        }
        if (!signature) {
          return new Response("Missing signature", { status: 401 });
        }

        const expected = createHmac("sha256", secret).update(body).digest("hex");
        const sigBuf = Buffer.from(signature);
        const expBuf = Buffer.from(expected);
        if (
          sigBuf.length !== expBuf.length ||
          !timingSafeEqual(sigBuf, expBuf)
        ) {
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: any;
        try {
          payload = JSON.parse(body);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        // Log every event for visibility/debugging
        await supabaseAdmin.from("clickup_sync_log").insert({
          direction: "webhook",
          entity_type: payload.event?.includes("task") ? "task" : "list",
          clickup_id: payload.task_id ?? payload.list_id ?? null,
          status: "success",
          payload,
        });

        // Handle list rename → keep client name in sync (optional, light-touch)
        if (payload.event === "listUpdated" && payload.list_id) {
          // We don't auto-rename clients to avoid surprise overrides.
          // Add custom logic here if you want to mirror ClickUp changes.
        }

        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
