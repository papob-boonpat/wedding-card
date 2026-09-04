"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Envelope from "./Envelope";
import Card from "./Card";
import Countdown from "./Countdown";
import Confetti from "./Confetti";
import { useI18n } from "./LangProvider";

type Phase = "sealed" | "opening" | "leaving" | "grow" | "card-out";

// Sequence timing (ms) — tune to taste. The steps run one after another:
const FLAP_MS = 600; // 1. flap swings open (matches Envelope's flap duration)
const HOLD_MS = 250; // 2. brief pause with the flap open
const LEAVE_MS = 800; // 3. envelope slides down and fades away
const GROW_MS = 950; // 4. the (now revealed) card grows + rotates to the front

// While tucked, the card is this fraction of the envelope's *height* so it
// always fits inside, whatever the envelope's aspect ratio.
const TUCK_RATIO = 0.82;

export default function InvitationScene() {
  const [phase, setPhase] = useState<Phase>("sealed");
  const [flipped, setFlipped] = useState(false);
  const [tuckScale, setTuckScale] = useState(0.4);
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const openedRef = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  // The card's size and the envelope's size are both viewport-relative, so
  // measure them to get the scale that makes the tucked card fit inside.
  useEffect(() => {
    const measure = () => {
      const stage = stageRef.current?.offsetHeight;
      const card = cardRef.current?.offsetHeight; // ignores the CSS transform
      if (stage && card) setTuckScale((stage * TUCK_RATIO) / card);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const open = useCallback(() => {
    if (openedRef.current) return;
    openedRef.current = true;

    if (reduce) {
      setPhase("card-out");
      return;
    }

    setPhase("opening");
    const t1 = FLAP_MS + HOLD_MS;
    const t2 = t1 + LEAVE_MS;
    const t3 = t2 + GROW_MS;
    timers.current.push(
      setTimeout(() => setPhase("leaving"), t1),
      setTimeout(() => setPhase("grow"), t2),
      setTimeout(() => setPhase("card-out"), t3),
    );
  }, [reduce]);

  const opened = phase !== "sealed";
  const leaving = phase === "leaving" || phase === "grow" || phase === "card-out";
  const grown = phase === "grow" || phase === "card-out";
  const cardOut = phase === "card-out";

  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden">
      <Countdown show={grown} />
      <Confetti fire={grown} />
      <div
        ref={stageRef}
        className="relative"
        style={{ width: "min(86vw, 380px)", aspectRatio: "1.5", perspective: 1200 }}
      >
        <Envelope part="back" leaving={leaving} />

        {/* Card — dead centre the whole time. Hidden until the envelope opens,
            then only its scale changes (after the envelope has left). */}
        <motion.div
          ref={cardRef}
          className="absolute left-1/2 top-1/2"
          style={{
            x: "-50%",
            zIndex: 10,
            opacity: opened ? 1 : 0,
            pointerEvents: cardOut ? "auto" : "none",
          }}
          initial={false}
          animate={{
            scale: reduce || grown ? 1 : tuckScale,
            y: reduce || grown ? "-55%" : "-50%",
          }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: GROW_MS / 1000, ease: [0.22, 1, 0.36, 1] }
          }
        >
          <Card
            flipped={flipped}
            onFlip={() => cardOut && setFlipped((f) => !f)}
            interactive={cardOut}
            revealing={grown}
          />
        </motion.div>

        <Envelope part="front" leaving={leaving} open={opened} onOpen={open} />
      </div>

      <AnimatePresence>
        {grown && (
          <motion.div
            className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex flex-col items-center gap-3 px-4 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-28 text-center"
            style={{
              background:
                "linear-gradient(to top, rgba(244,237,228,0.92) 0%, rgba(244,237,228,0.55) 45%, transparent 100%)",
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-accent drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
              {t("tapOrSwipe")}
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              <Link
                href="/rsvp"
                className="pointer-events-auto rounded-full bg-accent px-5 py-2.5 text-sm font-medium tracking-wide text-white shadow-lg transition hover:brightness-110 sm:px-9 sm:py-3.5 sm:text-base"
              >
                {t("rsvp")}
              </Link>
              <a
                href="https://maps.app.goo.gl/KVVUaA1X7Y77XMs86"
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto rounded-full border border-accent bg-background px-5 py-2.5 text-sm font-medium tracking-wide text-accent shadow-lg transition hover:brightness-95 sm:px-9 sm:py-3.5 sm:text-base"
              >
                {t("location")}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
