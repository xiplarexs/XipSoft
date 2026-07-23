import { motion } from "motion/react";

// ── Hamburger icon ────────────────────────────────────────────────────────────
export const MenuIcon = ({ isOpen }: { isOpen: boolean }) => (
  <div className="relative w-6 h-5 flex flex-col justify-between">
    <motion.span className="block h-[2px] rounded-full origin-left"
      style={{ background: "linear-gradient(90deg,#22d3ee,#a78bfa)" }}
      animate={isOpen ? { rotate: 45, y: 0, width: "100%" } : { rotate: 0, y: 0, width: "100%" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    />
    <motion.span className="block h-[2px] rounded-full" style={{ background: "#a78bfa" }}
      animate={isOpen ? { opacity: 0, x: 12, width: "60%" } : { opacity: 1, x: 0, width: "60%" }}
      transition={{ duration: 0.25 }}
    />
    <motion.span className="block h-[2px] rounded-full origin-left"
      style={{ background: "linear-gradient(90deg,#a78bfa,#fb7185)" }}
      animate={isOpen ? { rotate: -45, y: 0, width: "100%" } : { rotate: 0, y: 0, width: "100%" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    />
  </div>
);
