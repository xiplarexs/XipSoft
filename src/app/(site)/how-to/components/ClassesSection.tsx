import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { BookOpen } from "lucide-react";
import type { ClassItem } from "./types";

export const ClassesSection = ({ classes }: { classes: ClassItem[] }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2, once: true });

  return (
    <div ref={ref} className="py-8">
      <motion.div className="flex items-center gap-3 mb-8" initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: "linear-gradient(135deg, #22d3ee12, #a78bfa08)", border: "1px solid rgba(34,211,238,0.15)" }}>
          <BookOpen className="w-4 h-4 text-prism-cyan" />
        </div>
        <span className="-mono text-[11px] text-zinc-500 uppercase tracking-[0.2em]">Classes</span>
      </motion.div>

      <motion.h2 className="-display font-bold text-3xl md:text-4xl mb-2 bg-gradient-to-r from-prism-cyan via-prism-violet to-prism-rose bg-clip-text text-transparent" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.6, delay: 0.1 }}>
        Tech Classes
      </motion.h2>
      <motion.p className="-body text-sm text-zinc-500 mb-8 max-w-lg" initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }} transition={{ duration: 0.5, delay: 0.2 }}>
        Verified tech classes curated by the XipSoft community.
      </motion.p>

      {classes.length === 0 ? (
        <motion.div className="rounded-2xl border border-white/10 bg-surface/50 p-8 text-zinc-400" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 0.3 }}>
          No classes yet. Community listings will appear here soon.
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {classes.map((item, i) => (
            <motion.article key={item._id} className="rounded-2xl border border-white/[0.06] bg-surface/50 p-6 transition-colors hover:border-white/20" initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }} transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="-display text-xl font-semibold text-zinc-100">{item.title}</h3>
                    <span className="rounded-full border border-prism-cyan/30 bg-prism-cyan/10 px-3 py-0.5 text-xs font-medium text-prism-cyan">{item.status}</span>
                    <span className="rounded-full border border-white/15 px-3 py-0.5 text-xs font-medium text-zinc-300">{item.classType}</span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-2">{item.description}</p>
                  <p className="text-sm text-zinc-300 mb-3">Instructor: {item.instructorName}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/15 px-3 py-0.5 text-xs text-zinc-300">{tag}</span>
                    ))}
                  </div>
                </div>
                <a href={item.classLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full border border-prism-cyan/40 px-4 py-2 text-sm font-medium text-prism-cyan transition-colors hover:border-prism-cyan hover:bg-prism-cyan/10 shrink-0">
                  Official Link
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
};
