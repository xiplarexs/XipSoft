import { motion } from "motion/react";
import { Sparkle } from "./Sparkle";
import { sparkleDriftX } from "./constants";

// ── Active indicator ──────────────────────────────────────────────────────────
export const ActiveIndicator = () => (
  <motion.div layoutId="nav-active-glow" className="absolute -bottom-[1px] left-0 right-0 flex justify-center"
    transition={{ type: "spring", stiffness: 400, damping: 30 }}>
    {/* CSS animate-pulse ile boxShadow infinite JS animasyonu kaldırıldı */}
    <div className="w-10 h-[3px] rounded-full animate-pulse"
      style={{ background: "linear-gradient(90deg,#fb7185,#f97316,#fbbf24)", boxShadow: "0 0 12px rgba(249,115,22,0.9), 0 0 24px rgba(249,115,22,0.5)" }}
    />
    <div className="absolute top-0">
        {[0, 0.6, 1.2].map((d, i) => <Sparkle key={i} delay={d} driftX={sparkleDriftX[i] ?? 0} />)}
      </div>
  </motion.div>
);
