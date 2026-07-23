"use client";

// Lamba gövdesi — kablo + metal sapka + parlayan ampul
import { motion } from "motion/react";

interface LampBodyProps {
  ropeH: number;
  intensity: number;
  flicker: number;
}

export default function LampBody({ ropeH, intensity: I, flicker }: LampBodyProps) {
  return (
    <>
      {/* ── Kablo ── */}
      <div
        style={{
          width: 2,
          height: ropeH,
          margin: "0 auto",
          background:
            "linear-gradient(180deg, rgba(200,200,210,0.55) 0%, rgba(130,130,145,0.35) 100%)",
        }}
      />

      {/* ── sapka + ampul ── */}
      <div style={{ position: "relative", width: 58, margin: "0 auto" }}>
        {/* Metal çan sapka */}
        <div
          style={{
            width: 58,
            height: 36,
            borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
            background:
              "linear-gradient(180deg, rgba(255,215,100,0.95) 0%, rgba(200,160,80,0.80) 55%, rgba(120,90,40,0.55) 100%)",
            boxShadow:
              "inset 0 3px 8px rgba(255,255,200,0.38), inset 0 -3px 6px rgba(0,0,0,0.50), 0 0 28px rgba(255,200,80,0.28)",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Speküler highlight */}
          <div
            style={{
              position: "absolute",
              top: 6,
              left: 9,
              width: 18,
              height: 9,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.38)",
              filter: "blur(3px)",
            }}
          />
          {/* Kenar gölgesi */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 10,
              background:
                "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.35) 100%)",
            }}
          />
        </div>

        {/* ── Ampul ── */}
        <motion.div
          style={{
            position: "absolute",
            bottom: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: `radial-gradient(circle,
              rgba(255,235,100,${I}) 0%,
              rgba(255,180,20,${I * 0.72}) 45%,
              transparent 100%)`,
            zIndex: 3,
          }}
          animate={{
            boxShadow: [
              `0 0 24px 8px  rgba(255,200,50,${I * 1.00}), 0 0 70px 24px rgba(255,150,0,${I * 0.65})`,
              `0 0 38px 14px rgba(255,220,80,${I * 1.15}), 0 0 110px 40px rgba(255,170,20,${I * 0.78})`,
              `0 0 24px 8px  rgba(255,200,50,${I * 1.00}), 0 0 70px 24px rgba(255,150,0,${I * 0.65})`,
            ],
          }}
          transition={{ duration: flicker, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </>
  );
}
