import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { TranslationKey } from "@/i18n/translations";

const NAV: { to: string; key: TranslationKey }[] = [
  { to: "/services", key: "nav.services" },
  { to: "/process", key: "nav.process" },
  { to: "/portfolio", key: "nav.portfolio" },
  { to: "/about", key: "nav.about" },
  { to: "/partners", key: "nav.partners" },
];

export function SiteHeader({ overHero = false }: { overHero?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();
  const { t } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const transparent = overHero && !scrolled;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          transparent
            ? "bg-transparent"
            : "border-b border-white/5 backdrop-blur-xl"
        }`}
        style={
          transparent
            ? undefined
            : { backgroundColor: "rgba(26,26,24,0.85)" }
        }
      >
        <div className="container-edge flex h-20 items-center justify-between">
          <Link
            to="/"
            className="font-display text-2xl tracking-[0.25em] text-[var(--brass)]"
            aria-label="Pedra & Luz home"
          >
            PEDRA & LUZ
          </Link>

          <nav className="hidden items-center gap-8 md:flex lg:gap-10">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="label-tag text-white/70 transition-colors hover:text-white"
                activeProps={{ className: "label-tag text-white" }}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-6 md:flex md:ml-8 lg:ml-12">
            <LanguageSwitcher tone="light" />
            <Link
              to="/estimate"
              className="border border-[var(--brass)] px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] text-[var(--brass)] transition-all duration-300 hover:bg-[var(--brass)] hover:text-[var(--brass-foreground)]"
            >
              {t("nav.book")}
            </Link>
          </div>

          <button
            type="button"
            className="text-white md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 md:hidden"
          style={{ backgroundColor: "var(--surface-darker)" }}
        >
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="font-display text-3xl text-white"
            >
              {t(item.key)}
            </Link>
          ))}
          <Link
            to="/estimate"
            className="mt-4 border border-[var(--brass)] px-6 py-3 text-xs uppercase tracking-[0.18em] text-[var(--brass)]"
          >
            {t("nav.book")}
          </Link>
          <div className="mt-4">
            <LanguageSwitcher tone="light" />
          </div>
        </div>
      )}
    </>
  );
}
