import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

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
    if (!email || !password) return toast.error("Email and password required");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setBusy(true);

    // Try sign-in first
    const signIn = await supabase.auth.signInWithPassword({ email, password });
    if (!signIn.error) {
      setBusy(false);
      toast.success("Welcome back");
      return;
    }

    // If credentials invalid, try to create the account
    const msg = signIn.error.message.toLowerCase();
    const looksMissing =
      msg.includes("invalid login") || msg.includes("invalid credentials") || msg.includes("not found");

    if (!looksMissing) {
      setBusy(false);
      return toast.error(signIn.error.message);
    }

    const signUp = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth` },
    });
    setBusy(false);

    if (signUp.error) {
      const m = signUp.error.message.toLowerCase();
      if (m.includes("registered") || m.includes("exists")) {
        return toast.error("Wrong password for this email. Try again.");
      }
      return toast.error(signUp.error.message);
    }

    if (signUp.data.session) {
      toast.success("Account created");
    } else {
      toast.success("Check your email to confirm your account");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="font-display block text-center text-2xl tracking-[0.25em] text-[var(--brass-dark)]">
          PEDRA & LUZ
        </Link>
        <p className="label-tag mt-2 text-center text-muted-foreground">Sign in or create account</p>

        <form onSubmit={handle} className="mt-12 space-y-5 border border-border bg-card p-8">
          <h1 className="font-display text-3xl">Welcome</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password. We'll sign you in if you have an account, or create one if you don't.
          </p>

          <div>
            <label className="label-tag text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="mt-2 w-full border border-input bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
              required
            />
          </div>

          <div>
            <label className="label-tag text-muted-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              minLength={6}
              className="mt-2 w-full border border-input bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
              required
            />
            <p className="mt-2 text-xs text-muted-foreground">At least 6 characters.</p>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 bg-foreground py-3 text-[11px] uppercase tracking-[0.2em] text-background transition-colors hover:bg-[var(--brass-dark)] disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Continue
          </button>
        </form>

        <Link to="/" className="mt-8 block text-center text-xs text-muted-foreground hover:text-foreground">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
