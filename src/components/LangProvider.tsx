"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { dict, type Lang, type MessageKey } from "@/lib/i18n";

type I18nContext = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: MessageKey) => string;
};

const Ctx = createContext<I18nContext | null>(null);

const STORAGE_KEY = "wedding-card-lang";

export function LangProvider({ children }: { children: React.ReactNode }) {
  // Default to Thai; only a saved choice overrides it (device language is
  // ignored). Server HTML and first client render match on "th".
  const [lang, setLangState] = useState<Lang>("th");

  useEffect(() => {
    const saved =
      typeof localStorage !== "undefined"
        ? (localStorage.getItem(STORAGE_KEY) as Lang | null)
        : null;
    if (saved === "th" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback((k: MessageKey) => dict[lang][k], [lang]);

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n(): I18nContext {
  const c = useContext(Ctx);
  if (!c) throw new Error("useI18n must be used inside <LangProvider>");
  return c;
}
