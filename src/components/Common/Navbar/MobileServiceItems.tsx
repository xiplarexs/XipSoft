import Link from "next/link";
import { useTranslations } from "next-intl";
import { megaMenuItems } from "./constants";

// ── Mobile service items (hook kuralı için ayrı bilesen) ─────────────────────
export const MobileServiceItems = ({ onClose }: { onClose: () => void }) => {
  const t = useTranslations("nav.servicesMenu");
  return (
    <>
      {megaMenuItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.labelKey} href={item.href} onClick={onClose}
            className="flex items-center gap-3 py-2 text-left">
            <Icon className="w-4 h-4 flex-shrink-0" style={{ color: item.color }} strokeWidth={1.5} />
            <span className="text-zinc-400 text-sm hover:text-white transition-colors">{t(item.labelKey)}</span>
          </Link>
        );
      })}
    </>
  );
};
