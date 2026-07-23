import { motion } from "motion/react";

// ── Sparkle ───────────────────────────────────────────────────────────────────
export const Sparkle = ({ delay, driftX }: { delay: number; driftX: number }) => (
  <motion.div className="absolute rounded-full"
    style={{ width: 3, height: 3, background: "linear-gradient(135deg,#fb7185,#f97316,#fbbf24)", filter: "blur(0.5px)" }}
    initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
    animate={{ opacity: [0, 1, 0], y: [0, -18, -28], x: [0, driftX], scale: [0, 1.2, 0] }}
    transition={{ duration: 1.8, delay, repeat: Infinity, repeatDelay: 2.5, ease: "easeOut" }}
  />
);
