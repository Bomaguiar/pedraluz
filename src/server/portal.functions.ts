import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const InviteSchema = z.object({
  email: z.string().email().max(255),
  projectId: z.string().uuid(),
  clientId: z.string().uuid().nullable().optional(),
  redirectTo: z.string().url().max(500),
});

/**
 * Admin-only: invite a client by email.
 * Creates (or finds) the auth user, gives them the 'client' role,
 * maps them to the project, and sends a magic link.
 */
export const inviteClientToProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => InviteSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;

    // Verify caller is admin
    const { data: roleRow, error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (roleErr) throw new Error("Permission check failed");
    if (!roleRow) throw new Error("Admin only");

    // Find existing user by email
    let targetUserId: string | null = null;
    const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (listErr) throw new Error(listErr.message);
    const existing = list.users.find((u) => u.email?.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      targetUserId = existing.id;
    } else {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        email_confirm: true,
      });
      if (createErr || !created.user) throw new Error(createErr?.message ?? "Failed to create user");
      targetUserId = created.user.id;
    }

    // Ensure 'client' role
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: targetUserId, role: "client" }, { onConflict: "user_id,role" });

    // Map user to project
    const { error: mapErr } = await supabaseAdmin
      .from("project_clients")
      .upsert(
        {
          project_id: data.projectId,
          user_id: targetUserId,
          client_id: data.clientId ?? null,
        },
        { onConflict: "project_id,user_id" },
      );
    if (mapErr) throw new Error(mapErr.message);

    // Send magic link
    const { error: linkErr } = await supabaseAdmin.auth.signInWithOtp({
      email: data.email,
      options: { emailRedirectTo: data.redirectTo },
    });
    if (linkErr) throw new Error(linkErr.message);

    return { ok: true, userId: targetUserId };
  });
