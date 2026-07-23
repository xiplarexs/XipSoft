"use client";

import { motion } from "motion/react";

export const FloatingOrb = ({
  size,
  color,
  x,
  y,
  delay,
  duration,
}: {
  size: number;
  color: string;
  x: string;
  y: string;
  delay: number;
  duration: number;
}) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      left: x,
      top: y,
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      filter: "blur(50px)",
    }}
    animate={{
      y: [0, -18, 10, -12, 0],
      x: [0, 12, -8, 10, 0],
      scale: [1, 1.12, 0.92, 1.08, 1],
      opacity: [0.2, 0.35, 0.15, 0.3, 0.2],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);
