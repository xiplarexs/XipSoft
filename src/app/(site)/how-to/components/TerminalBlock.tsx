import { motion } from "motion/react";
import { cn } from "@/utils";
import type { TerminalLine } from "./types";

export const TerminalBlock = ({
  label,
  lines,
  color,
  isInView,
  delay = 0,
}: {
  label: string;
  lines: TerminalLine[];
  color: string;
  isInView: boolean;
  delay?: number;
}) => (
  <motion.div
    className={cn("rounded-2xl overflow-hidden", "bg-surface/80 backdrop-blur-sm", "border border-white/[0.06]")}
    initial={{ opacity: 0, y: 12 }}
    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
    transition={{ duration: 0.5, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
  >
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.04]">
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-prism-rose/60" />
        <div className="w-2 h-2 rounded-full bg-accent-gold/60" />
        <div className="w-2 h-2 rounded-full bg-prism-cyan/60" />
      </div>
      <span className="-mono text-[10px] text-zinc-600 ml-1">{label}</span>
    </div>
    <div className="px-4 py-4 space-y-1">
      {lines.map((line, i) => (
        <div key={i} className="flex items-start gap-2">
          {line.prompt && (
            <span className="-mono text-xs shrink-0" style={{ color: `${color}90` }}>$</span>
          )}
          <span
            className={cn("-mono text-xs leading-relaxed break-all", line.accent ? "" : "text-zinc-400")}
            style={line.accent ? { color: line.accent } : undefined}
          >
            {line.text || "\u00A0"}
          </span>
        </div>
      ))}
    </div>
  </motion.div>
);
