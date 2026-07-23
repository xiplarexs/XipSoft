import { motion } from "motion/react";
import { cn } from "@/utils";

export const OptionToggle = ({
  labels,
  active,
  onToggle,
  color,
}: {
  labels: [string, string];
  active: number;
  onToggle: (i: number) => void;
  color: string;
}) => (
  <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit mb-3">
    {labels.map((label, i) => (
      <button
        key={label}
        onClick={() => onToggle(i)}
        className={cn(
          "relative px-4 py-1.5 rounded-lg -mono text-[11px] uppercase tracking-wider transition-colors duration-200",
          active === i ? "text-white" : "text-zinc-600 hover:text-zinc-400"
        )}
      >
        {active === i && (
          <motion.div
            layoutId="option-toggle-bg"
            className="absolute inset-0 rounded-lg"
            style={{ background: `linear-gradient(135deg, ${color}20, ${color}08)`, border: `1px solid ${color}30` }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10">{label}</span>
      </button>
    ))}
  </div>
);
