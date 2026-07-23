import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { cn } from "@/utils";
import { TerminalBlock } from "./TerminalBlock";
import { SubStepsBlock } from "./SubStepsBlock";
import { OptionToggle } from "./OptionToggle";
import { colorAt } from "./steps-data";
import type { StepData, TerminalData } from "./types";

export const StepCard = ({
  step,
  index,
  isLast,
  mm = "",
}: {
  step: StepData;
  index: number;
  isLast: boolean;
  mm?: string;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: true });
  const [activeOption, setActiveOption] = useState(0);
  const color = colorAt(index);
  const Icon = step.icon;
  const stepNum = index + 1;
  const currentOptionTerminal: TerminalData = step.optionToggle
    ? (step.optionToggle.terminals[activeOption] ?? step.optionToggle.terminals[0])
    : { label: "", lines: [] };

  return (
    <div ref={ref} className="relative flex gap-5 md:gap-8">
      <div className="flex flex-col items-center shrink-0">
        <motion.div
          className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full z-10"
          style={{ background: `linear-gradient(135deg, ${color}18, ${color}08)`, border: `2px solid ${color}40` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        >
          <span className="-display font-bold text-sm md:text-base" style={{ color }}>{stepNum}</span>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: `1px solid ${color}` }}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={inView ? { scale: 1.6, opacity: 0 } : { scale: 1, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>
        {!isLast && (
          <motion.div
            className="w-[2px] flex-1 min-h-[40px] origin-top"
            style={{ background: `linear-gradient(180deg, ${color}40, ${color}10)` }}
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </div>

      <motion.div
        className="flex-1 pb-10 md:pb-14"
        initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
        animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(4px)" }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background: `linear-gradient(135deg, ${color}12, ${color}06)`, border: `1px solid ${color}18` }}
            whileHover={{ rotate: 5, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Icon className="w-4 h-4" style={{ color }} />
          </motion.div>
          <h3 className={`-display font-bold text-lg md:text-xl text-zinc-100 ${mm}`}>{step.title}</h3>
        </div>

        <p className={`-body text-sm text-zinc-500 leading-relaxed mb-4 max-w-lg ${mm}`}>{step.description}</p>

        {step.optionToggle && (
          <OptionToggle labels={step.optionToggle.labels} active={activeOption} onToggle={setActiveOption} color={color ?? "#22d3ee"} />
        )}

        {step.subSteps ? (
          <SubStepsBlock subSteps={step.subSteps} color={color ?? "#22d3ee"} isInView={inView} mm={mm} />
        ) : step.optionToggle ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeOption}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <TerminalBlock label={currentOptionTerminal.label} lines={currentOptionTerminal.lines} color={color ?? "#22d3ee"} isInView={inView} delay={0} />
            </motion.div>
          </AnimatePresence>
        ) : (
          <TerminalBlock label={step.terminal.label} lines={step.terminal.lines} color={color ?? "#22d3ee"} isInView={inView} delay={0} />
        )}
      </motion.div>
    </div>
  );
};
