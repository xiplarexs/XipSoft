import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { MegaMenu } from "./MegaMenu";
import { navLabel } from "@/utils/latinize";

// ── Services dropdown trigger ─────────────────────────────────────────────────
export const ServicesNavItem = ({ index, mm = "" }: { index: number; mm?: string }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations("nav");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <motion.button
        className="relative inline-flex items-center gap-1 whitespace-nowrap -navbar text-[13px] font-extrabold uppercase tracking-[0.1em] py-2 px-3 transition-all duration-300 bg-white/[0.12] border border-white/[0.20] rounded-full text-white shadow-[0_8px_30px_rgba(255,255,255,0.08)]"
        style={open ? { filter: "drop-shadow(0 0 8px rgba(249,115,22,0.6))" } : undefined}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
      >
        <span className={mm}>{navLabel(t("services"))}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.span>
      </motion.button>
      <div onMouseLeave={() => setOpen(false)}>
        <MegaMenu isOpen={open} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
};
