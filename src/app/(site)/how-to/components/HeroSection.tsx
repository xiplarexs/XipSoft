import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";

export const HeroSection = ({ stepCount, mm }: { stepCount: number; mm: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: true });
  const t = useTranslations("howTo");

  return (
    <div ref={ref} className="relative pt-8 pb-4 md:pt-12 md:pb-6">
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ background: "linear-gradient(135deg, #22d3ee12, #a78bfa08)", border: "1px solid rgba(34,211,238,0.15)" }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <BookOpen className="w-4 h-4 text-prism-cyan" />
        </motion.div>
        <span className={`-mono text-[11px] text-zinc-500 uppercase tracking-[0.2em] ${mm}`}>{t("label")}</span>
      </motion.div>

      <motion.div
        className={`relative mb-4 ${mm ? "" : "overflow-hidden"}`}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.1, delay: 0.1 }}
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.1) 50%, transparent 100%)" }}
          initial={{ x: "-100%" }}
          animate={inView ? { x: "200%" } : { x: "-100%" }}
          transition={{ duration: 1.2, delay: 0.6, ease: "easeInOut" }}
        />
        <motion.h1
          className={`-bold text-4xl sm:text-5xl md:text-6xl ${mm ? `${mm} leading-[1.6] py-2 text-prism-cyan` : "-display leading-[1.15] bg-gradient-to-r from-prism-cyan via-prism-violet to-prism-rose bg-clip-text text-transparent"}`}
          initial={{ y: 50, opacity: 0, filter: "blur(6px)" }}
          animate={inView ? { y: 0, opacity: 1, filter: "blur(0px)" } : { y: 50, opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {t("title")}
        </motion.h1>
      </motion.div>

      <motion.p
        className={`-body text-base text-zinc-500 max-w-lg leading-relaxed ${mm}`}
        initial={{ opacity: 0, y: 15 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
      >
        {t("subtitle", { count: stepCount })}
      </motion.p>

      <motion.div
        className="mt-8 h-[1px]"
        style={{ background: "linear-gradient(90deg, #22d3ee15, #a78bfa25, #fb718515, transparent 80%)" }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
      />
    </div>
  );
};
