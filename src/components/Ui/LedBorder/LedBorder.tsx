"use client";
import { motion } from "motion/react";
import { cn } from "@/utils";

type LedVariant = "fire" | "prism" | "dark-fire";

interface LedBorderProps {
  variant?: LedVariant;
  thick?: boolean;
  position?: "top" | "bottom";
  className?: string;
  speed?: number;
}

const gradients: Record<LedVariant, { thin: string; thick: string }> = {
  fire: {
    thin: "linear-gradient(90deg, transparent 0%, #fb7185 15%, #f97316 35%, #fbbf24 50%, #f97316 65%, #fb7185 85%, transparent 100%)",
    thick: "linear-gradient(90deg, transparent 0%, #fb7185 12%, #f97316 30%, #fbbf24 50%, #f97316 70%, #fb7185 88%, transparent 100%)",
  },
  prism: {
    thin: "linear-gradient(90deg,transparent,#22d3ee,#a78bfa,#fb7185,#a78bfa,#22d3ee,transparent)",
    thick: "linear-gradient(90deg,transparent,#22d3ee,#a78bfa,#fb7185,#a78bfa,#22d3ee,transparent)",
  },
  "dark-fire": {
    thin: "linear-gradient(90deg,transparent,#000000 15%,#f97316 50%,#000000 85%,transparent)",
    thick: "linear-gradient(90deg,transparent,#000000 12%,#f97316 50%,#000000 88%,transparent)",
  },
};

const shadows: Record<LedVariant, { thin: string; thick: string }> = {
  fire: {
    thin: "0 0 10px rgba(249,115,22,0.70), 0 0 20px rgba(251,191,36,0.30)",
    thick: "0 0 14px rgba(249,115,22,0.85), 0 0 32px rgba(251,191,36,0.40)",
  },
  prism: {
    thin: "0 0 10px rgba(167,139,250,0.40), 0 0 20px rgba(34,211,238,0.20)",
    thick: "0 0 14px rgba(167,139,250,0.50), 0 0 28px rgba(34,211,238,0.30)",
  },
  "dark-fire": {
    thin: "none",
    thick: "none",
  },
};

export default function LedBorder({
  variant = "fire",
  thick = false,
  position = "top",
  className,
  speed,
}: LedBorderProps) {
  const h = thick ? "h-[3px]" : "h-[2px]";
  const grad = thick ? gradients[variant].thick : gradients[variant].thin;
  const shadow = shadows[variant][thick ? "thick" : "thin"];
  const dur = speed ?? (thick ? 3.5 : 4);

  return (
    <div className={cn("absolute left-0 right-0 overflow-hidden", h, position === "top" ? "top-0" : "bottom-0", className)}>
      <motion.div
        className="h-full w-[200%]"
        style={{ background: grad, boxShadow: shadow }}
        animate={{ x: ["-50%", "0%"] }}
        transition={{ duration: dur, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
