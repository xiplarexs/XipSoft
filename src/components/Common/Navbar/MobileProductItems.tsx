import Link from "next/link";
import { Package } from "lucide-react";

// ── Mobile urun items (basit link) ──────────────────────────
export const MobileProductItems = ({ onClose }: { onClose: () => void }) => {
  return (
    <>
      <Link href="/products" onClick={onClose}
        className="flex items-center gap-3 py-2 text-left">
        <Package className="w-4 h-4 flex-shrink-0 text-cyan-400" strokeWidth={1.5} />
        <span className="text-zinc-400 text-sm hover:text-white transition-colors">Tüm Ürünler</span>
      </Link>
    </>
  );
};
