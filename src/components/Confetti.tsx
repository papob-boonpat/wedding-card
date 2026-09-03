"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { useReducedMotion } from "framer-motion";

const COLORS = ["#8c7a5b", "#d8c7a8", "#e8dcc6", "#c9a86a", "#ffffff"];

/** Fires a celebratory burst once, when `fire` flips true. */
export default function Confetti({ fire }: { fire: boolean }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!fire || reduce) return;

    confetti({
      particleCount: 110,
      spread: 75,
      startVelocity: 42,
      origin: { y: 0.62 },
      colors: COLORS,
      scalar: 0.95,
      disableForReducedMotion: true,
    });

    const t = setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: COLORS,
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: COLORS,
        disableForReducedMotion: true,
      });
    }, 220);

    return () => clearTimeout(t);
  }, [fire, reduce]);

  return null;
}
