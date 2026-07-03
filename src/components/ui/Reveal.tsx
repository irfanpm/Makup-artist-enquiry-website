"use client";

import { motion } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  /** Seconds to wait before animating — use i * 0.1 for staggered grids */
  delay?: number;
  /** Direction the element travels from */
  from?: "bottom" | "left" | "right" | "none";
  className?: string;
}

const offsets = {
  bottom: { y: 32, x: 0 },
  left: { y: 0, x: -40 },
  right: { y: 0, x: 40 },
  none: { y: 0, x: 0 },
};

/** Fade + slide element into view when scrolled to (runs once). */
export default function Reveal({
  children,
  delay = 0,
  from = "bottom",
  className,
}: RevealProps) {
  const { x, y } = offsets[from];
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
