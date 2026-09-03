"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "./LangProvider";

// Wedding: 9 October 2026, 09:09 AM Bangkok time (UTC+7).
const TARGET = new Date("2026-10-09T09:09:00+07:00").getTime();

function breakdown(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86_400),
    h: Math.floor((s % 86_400) / 3_600),
    m: Math.floor((s % 3_600) / 60),
    s: s % 60,
  };
}

export default function Countdown({ show }: { show: boolean }) {
  const { t } = useI18n();
  // null until mounted so the server and first client render match.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = now === null ? 1 : TARGET - now;
  const b = breakdown(remaining);
  const segments: [number, string][] = [
    [b.d, t("countDays")],
    [b.h, t("countHours")],
    [b.m, t("countMinutes")],
    [b.s, t("countSeconds")],
  ];

  return (
    <AnimatePresence>
      {show && now !== null && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top)+1rem)] z-50 flex flex-col items-center gap-1 px-4 text-center"
          initial={{ opacity: 0, y: -18, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 220, damping: 22, delay: 0.15 }}
        >
          <span className="font-serif text-sm text-accent/80 sm:text-base">
            {t("countTitle")}
          </span>

          {remaining <= 0 ? (
            <span className="font-serif text-lg text-accent">{t("weddingDay")}</span>
          ) : (
            <div className="flex items-baseline gap-3 sm:gap-4">
              {segments.map(([value, label], i) => (
                <div key={i} className="flex items-baseline gap-1">
                  <span className="font-serif text-lg tabular-nums text-accent sm:text-xl">
                    {String(value).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.15em] text-accent/60">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
