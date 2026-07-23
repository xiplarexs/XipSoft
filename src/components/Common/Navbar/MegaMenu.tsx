import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { megaMenuItems } from "./constants";

// ── Mega Menu ─────────────────────────────────────────────────────────────────
export const MegaMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const t = useTranslations("nav.servicesMenu");
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[min(640px,calc(100vw-2rem))] z-50"
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative rounded-2xl overflow-hidden border backdrop-blur-2xl shadow-2xl bg-zinc-950/95 border-white/[0.08]">
            {/* Top orange line */}
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: "linear-gradient(90deg,transparent,#fb7185,#f97316,#fbbf24,transparent)" }} />

            <div className="p-4 grid grid-cols-1 gap-1">
              {megaMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.labelKey} href={item.href} onClick={onClose} prefetch={false}
                    className="group flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer hover:bg-white/[0.04]">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${item.color}15`, border: `1px solid ${item.color}20` }}>
                      <Icon className="w-4 h-4" style={{ color: item.color }} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="-display font-bold text-sm text-white group-hover:text-zinc-100">{t(item.labelKey)}</p>
                      <p className="text-xs mt-0.5 leading-relaxed text-zinc-500">{t(item.descKey)}</p>
                    </div>
                    <span className="transition-colors text-xs mt-1 text-zinc-700 group-hover:text-zinc-400">→</span>
                  </Link>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t px-4 py-2.5 border-white/[0.05]">
              <span className="text-xs -mono text-zinc-600">15 yıllık tecrube ile</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
