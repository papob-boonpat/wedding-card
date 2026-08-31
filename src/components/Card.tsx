"use client";

import Image from "next/image";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { useI18n } from "./LangProvider";

// Match this to the real aspect ratio of your card images (width / height).
const CARD_ASPECT = 0.7142857143; // A-series portrait (e.g. 1414 x 2000)

// Sized to leave room for the button bar below. Uses svh so mobile browser
// chrome never clips it.
const CARD_WIDTH = `min(88vw, calc(76svh * ${CARD_ASPECT}))`;

type Props = {
  flipped: boolean;
  onFlip: () => void;
  /** Only wire up tap / swipe / focus once the card is actually out. */
  interactive: boolean;
};

export default function Card({ flipped, onFlip, interactive }: Props) {
  const reduce = useReducedMotion();
  const { t } = useI18n();

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (Math.abs(info.offset.x) > 60 || Math.abs(info.velocity.x) > 400) {
      onFlip();
    }
  }

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
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={
          reduce
            ? { duration: 0 }
            : { type: "spring", stiffness: 260, damping: 30 }
        }
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
        <Face src="/FC.png" alt={t("cardFront")} />
        <Face src="/BC.png" alt={t("cardBack")} back />
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
