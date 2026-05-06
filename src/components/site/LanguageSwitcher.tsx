import { useState, useRef, useEffect } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import { LANGUAGES } from "@/i18n/translations";
import { ChevronDown, Check } from "lucide-react";

export function LanguageSwitcher({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const triggerColor =
    tone === "light"
      ? "text-white/70 hover:text-white"
      : "text-foreground/70 hover:text-foreground";

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] transition-colors ${triggerColor}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {current.label}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          role="listbox"
          className={`absolute right-0 top-full z-50 mt-2 w-40 border bg-background py-1 shadow-lg ${
            tone === "light" ? "border-white/15" : "border-border"
          }`}
          style={tone === "light" ? { backgroundColor: "var(--surface-darker)" } : undefined}
        >
          {LANGUAGES.map((l) => {
            const active = l.code === lang;
            const itemColor =
              tone === "light"
                ? active
                  ? "text-white bg-white/10"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
                : active
                ? "text-foreground bg-secondary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground";
            return (
              <button
                key={l.code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs uppercase tracking-[0.18em] transition-colors ${itemColor}`}
              >
                <span>
                  <span className="font-medium">{l.label}</span>
                  <span className="ml-2 normal-case tracking-normal opacity-70">{l.full}</span>
                </span>
                {active && <Check className="h-3 w-3" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
