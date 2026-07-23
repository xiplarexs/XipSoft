"use client";

import { cn } from "@/utils";
import MseLink from "@/components/Ui/MseLink/MseLink";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslations } from "next-intl";
import { CheckCircle2, ArrowRight, ChevronRight } from "lucide-react";
import { HeroSection, StepCard, getSteps } from "./components";

/* ── Final CTA Section (matches HowToPageClient) ── */
 
function CtaSection({ stepCount, t, isMyanmar, mm }: { stepCount: number; t: any; isMyanmar: boolean; mm: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3, once: true });

  return (
    <div ref={ref} className="relative py-12 md:py-20">
      {/* Divider */}
      <motion.div
        className="h-[1px] mb-12 md:mb-16"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #22d3ee20 20%, #a78bfa30 50%, #fb718520 80%, transparent 100%)",
        }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      {/* CTA card */}
      <motion.div
        className={cn(
          "relative overflow-hidden rounded-2xl",
          "bg-surface/60 backdrop-blur-sm",
          "border border-white/[0.06]"
        )}
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.97 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Top prismatic accent line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background: "linear-gradient(90deg, transparent, #22d3ee, #a78bfa, #fb7185, transparent)",
          }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
        />

        {/* Corner radial accents */}
        <div
          className="absolute -top-20 -left-20 w-60 h-60 pointer-events-none opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #22d3ee, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-60 h-60 pointer-events-none opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #a78bfa, transparent 70%)" }}
        />

        <div className="relative z-10 px-6 py-10 md:px-12 md:py-14">
          {/* Completion terminal */}
          <motion.div
            className={cn(
              "mx-auto max-w-md mb-8 rounded-xl overflow-hidden",
              "bg-black/40 border border-white/[0.04]"
            )}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.04]">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <div className="w-2 h-2 rounded-full bg-green-500/60" />
              </div>
              <span className="-mono text-[10px] text-zinc-600 ml-1">
                {t("ctaComplete")}
              </span>
            </div>
            <div className="px-4 py-3 flex items-center gap-2">
              <motion.span
                className="text-cyan-400"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : { scale: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.6 }}
              >
                <CheckCircle2 className="w-4 h-4" />
              </motion.span>
              <span className={cn("-mono text-xs text-zinc-400", mm)}>
                {stepCount}/{stepCount} steps complete —
              </span>
              <span className={cn("-mono text-xs bg-gradient-to-r from-cyan-300 via-violet-400 to-rose-400 bg-clip-text text-transparent font-semibold", mm)}>
                Firebase ready!
              </span>
            </div>
          </motion.div>

          {/* Title + subtitle */}
          <div className="text-center mb-8">
            <motion.h2
              className="-display font-bold text-3xl md:text-4xl mb-3"
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-zinc-100">{t("ctaComplete")}</span>
            </motion.h2>
            <motion.p
              className="-body text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
            >
              {t("ctaDesc")}
            </motion.p>
          </div>

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
          >
            {/* Primary CTA */}
            <MseLink
              href="/how-to"
              className={cn(
                "group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full",
                "-display text-sm font-semibold text-white",
                "transition-all duration-300",
                "hover:-translate-y-0.5",
                "hover:shadow-[0_12px_40px_-10px_rgba(167,139,250,0.35)]"
              )}
            >
              {/* gradient background */}
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(167,139,250,0.2), rgba(251,113,133,0.15))",
                }}
              />
              {/* Border ring */}
              <span
                className="absolute inset-0 rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  padding: "1px",
                  background: "linear-gradient(135deg, #22d3ee60, #a78bfa60, #fb718560)",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />
              <span className="relative z-10 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t("ctaViewguide")}</span>
                <motion.span
                  className="inline-flex"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </motion.span>
              </span>
            </MseLink>

            {/* Secondary CTA */}
            <MseLink
              href="/"
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
              <span>{t("ctaOpenApp")}</span>
            </MseLink>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main Page ── */
export default function DevSetupClient() {
  const t = useTranslations("devSetup");
  const { } = useLanguage();
  const mm = "";

  const steps = getSteps(t);

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      <HeroSection t={t} isMyanmar={false} mm={mm} />

      {/* Steps timeline */}
      <div className="relative">
        {steps.map((step, i) => (
          <StepCard key={i} step={step} index={i} isLast={i === steps.length - 1} />
        ))}
      </div>

      <CtaSection stepCount={steps.length} t={t} isMyanmar={false} mm={mm} />
    </div>
  );
}
