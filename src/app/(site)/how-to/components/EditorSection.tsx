import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/utils";
import { FileEdit, ArrowRight } from "lucide-react";
import MseLink from "@/components/Ui/MseLink/MseLink";

export const EditorSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: true });

  return (
    <div ref={ref} className="py-8">
      <motion.div
        className={cn("relative overflow-hidden rounded-2xl p-8 md:p-12", "bg-surface/60 backdrop-blur-sm border border-white/[0.06]")}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: "linear-gradient(90deg, transparent, #fb7185, #a78bfa, transparent)" }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: "linear-gradient(135deg, #fb718512, #a78bfa08)", border: "1px solid rgba(251,113,133,0.15)" }}>
            <FileEdit className="w-4 h-4 text-prism-rose" />
          </div>
          <span className="-mono text-[11px] text-zinc-500 uppercase tracking-[0.2em]">Profile Editor</span>
        </div>
        <h2 className="-display font-bold text-3xl md:text-4xl mb-3 bg-gradient-to-r from-prism-rose via-prism-violet to-prism-cyan bg-clip-text text-transparent">
          Profile Editor
        </h2>
        <p className="-body text-sm text-zinc-500 mb-6 max-w-lg">
          Create or update your developer profile with our visual editor. No manual MDX editing required.
        </p>
        <MseLink
          href="/x/edit"
          className={cn(
            "group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full",
            "-display text-sm font-semibold text-white",
            "transition-all duration-300 hover:-translate-y-0.5",
            "hover:shadow-[0_12px_40px_-10px_rgba(251,113,133,0.35)]"
          )}
        >
          <span className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg, rgba(251,113,133,0.15), rgba(167,139,250,0.2), rgba(34,211,238,0.15))" }} />
          <span className="absolute inset-0 rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-300" style={{ padding: "1px", background: "linear-gradient(135deg, #fb718560, #a78bfa60, #22d3ee60)", WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
          <span className="relative z-10 flex items-center gap-2.5">
            <FileEdit className="w-4 h-4 text-prism-rose" />
            Open Editor
            <ArrowRight className="w-4 h-4 text-prism-cyan" />
          </span>
        </MseLink>
      </motion.div>
    </div>
  );
};
