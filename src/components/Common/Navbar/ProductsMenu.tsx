import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Package } from "lucide-react";

// ── Urunler Menusu (Basit - Sadece Link) ──────────────────────────────────────
// ── urunler Menusu (Basit - Sadece Link) ──────────────────────────────────────
export const ProductsMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[min(320px,calc(100vw-2rem))] z-50"
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative rounded-2xl overflow-hidden border backdrop-blur-2xl shadow-2xl bg-zinc-950/95 border-white/[0.08]">
            {/* Top orange line */}
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: "linear-gradient(90deg,transparent,#fb7185,#f97316,#fbbf24,transparent)" }} />

            <div className="p-4">
              <Link href="/products" onClick={onClose} prefetch={false}
                className="group flex items-center gap-3 p-4 rounded-xl transition-colors cursor-pointer hover:bg-white/[0.04]">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-orange-500/20 to-rose-500/20 border border-orange-500/20">
                  <Package className="w-5 h-5 text-orange-400" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="-display font-bold text-sm text-white">Tüm Ürünler</p>
                  <p className="text-zinc-500 text-xs mt-0.5">Web siteleri, uygulamalar ve daha fazlası</p>
                </div>
                <span className="transition-colors text-zinc-700 group-hover:text-zinc-400">→</span>
              </Link>
            </div>

            {/* Footer CTA */}
            <div className="border-t px-4 py-3 border-white/[0.05]">
              <Link href="/products" onClick={onClose} prefetch={false}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg text-zinc-950 bg-gradient-to-r from-rose-400 via-orange-400 to-yellow-400 hover:from-rose-300 hover:to-yellow-300 transition-all">
                <Package className="w-3 h-3" />
                Tüm Ürünleri gör
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
