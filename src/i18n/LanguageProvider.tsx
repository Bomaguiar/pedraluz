import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations, type Lang, type TranslationKey } from "./translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "pl_lang";

function detectInitial(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
  if (stored === "en" || stored === "pt" || stored === "fr" || stored === "ru") return stored;
  const nav = window.navigator.language?.toLowerCase() ?? "";
  if (nav.startsWith("pt")) return "pt";
  if (nav.startsWith("fr")) return "fr";
  if (nav.startsWith("ru")) return "ru";
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    setLangState(detectInitial());
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, l);
  };

  const t = (key: TranslationKey): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] ?? entry.en;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
