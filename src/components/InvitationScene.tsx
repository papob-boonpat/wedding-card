"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Envelope from "./Envelope";
import Card from "./Card";
import { useI18n } from "./LangProvider";

type Phase = "sealed" | "opening" | "card-out";

export default function InvitationScene() {
  const [phase, setPhase] = useState<Phase>("sealed");
  const [flipped, setFlipped] = useState(false);
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const openedRef = useRef(false);
  const open = useCallback(() => {
    if (openedRef.current) return;
    openedRef.current = true;
    setPhase("opening");
    if (reduce) {
      setPhase("card-out");
      return;
    }
    timers.current.push(setTimeout(() => setPhase("card-out"), 500));
  }, [reduce]);

  const cardOut = phase === "card-out";

  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden">
      <div className="relative flex items-center justify-center">
        {phase !== "card-out" && (
          <Envelope open={phase === "opening"} gone={false} onOpen={open} />
        )}

        {/* Card: only exists once the envelope is opening — while sealed it is
            not in the DOM at all, so it can never intercept the open tap. */}
        {phase !== "sealed" && (
          <motion.div
            className="absolute left-1/2 top-1/2"
            style={{
              x: "-50%",
              zIndex: 15,
              pointerEvents: cardOut ? "auto" : "none",
            }}
            initial={
              reduce
                ? { y: "-50%", scale: 1, opacity: 0 }
                : { y: "-38%", scale: 0.18, opacity: 0 }
            }
            animate={
              reduce
                ? { y: "-50%", scale: 1, opacity: 1 }
                : { y: "-50%", scale: 1, opacity: 1 }
            }
            transition={
              reduce
                ? { duration: 0 }
                : phase === "opening"
                  ? {
                    delay: 0.15,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }
                  : { duration: 0.4 }
            }
          >
            <Card
              flipped={flipped}
              onFlip={() => cardOut && setFlipped((f) => !f)}
              interactive={cardOut}
            />
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {cardOut && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-10 text-center"
            style={{
              background:
                "linear-gradient(to top, rgba(244,237,228,0.9) 20%, transparent)",
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              {t("tapOrSwipe")}
            </p>
            <Link
              href="/rsvp"
              className="pointer-events-auto rounded-full bg-accent px-9 py-3.5 text-base font-medium tracking-wide text-white shadow-lg transition hover:brightness-110"
            >
              {t("rsvp")}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
