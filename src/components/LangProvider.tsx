"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { dict, detectLang, type Lang, type MessageKey } from "@/lib/i18n";

type I18nContext = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: MessageKey) => string;
};

const Ctx = createContext<I18nContext | null>(null);

const STORAGE_KEY = "wedding-card-lang";

export function LangProvider({ children }: { children: React.ReactNode }) {
  // Always start on "en" so the server-rendered HTML and the first client
  // render match (no hydration mismatch). Switch to the real language after
  // mount.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved =
      typeof localStorage !== "undefined"
        ? (localStorage.getItem(STORAGE_KEY) as Lang | null)
        : null;
    setLangState(saved === "th" || saved === "en" ? saved : detectLang());
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
