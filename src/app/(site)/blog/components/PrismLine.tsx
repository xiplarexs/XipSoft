"use client";

import { motion } from "motion/react";

export const PrismLine = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute left-0 right-0 h-[1px] pointer-events-none"
    style={{
      top: "35%",
      background:
        "linear-gradient(90deg, transparent 0%, #22d3ee20 20%, #a78bfa30 50%, #fb718520 80%, transparent 100%)",
    }}
    initial={{ opacity: 0, scaleX: 0 }}
    animate={{ opacity: 1, scaleX: 1 }}
    transition={{ duration: 1.5, delay, ease: "easeOut" }}
  />
);
