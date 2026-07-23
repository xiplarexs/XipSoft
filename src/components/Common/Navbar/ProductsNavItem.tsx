import { motion } from "motion/react";
import MseLink from "@/components/Ui/MseLink/MseLink";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import { navLabel } from "@/utils/latinize";

// ── urunler Linki (Basit - Direkt Link) ──────────────────────────────────────
export const ProductsNavItem = ({ index, mm = "" }: { index: number; mm?: string }) => {
  const t = useTranslations("nav");
  return (
    <motion.div
      data-nav-link
    >
      <MseLink href="/products" className={cn(
        "relative inline-flex items-center justify-center whitespace-nowrap -navbar text-[13px] font-extrabold uppercase tracking-[0.1em] py-2 px-1 transition-all duration-300",
        "text-zinc-300",
        mm
      )}>
        <span className="relative z-10">{navLabel(t("products"))}</span>
      </MseLink>
    </motion.div>
  );
};
