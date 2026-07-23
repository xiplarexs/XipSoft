"use client";

// Tek bir lamba birimi — LampBody + LampCone
import { motion } from "motion/react";
import LampBody from "./LampBody";
import LampCone from "./LampCone";
import type { LampConfig } from "./lamps.data";

interface LampUnitProps {
  lamp: LampConfig;
  index: number;
}

export default function LampUnit({ lamp, index }: LampUnitProps) {
  const { xPct, ropeH, intensity, coneW, coneH, flicker } = lamp;

  return (
    <motion.div
      aria-hidden="true"
      className="absolute top-0"
      style={{ left: `${xPct}%`, transform: "translateX(-50%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, delay: index * 0.18, ease: "easeOut" }}
    >
      <LampBody ropeH={ropeH} intensity={intensity} flicker={flicker} />
      <LampCone
        intensity={intensity}
        coneW={coneW}
        coneH={coneH}
        ropeH={ropeH}
        flicker={flicker}
      />
    </motion.div>
  );
}
