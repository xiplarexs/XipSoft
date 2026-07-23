import { cn } from "@/utils";
import { Flame } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

export function HeroSection({ t, isMyanmar, mm }: { t: any; isMyanmar: boolean; mm: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="relative text-center pt-12 pb-16 px-4 overflow-visible">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-radial from-cyan-500/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      <motion.div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <Flame className="w-3.5 h-3.5 text-orange-400" />
        <span className="text-xs text-zinc-400 tracking-wide">{t("label")}</span>
      </motion.div>

      <motion.h1
        className={cn(
          "text-4xl md:text-5xl font-bold tracking-tight mb-4",
          isMyanmar
            ? "text-cyan-300 leading-[1.6] py-2"
            : "bg-gradient-to-r from-cyan-300 via-violet-400 to-rose-400 bg-clip-text text-transparent leading-[1.15]",
          mm
        )}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {t("title")}
      </motion.h1>

      <motion.p
        className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {t("subtitle", { count: 10 })}
      </motion.p>

      {/* Prismatic divider */}
      <motion.div
        className="mt-10 mx-auto h-px max-w-xs"
        style={{ background: "linear-gradient(90deg, transparent, #22d3ee, #a78bfa, #fb7185, transparent)" }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
    </section>
  );
}
