"use client";

// Işık konisi — clipPath YOK, saf blur+radial-gradient, sis gibi yumuşak beyaz ışık
import { motion } from "motion/react";

interface LampConeProps {
  intensity: number;
  coneW: number;
  coneH: number;
  ropeH: number;
  flicker: number;
}

export default function LampCone({ intensity: I, coneW, coneH, ropeH, flicker }: LampConeProps) {
  const top = ropeH + 28;

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: "50%",
        transform: "translateX(-50%)",
        width: coneW,
        height: coneH,
        pointerEvents: "none",
      }}
    >
      {/* ── Katman 1: geniş dış sis — en yumuşak, en geniş ── */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse 70% 100% at 50% 0%,
            rgba(255,210,100,${I * 0.32}) 0%,
            rgba(255,200,80,${I * 0.18}) 28%,
            rgba(255,180,60,${I * 0.08}) 55%,
            transparent 75%)`,
          filter: "blur(48px)",
        }}
        animate={{ opacity: [I * 0.85, I * 1.05, I * 0.90, I * 1.05] }}
        transition={{ duration: flicker, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Katman 2: orta sis — biraz daha yoğun merkez ── */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "65%",
          height: "80%",
          background: `radial-gradient(ellipse 55% 100% at 50% 0%,
            rgba(255,225,120,${I * 0.45}) 0%,
            rgba(255,210,100,${I * 0.22}) 35%,
            rgba(255,248,235,${I * 0.06}) 60%,
            transparent 80%)`,
          filter: "blur(32px)",
        }}
        animate={{ opacity: [I * 0.75, I * 0.98, I * 0.80, I * 0.96] }}
        transition={{ duration: flicker * 1.15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Katman 3: merkez yoğun ışık sütunu ── */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "32%",
          height: "65%",
          background: `radial-gradient(ellipse 40% 100% at 50% 0%,
            rgba(255,230,140,${I * 0.62}) 0%,
            rgba(255,210,100,${I * 0.32}) 30%,
            rgba(255,190,70,${I * 0.10}) 60%,
            transparent 80%)`,
          filter: "blur(18px)",
        }}
        animate={{ opacity: [I * 0.90, I * 1.08, I * 0.95] }}
        transition={{ duration: flicker * 0.9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Katman 4: ampul hemen altı — en parlak nokta ── */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "18%",
          height: "22%",
          background: `radial-gradient(ellipse 60% 100% at 50% 0%,
            rgba(255,235,130,${I * 0.95}) 0%,
            rgba(255,215,100,${I * 0.50}) 35%,
            transparent 70%)`,
          filter: "blur(10px)",
        }}
        animate={{ opacity: [I * 0.92, I * 1.08, I * 0.95] }}
        transition={{ duration: flicker * 0.75, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Katman 5: zemin sis hale yansıması ── */}
      <motion.div
        style={{
          position: "absolute",
          bottom: -10,
          left: "50%",
          transform: "translateX(-50%)",
          width: coneW * 0.85,
          height: 80,
          borderRadius: "50%",
          background: `radial-gradient(ellipse 60% 80% at 50% 40%,
            rgba(255,200,80,${I * 0.28}) 0%,
            rgba(255,180,60,${I * 0.14}) 50%,
            transparent 80%)`,
          filter: "blur(22px)",
        }}
        animate={{ opacity: [0.65, 1.05, 0.72, 1.05], scaleX: [1, 1.08, 0.96, 1] }}
        transition={{ duration: flicker * 1.3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
