import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/utils";
import { CheckCircle2, ArrowRight, ChevronRight, FileEdit } from "lucide-react";
import { useTranslations } from "next-intl";
import MseLink from "@/components/Ui/MseLink/MseLink";

export const CtaSection = ({ stepCount, mm }: { stepCount: number; mm: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: true });
  const t = useTranslations("howTo");

  return (
    <div ref={ref} className="relative py-12 md:py-20">
      <motion.div
        className="h-[1px] mb-12 md:mb-16"
        style={{ background: "linear-gradient(90deg, transparent 0%, #22d3ee20 20%, #a78bfa30 50%, #fb718520 80%, transparent 100%)" }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      <motion.div
        className={cn("relative overflow-hidden rounded-2xl", "bg-surface/60 backdrop-blur-sm", "border border-white/[0.06]")}
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.97 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: "linear-gradient(90deg, transparent, #22d3ee, #a78bfa, #fb7185, transparent)" }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
        />

        <div className="absolute -top-20 -left-20 w-60 h-60 pointer-events-none opacity-[0.07]" style={{ background: "radial-gradient(circle, #22d3ee, transparent 70%)" }} />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 pointer-events-none opacity-[0.05]" style={{ background: "radial-gradient(circle, #a78bfa, transparent 70%)" }} />

        <div className="relative z-10 px-6 py-10 md:px-12 md:py-14">
          <motion.div
            className={cn("mx-auto max-w-md mb-8 rounded-xl overflow-hidden", "bg-obsidian/60 border border-white/[0.04]")}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.04]">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-prism-rose/60" />
                <div className="w-2 h-2 rounded-full bg-accent-gold/60" />
                <div className="w-2 h-2 rounded-full bg-prism-cyan/60" />
              </div>
              <span className="-mono text-[10px] text-zinc-600 ml-1">{t("ctaComplete")}</span>
            </div>
            <div className="px-4 py-3 flex items-center gap-2">
              <motion.span className="text-prism-cyan" initial={{ scale: 0 }} animate={inView ? { scale: 1 } : { scale: 0 }} transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.6 }}>
                <CheckCircle2 className="w-4 h-4" />
              </motion.span>
              <span className={`-mono text-xs text-zinc-400 ${mm}`}>{t("ctaStepsComplete", { count: stepCount })}</span>
              <span className={`-mono text-xs bg-prism-gradient bg-clip-text text-transparent font-semibold ${mm}`}>{t("ctaProfileReady")}</span>
            </div>
          </motion.div>

          <div className="text-center mb-8">
            <motion.h2
              className="-display font-bold text-3xl md:text-4xl mb-3"
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className={`text-zinc-100 ${mm}`}>{t("ctaReadyTo")}</span>
              <span className={`bg-gradient-to-r from-prism-cyan via-prism-violet to-prism-rose bg-clip-text text-transparent ${mm}`}>{t("ctaContribute")}</span>
            </motion.h2>
            <motion.p
              className="-body text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
            >
              <span className={mm}>{t("ctaJoinPrefix")}</span>
              <span className="text-prism-violet font-medium">116+</span>
              <span className={mm}>{t("ctaJoinSuffix")}</span>
            </motion.p>
          </div>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
          >
            <MseLink href="/x/edit">
              <span className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(167,139,250,0.2), rgba(251,113,133,0.15))" }} />
              <span className="absolute inset-0 rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-300" style={{ padding: "1px", background: "linear-gradient(135deg, #22d3ee60, #a78bfa60, #fb718560)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
              <span className="relative z-10 flex items-center gap-2.5">
                <FileEdit className="w-4 h-4 text-prism-violet" />
                <span className={mm}>{t("ctaOpenEditor")}</span>
                <motion.span className="inline-flex" animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                  <ArrowRight className="w-4 h-4 text-prism-cyan" />
                </motion.span>
              </span>
            </MseLink>

            <MseLink
              href="/blog"
              className={cn(
                "group inline-flex items-center gap-2 px-7 py-3.5 rounded-full",
                "-display text-sm font-semibold",
                "text-zinc-400 hover:text-zinc-200",
                "bg-white/[0.02] border border-white/[0.08]",
                "hover:border-white/[0.15] hover:bg-white/[0.04]",
                "hover:-translate-y-0.5",
                "transition-all duration-300"
              )}
            >
              <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              <span className={mm}>{t("ctaViewProfiles")}</span>
            </MseLink>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
