import { motion } from "motion/react";
import { cn } from "@/utils";
import type { SubStepData } from "./types";

const subStepLetters = "abcdefghijklmnopqrstuvwxyz";

export const SubStepsBlock = ({
  subSteps,
  color,
  isInView,
  mm = "",
}: {
  subSteps: SubStepData[];
  color: string;
  isInView: boolean;
  mm?: string;
}) => (
  <div className="space-y-0">
    {subSteps.map((sub, i) => {
      const isLast = i === subSteps.length - 1;
      return (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center shrink-0 pt-1">
            <motion.div
              className="relative flex items-center justify-center w-6 h-6 rounded-full z-10"
              style={{ background: `linear-gradient(135deg, ${color}14, ${color}06)`, border: `1.5px solid ${color}30` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 + i * 0.1 }}
            >
              <span className="-mono text-[10px] font-bold" style={{ color }}>{subStepLetters[i]}</span>
            </motion.div>
            {!isLast && (
              <motion.div
                className="w-[1.5px] flex-1 min-h-[12px] origin-top"
                style={{ background: `linear-gradient(180deg, ${color}25, ${color}08)` }}
                initial={{ scaleY: 0 }}
                animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                transition={{ duration: 0.4, delay: 0.35 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </div>
          <motion.div
            className={cn("flex-1", isLast ? "" : "pb-3")}
            initial={{ opacity: 0, x: -8 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            transition={{ duration: 0.4, delay: 0.25 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className={cn("-mono text-[11px] text-zinc-500 mb-1.5 tracking-wide", mm)}>{sub.label}</p>
            <div className={cn("rounded-xl overflow-hidden", "bg-surface/60 backdrop-blur-sm", "border border-white/[0.04]")}>
              <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-white/[0.03]">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-prism-rose/40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-gold/40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-prism-cyan/40" />
                </div>
                <span className="-mono text-[9px] text-zinc-600 ml-0.5">{sub.terminal.label}</span>
              </div>
              <div className="px-3 py-2.5 space-y-0.5">
                {sub.terminal.lines.map((line, j) => (
                  <div key={j} className="flex items-start gap-1.5">
                    {line.prompt && (
                      <span className="-mono text-[11px] shrink-0" style={{ color: `${color}80` }}>$</span>
                    )}
                    <span
                      className={cn("-mono text-[11px] leading-relaxed break-all", line.accent ? "" : "text-zinc-400")}
                      style={line.accent ? { color: line.accent } : undefined}
                    >
                      {line.text || "\u00A0"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      );
    })}
  </div>
);
