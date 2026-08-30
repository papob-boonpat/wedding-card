"use client";

import { motion, type Variants } from "framer-motion";
import { useI18n } from "./LangProvider";

// Pure-CSS/SVG envelope. Layers, back to front:
//   1. body (back pocket)   — z 0
//   2. card slot            — z 10 (card lives here, rendered by parent)
//   3. front pocket + fold  — z 20  (triangular sides + bottom)
//   4. flap                 — z 30  (opens up and back)
//   5. tap target <button>  — z 40  (only while closed)

type Props = {
  open: boolean;
  gone: boolean;
  onOpen: () => void;
};

const flapVariants: Variants = {
  closed: { rotateX: 0 },
  open: { rotateX: -180, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
};

const PAPER = "#e8dcc6";
const PAPER_DARK = "#d8c7a8";
const PAPER_SHADE = "#cbb992";

export default function Envelope({ open, gone, onOpen }: Props) {
  const { t } = useI18n();
  return (
    <motion.div
      className="relative"
      style={{ width: "min(86vw, 380px)", aspectRatio: "1.5", perspective: 1200 }}
      animate={
        gone
          ? { y: 120, opacity: 0, scale: 0.92 }
          : { y: 0, opacity: 1, scale: 1 }
      }
      transition={{ duration: 0.6, ease: "easeIn" }}
    >
      {/* back pocket */}
      <div
        className="absolute inset-0 rounded-lg shadow-xl"
        style={{ background: PAPER, zIndex: 0 }}
      />

      {/* front pocket: bottom fold + side triangles via clip-path */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          zIndex: 20,
          background: PAPER_DARK,
          clipPath: "polygon(0 0, 50% 46%, 100% 0, 100% 100%, 0 100%)",
          boxShadow: "inset 0 2px 12px rgba(0,0,0,0.12)",
          pointerEvents: "none",
        }}
      />
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          zIndex: 21,
          background: PAPER_SHADE,
          clipPath: "polygon(0 0, 50% 46%, 0 100%)",
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          zIndex: 21,
          background: PAPER_SHADE,
          clipPath: "polygon(100% 0, 50% 46%, 100% 100%)",
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />

      {/* flap (visual only) */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 origin-top rounded-t-lg"
        style={{
          height: "62%",
          zIndex: open ? 5 : 30,
          transformStyle: "preserve-3d",
          background: PAPER_SHADE,
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          pointerEvents: "none",
        }}
        variants={flapVariants}
        initial="closed"
        animate={open ? "open" : "closed"}
      />

      {/* Full-surface tap target. A plain <button> — the browser synthesises a
          click from a tap on every mobile browser, no gesture library involved. */}
      {!open && (
        <button
          type="button"
          onClick={onOpen}
          onTouchEnd={(e) => {
            // Some mobile browsers are slow to synthesise click; fire immediately
            // and prevent the follow-up click from double-triggering.
            e.preventDefault();
            onOpen();
          }}
          aria-label={t("openEnvelope")}
          className="absolute inset-0 z-40 cursor-pointer appearance-none rounded-lg border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
