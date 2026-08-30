"use client";

import { motion } from "framer-motion";
import { useI18n } from "./LangProvider";

// The envelope is drawn in two parts so the card can sit *between* them in the
// z-stack (back wall behind the card, front pocket + flap in front of it):
//
//   <Envelope part="back" />     — paper wall behind the card
//   <the card>                   — rendered by the parent, z-10
//   <Envelope part="front" />    — front pocket, flap, tap target
//
// When `leaving` flips true both parts slide down and fade out together,
// uncovering the stationary card.

type Props = {
  part: "back" | "front";
  leaving: boolean;
  open?: boolean;
  onOpen?: () => void;
};

const PAPER = "#e8dcc6";
const PAPER_DARK = "#d8c7a8";
const PAPER_SHADE = "#cbb992";

const LEAVE = { y: 280, opacity: 0 };
const HOME = { y: 0, opacity: 1 };
const leaveTransition = { duration: 0.8, ease: [0.4, 0, 0.2, 1] } as const;

export default function Envelope({ part, leaving, open = false, onOpen }: Props) {
  const { t } = useI18n();

  if (part === "back") {
    return (
      <motion.div
        className="absolute inset-0 rounded-lg shadow-xl"
        style={{ background: PAPER, zIndex: 0 }}
        animate={leaving ? LEAVE : HOME}
        transition={leaveTransition}
      />
    );
  }

  return (
    <motion.div
      className="absolute inset-0"
      style={{ zIndex: 20, transformStyle: "preserve-3d" }}
      animate={leaving ? LEAVE : HOME}
      transition={leaveTransition}
    >
      {/* front pocket: bottom fold + side triangles via clip-path */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: PAPER_DARK,
          clipPath: "polygon(0 0, 50% 46%, 100% 0, 100% 100%, 0 100%)",
          boxShadow: "inset 0 2px 12px rgba(0,0,0,0.12)",
        }}
      />
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: PAPER_SHADE,
          opacity: 0.6,
          clipPath: "polygon(0 0, 50% 46%, 0 100%)",
        }}
      />
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: PAPER_SHADE,
          opacity: 0.4,
          clipPath: "polygon(100% 0, 50% 46%, 100% 100%)",
        }}
      />

      {/* flap */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 origin-top rounded-t-lg"
        style={{
          height: "62%",
          zIndex: open ? -1 : 3,
          transformStyle: "preserve-3d",
          background: PAPER_SHADE,
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
        }}
        animate={{ rotateX: open ? -180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Full-surface tap target — a plain <button>, so a tap becomes a click
          on every mobile browser without a gesture library. */}
      {!open && (
        <button
          type="button"
          onClick={onOpen}
          onTouchEnd={(e) => {
            e.preventDefault();
            onOpen?.();
          }}
          aria-label={t("openEnvelope")}
          className="absolute inset-0 z-10 cursor-pointer appearance-none rounded-lg border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-accent"
          style={{
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
          }}
        />
      )}

      {!open && (
        <motion.span
          className="pointer-events-none absolute inset-x-0 -bottom-10 text-center text-sm uppercase tracking-[0.3em] text-accent"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          {t("tapToOpen")}
        </motion.span>
      )}
    </motion.div>
  );
}
