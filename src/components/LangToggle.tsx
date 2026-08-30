"use client";

import { LANGS } from "@/lib/i18n";
import { useI18n } from "./LangProvider";

export default function LangToggle() {
  const { lang, setLang } = useI18n();

  return (
    <div className="fixed right-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-50 flex overflow-hidden rounded-full bg-white/70 text-xs font-medium shadow ring-1 ring-black/10 backdrop-blur">
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`px-3 py-1.5 uppercase tracking-wide transition ${
            lang === l ? "bg-accent text-white" : "text-foreground/60"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
