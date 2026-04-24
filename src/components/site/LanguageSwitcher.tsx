import { useLang } from "@/i18n/LanguageProvider";
import { LANGUAGES } from "@/i18n/translations";

export function LanguageSwitcher({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { lang, setLang } = useLang();
  const base =
    tone === "light"
      ? "text-white/60 hover:text-white"
      : "text-foreground/60 hover:text-foreground";
  const active = tone === "light" ? "text-white" : "text-foreground";

  return (
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em]">
      {LANGUAGES.map((l, i) => (
        <span key={l.code} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLang(l.code)}
            className={`transition-colors ${lang === l.code ? active : base}`}
            aria-label={`Switch language to ${l.label}`}
          >
            {l.label}
          </button>
          {i < LANGUAGES.length - 1 && <span className={base}>/</span>}
        </span>
      ))}
    </div>
  );
}
