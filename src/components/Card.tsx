"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { useI18n } from "./LangProvider";

// Match this to the real aspect ratio of your card images (width / height).
const CARD_ASPECT = 0.7182633318; // A-series portrait (e.g. 1414 x 2000)

// Sized to leave room for the button bar below. Uses svh so mobile browser
// chrome never clips it.
const CARD_WIDTH = `min(88vw, calc(76svh * ${CARD_ASPECT}))`;

type Props = {
  flipped: boolean;
  onFlip: () => void;
  /** Only wire up tap / swipe / focus once the card is actually out. */
  interactive: boolean;
  /** True from the moment the card starts growing out of the envelope. */
  revealing: boolean;
};

export default function Card({ flipped, onFlip, interactive, revealing }: Props) {
  const reduce = useReducedMotion();
  const { t } = useI18n();

  // The card grows out back-first (rotateY 180) and rotates to the front as it
  // scales up — so it's obvious it has two sides. After that, flips use a
  // spring like normal.
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (reduce) setRevealed(true);
  }, [reduce]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (Math.abs(info.offset.x) > 60 || Math.abs(info.velocity.x) > 400) {
      onFlip();
    }
  }

  const revealRotating = revealing && !revealed && !flipped;
  const restY = flipped ? 180 : revealing ? 0 : 180;

  return (
    <div
      className="relative"
      style={{
        width: CARD_WIDTH,
        perspective: 1400,
        aspectRatio: String(CARD_ASPECT),
        pointerEvents: interactive ? "auto" : "none",
      }}
    >
      <motion.div
        className="absolute inset-0 touch-pan-y"
        style={{
          transformStyle: "preserve-3d",
          cursor: interactive ? "pointer" : "default",
        }}
        initial={{ rotateY: 180 }}
        animate={{ rotateY: reduce ? (flipped ? 180 : 0) : restY }}
        transition={
          reduce
            ? { duration: 0 }
            : revealRotating
              ? { duration: 1.5, ease: [0.33, 1, 0.68, 1], delay: 0.15 }
              : { type: "spring", stiffness: 260, damping: 30 }
        }
        onAnimationComplete={() => {
          if (revealRotating) setRevealed(true);
        }}
        drag={interactive && !reduce ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.35}
        onDragEnd={handleDragEnd}
        onClick={interactive ? onFlip : undefined}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : -1}
        aria-label={
          interactive ? t(flipped ? "showFront" : "showBack") : undefined
        }
        onKeyDown={(e) => {
          if (interactive && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onFlip();
          }
        }}
      >
        <Face src="/FC2.png" alt={t("cardFront")} />
        <Face src="/BC2.png" alt={t("cardBack")} back />
      </motion.div>
    </div>
  );
}

function Face({
  src,
  alt,
  back = false,
}: {
  src: string;
  alt: string;
  back?: boolean;
}) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        backfaceVisibility: "hidden",
        transform: back ? "rotateY(180deg)" : undefined,
        filter: "drop-shadow(0 20px 25px rgba(0, 0, 0, 0.15))",
      }}
    >
      <Image src={src} alt={alt} fill priority className="object-cover" sizes="100vw" />
    </div>
  );
}
