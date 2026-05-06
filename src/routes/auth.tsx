import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign In — Pedra & Luz" }] }),
  component: AuthPage,
});

async function routeAfterLogin(navigate: (opts: any) => void) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return;
  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  const isAdmin = (roles ?? []).some((r: any) => r.role === "admin");
  if (isAdmin) {
    navigate({ to: "/dashboard" });
    return;
  }
  // Look up first project the user has access to
  const { data: pc } = await supabase
    .from("project_clients")
    .select("project_id")
    .limit(1)
    .maybeSingle();
  if (pc?.project_id) navigate({ to: "/portal/$projectId", params: { projectId: pc.project_id } });
  else navigate({ to: "/portal" });
}

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) routeAfterLogin(navigate);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) routeAfterLogin(navigate);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return toast.error("Email required");
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth` },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setSent(true);
    toast.success("Magic link sent. Check your email.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="font-display block text-center text-2xl tracking-[0.25em] text-[var(--brass-dark)]">
          PEDRA & LUZ
        </Link>
        <p className="label-tag mt-2 text-center text-muted-foreground">Sign in</p>

        {sent ? (
          <div className="mt-12 border border-border bg-card p-8 text-center">
            <Mail className="mx-auto h-8 w-8 text-[var(--brass-dark)]" />
            <h1 className="font-display mt-4 text-2xl">Check your inbox</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              We sent a sign-in link to <span className="text-foreground">{email}</span>. Click it to access your account.
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-6 text-xs text-muted-foreground hover:text-foreground"
            >
              ← Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handle} className="mt-12 space-y-5 border border-border bg-card p-8">
            <h1 className="font-display text-3xl">Sign in</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and we'll send a one-time sign-in link. No password needed.
            </p>

            <div>
              <label className="label-tag text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border border-input bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
                required
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 bg-foreground py-3 text-[11px] uppercase tracking-[0.2em] text-background transition-colors hover:bg-[var(--brass-dark)] disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Send Magic Link
            </button>
          </form>
        )}

        <Link to="/" className="mt-8 block text-center text-xs text-muted-foreground hover:text-foreground">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
