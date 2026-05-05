"use client";

import { motion } from "framer-motion";
import SunflowerDecor from "./SunflowerDecor";

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface FloralCornerProps {
  corner?: Corner;
  density?: "light" | "medium" | "dense";
  baseOpacity?: number;
  className?: string;
}

interface Bloom {
  size: number;
  rotation: number;
  opacity: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

const BLOOM_PRESETS: Record<Corner, Record<"light" | "medium" | "dense", Bloom[]>> = {
  "top-left": {
    light: [
      { size: 80, rotation: -18, opacity: 0.55, top: "-20px", left: "-20px" },
      { size: 44, rotation: 22, opacity: 0.4, top: "60px", left: "30px" },
    ],
    medium: [
      { size: 90, rotation: -22, opacity: 0.55, top: "-24px", left: "-24px" },
      { size: 52, rotation: 18, opacity: 0.45, top: "70px", left: "40px" },
      { size: 38, rotation: -8, opacity: 0.5, top: "20px", left: "84px" },
    ],
    dense: [
      { size: 100, rotation: -22, opacity: 0.55, top: "-26px", left: "-26px" },
      { size: 60, rotation: 18, opacity: 0.5, top: "78px", left: "44px" },
      { size: 44, rotation: -10, opacity: 0.5, top: "20px", left: "92px" },
      { size: 34, rotation: 26, opacity: 0.45, top: "120px", left: "8px" },
    ],
  },
  "top-right": {
    light: [
      { size: 80, rotation: 18, opacity: 0.55, top: "-20px", right: "-20px" },
      { size: 44, rotation: -22, opacity: 0.4, top: "60px", right: "30px" },
    ],
    medium: [
      { size: 90, rotation: 22, opacity: 0.55, top: "-24px", right: "-24px" },
      { size: 52, rotation: -18, opacity: 0.45, top: "70px", right: "40px" },
      { size: 38, rotation: 8, opacity: 0.5, top: "20px", right: "84px" },
    ],
    dense: [
      { size: 100, rotation: 22, opacity: 0.55, top: "-26px", right: "-26px" },
      { size: 60, rotation: -18, opacity: 0.5, top: "78px", right: "44px" },
      { size: 44, rotation: 10, opacity: 0.5, top: "20px", right: "92px" },
      { size: 34, rotation: -26, opacity: 0.45, top: "120px", right: "8px" },
    ],
  },
  "bottom-left": {
    light: [
      { size: 80, rotation: 14, opacity: 0.55, bottom: "-20px", left: "-20px" },
      { size: 44, rotation: -22, opacity: 0.4, bottom: "60px", left: "30px" },
    ],
    medium: [
      { size: 90, rotation: 14, opacity: 0.55, bottom: "-24px", left: "-24px" },
      { size: 52, rotation: -22, opacity: 0.45, bottom: "70px", left: "40px" },
      { size: 38, rotation: 6, opacity: 0.5, bottom: "20px", left: "84px" },
    ],
    dense: [
      { size: 100, rotation: 14, opacity: 0.55, bottom: "-26px", left: "-26px" },
      { size: 60, rotation: -22, opacity: 0.5, bottom: "78px", left: "44px" },
      { size: 44, rotation: 6, opacity: 0.5, bottom: "20px", left: "92px" },
      { size: 34, rotation: -28, opacity: 0.45, bottom: "120px", left: "8px" },
    ],
  },
  "bottom-right": {
    light: [
      { size: 80, rotation: -14, opacity: 0.55, bottom: "-20px", right: "-20px" },
      { size: 44, rotation: 22, opacity: 0.4, bottom: "60px", right: "30px" },
    ],
    medium: [
      { size: 90, rotation: -14, opacity: 0.55, bottom: "-24px", right: "-24px" },
      { size: 52, rotation: 22, opacity: 0.45, bottom: "70px", right: "40px" },
      { size: 38, rotation: -6, opacity: 0.5, bottom: "20px", right: "84px" },
    ],
    dense: [
      { size: 100, rotation: -14, opacity: 0.55, bottom: "-26px", right: "-26px" },
      { size: 60, rotation: 22, opacity: 0.5, bottom: "78px", right: "44px" },
      { size: 44, rotation: -6, opacity: 0.5, bottom: "20px", right: "92px" },
      { size: 34, rotation: 28, opacity: 0.45, bottom: "120px", right: "8px" },
    ],
  },
};

export default function FloralCorner({
  corner = "top-left",
  density = "medium",
  baseOpacity = 1,
  className = "",
}: FloralCornerProps) {
  const blooms = BLOOM_PRESETS[corner][density];

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute z-0 ${className}`}
      style={{
        width: 220,
        height: 220,
        ...(corner.includes("top") ? { top: 0 } : { bottom: 0 }),
        ...(corner.includes("left") ? { left: 0 } : { right: 0 }),
      }}
    >
      {blooms.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.6, rotate: b.rotation - 20 }}
          animate={{ opacity: b.opacity * baseOpacity, scale: 1, rotate: b.rotation }}
          transition={{ duration: 1.1, delay: 0.15 * i, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            top: b.top,
            left: b.left,
            right: b.right,
            bottom: b.bottom,
          }}
        >
          <SunflowerDecor size={b.size} opacity={1} />
        </motion.div>
      ))}
    </div>
  );
}
