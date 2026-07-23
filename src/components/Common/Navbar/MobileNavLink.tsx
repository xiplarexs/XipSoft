import { motion } from "motion/react";
import MseLink from "@/components/Ui/MseLink/MseLink";
import { cn } from "@/utils";
import { navLabel } from "@/utils/latinize";

// ── Mobile nav link ───────────────────────────────────────────────────────────
export const MobileNavLink = ({ href, label, isActive, index, onClick, mm = "" }: {
  href: string; label: string; isActive: boolean; index: number; onClick: () => void; mm?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
    transition={{ delay: 0.05 + index * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
  >
    <MseLink href={href} className="group relative block py-1.5 sm:py-3">
      <span onClick={onClick} className="flex items-center gap-4">
        <span className="-mono text-xs text-zinc-600 tabular-nums">{String(index + 1).padStart(2, "0")}</span>
        <span className={cn(
          "-navbar text-[14px] xs:text-xl sm:text-3xl font-bold tracking-tight transition-all duration-300",
          isActive ? "bg-gradient-to-r from-rose-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent" : "text-zinc-400 group-hover:text-white",
          mm
        )}>{navLabel(label)}</span>
        {isActive && (
          <motion.span layoutId="mobile-active-dot" className="w-2 h-2 rounded-full"
            style={{ background: "linear-gradient(135deg,#22d3ee,#fb7185)" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />
        )}
      </span>
      <div className="absolute bottom-0 left-8 right-0 h-[1px] bg-white/5" />
    </MseLink>
  </motion.div>
);
