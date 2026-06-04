import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { LayoutDashboard, Users, Kanban, LogOut, Loader2, Plug, UserCog, Menu, X } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Studio Dashboard — Pedra & Luz" }] }),
  component: DashboardLayout,
});

const NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/clients", label: "Clients", icon: Users, exact: false },
  { to: "/dashboard/projects", label: "Projects", icon: Kanban, exact: false },
  { to: "/dashboard/managers", label: "Managers", icon: UserCog, exact: false },
  { to: "/dashboard/clickup", label: "ClickUp", icon: Plug, exact: false },
];

function DashboardLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();
  const { location } = useRouterState();

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

  // Close mobile drawer on route change
  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!session) return null;

  const SidebarContent = (
    <>
      <div className="flex items-center justify-between border-b border-white/10 p-6">
        <Link to="/" className="font-display text-xl tracking-[0.25em] text-[var(--brass)]">
          PEDRA & LUZ
        </Link>
        <button
          type="button"
          onClick={() => setNavOpen(false)}
          className="text-white/60 hover:text-white md:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <p className="label-tag px-6 pt-6 text-white/40">Studio</p>

      <nav className="mt-4 flex-1 px-3">
        {NAV.map((n) => {
          const active = n.exact
            ? location.pathname === n.to
            : location.pathname.startsWith(n.to);
          return (
            <Link
              key={n.to}
              to={n.to}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <p className="truncate text-xs text-white/40">{session.user.email}</p>
        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/auth" });
          }}
          className="mt-3 flex w-full items-center gap-2 text-xs text-white/60 hover:text-white"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className="hidden w-64 shrink-0 flex-col text-white md:flex"
        style={{ backgroundColor: "var(--surface-darker)" }}
      >
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {navOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 md:hidden"
          onClick={() => setNavOpen(false)}
        >
          <aside
            className="flex h-full w-72 max-w-[85%] flex-col text-white"
            style={{ backgroundColor: "var(--surface-darker)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {SidebarContent}
          </aside>
        </div>
      )}

      <main className="flex-1 overflow-x-hidden">
        {/* Mobile top bar */}
        <div
          className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 text-white md:hidden"
          style={{ backgroundColor: "var(--surface-darker)" }}
        >
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            className="text-white"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display text-sm tracking-[0.25em] text-[var(--brass)]">
            PEDRA & LUZ
          </span>
          <span className="w-5" />
        </div>

        <Outlet />
      </main>
    </div>
  );
}
