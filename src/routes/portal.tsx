import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { Loader2, LogOut } from "lucide-react";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";

export const Route = createFileRoute("/portal")({
  head: () => ({ meta: [{ title: "Client Portal — Pedra & Luz" }] }),
  component: PortalLayout,
});

function PortalLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
      if (!s) navigate({ to: "/auth" });
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      if (!data.session) navigate({ to: "/auth" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!session) return null;

  return (
    <div className="min-h-screen bg-background">
      <header
        className="sticky top-0 z-30 border-b border-white/10 text-white"
        style={{ backgroundColor: "var(--surface-darker)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-lg tracking-[0.25em] text-[var(--brass)]">
            PEDRA & LUZ
          </Link>
          <div className="flex items-center gap-6">
            <span className="hidden text-xs text-white/50 sm:inline">{session.user.email}</span>
            <LanguageSwitcher tone="light" />
            <button
              type="button"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/auth" });
              }}
              className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
