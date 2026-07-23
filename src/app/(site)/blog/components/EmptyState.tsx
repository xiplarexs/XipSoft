"use client";

import { motion } from "motion/react";
import { PenLine } from "lucide-react";
import { useTranslations } from "next-intl";

export const EmptyState = ({ isInView, mm, t }: { isInView: boolean; mm: string; t: ReturnType<typeof useTranslations> }) => (
  <motion.div
    className="relative bg-surface/40 border border-white/[0.06] rounded-2xl py-20 px-8 text-center overflow-hidden"
    initial={{ opacity: 0, y: 30 }}
    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
    transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
  >
    {/* Background glow */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(167,139,250,0.04) 0%, transparent 70%)",
      }}
    />

    {/* Animated icon */}
    <motion.div
      className="relative mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #a78bfa10, #22d3ee08)",
        border: "1px solid rgba(167,139,250,0.15)",
      }}
      animate={{
        boxShadow: [
          "0 0 0px rgba(167,139,250,0)",
          "0 0 30px rgba(167,139,250,0.12)",
          "0 0 0px rgba(167,139,250,0)",
        ],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        animate={{ rotate: [0, -8, 8, -4, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <PenLine className="w-7 h-7 text-prism-violet" />
      </motion.div>

      {/* Orbiting dot */}
      <motion.div
        className="absolute w-full h-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
            boxShadow: "0 0 6px rgba(34,211,238,0.5)",
            top: -4,
            left: "50%",
            marginLeft: -3,
          }}
        />
      </motion.div>
    </motion.div>

    <h3 className={`-display text-xl font-bold text-zinc-300 mb-2 ${mm}`}>
      {t("noPostsTitle")}
    </h3>
    <p className={`-body text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed ${mm}`}>
      {t("noPostsBody")}
    </p>

    {/* Decorative line */}
    <motion.div
      className="mt-8 mx-auto h-[1px] max-w-[120px]"
      style={{
        background:
          "linear-gradient(90deg, transparent, #a78bfa40, transparent)",
      }}
      initial={{ scaleX: 0 }}
      animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
      transition={{ duration: 1, delay: 0.6 }}
    />
  </motion.div>
);
