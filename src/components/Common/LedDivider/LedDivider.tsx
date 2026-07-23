"use client";

/**
 * LedDivider — İnce LED çizgisi + soldan sağa kayan beyaz ışık parlaması.
 * Her bölüm arası ve istenen her yerde kullanılabilir.
 */

import { motion } from "motion/react";

interface LedDividerProps {
  /** Üst/alt boşluk (px). Default 32 */
  spacing?: number;
  /** Çizgi opaklığı 0-1. Default 0.55 */
  lineOpacity?: number;
  /** Kayan ışık animasyon süresi (sn). Default 3.5 */
  speed?: number;
  /** Tekrar gecikmesi (sn). Default 2 */
  repeatDelay?: number;
}

export default function LedDivider({
  spacing = 32,
  lineOpacity = 0.55,
  speed = 3.5,
  repeatDelay = 2,
}: LedDividerProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: "100%",
        paddingTop: spacing,
        paddingBottom: spacing,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── LED taban çizgisi ── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 1,
          background: `linear-gradient(
            90deg,
            transparent 0%,
            rgba(34,211,238,${lineOpacity * 0.6}) 10%,
            rgba(148,163,184,${lineOpacity}) 30%,
            rgba(220,230,245,${lineOpacity}) 50%,
            rgba(148,163,184,${lineOpacity}) 70%,
            rgba(34,211,238,${lineOpacity * 0.6}) 90%,
            transparent 100%
          )`,
          boxShadow: `0 0 6px rgba(34,211,238,0.18)`,
          overflow: "visible",
        }}
      >
        {/* ── Kayan beyaz ışık parlaması ── */}
        <motion.div
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: 220,
            height: 14,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse 50% 100% at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 30%, rgba(200,230,255,0.18) 65%, transparent 100%)",
            filter: "blur(3px)",
            boxShadow:
              "0 0 18px 6px rgba(255,255,255,0.55), 0 0 40px 12px rgba(180,220,255,0.20)",
          }}
          initial={{ left: "-15%" }}
          animate={{ left: "115%" }}
          transition={{
            duration: speed,
            repeat: Infinity,
            repeatDelay,
            ease: "easeInOut",
          }}
        />

        {/* ── Küçük öncü nokta ── */}
        <motion.div
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "rgba(255,255,255,1)",
            boxShadow: "0 0 8px 3px rgba(200,230,255,0.90)",
          }}
          initial={{ left: "-5%" }}
          animate={{ left: "105%" }}
          transition={{
            duration: speed,
            repeat: Infinity,
            repeatDelay,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}
