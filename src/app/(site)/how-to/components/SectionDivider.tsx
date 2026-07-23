import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/utils";

export const SectionDivider = ({ color = "#22d3ee" }: { color?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: true });
  return (
    <motion.div
      ref={ref}
      className="h-[1px] my-12 md:my-16"
      style={{ background: `linear-gradient(90deg, transparent 0%, ${color}20 20%, ${color}30 50%, ${color}20 80%, transparent 100%)` }}
      initial={{ scaleX: 0 }}
      animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    />
  );
};
