import { navLabel } from "@/utils/latinize";
import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/utils";
import { Zap } from "lucide-react";
import { teklifModal } from "@/components/Common/TeklifModal/TeklifModal";
import { NavLink } from "./NavLink";
import { ProductsNavItem } from "./ProductsNavItem";
import { ServicesNavItem } from "./ServicesNavItem";

export const DesktopNav = ({ path, t, mm }: {
  path: string; t: (k: string) => string; mm: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Hizmetler veya Ürünler sayfasındayken ilgili item aktif kabul edilir
  const isServicesActive = path.startsWith("/hizmetler");
  const isProductsActive = path.startsWith("/products");

  const renderNavItem = (item: { index: number } & ({ type: "link"; href: string; labelKey: string; isActive: boolean; widthClass: string } | { type: "products" } | { type: "services" })) => {
    const isHovered = hoveredIndex === item.index;

    const isItemActive =
      (item.type === "link" && item.isActive) ||
      (item.type === "services" && isServicesActive) ||
      (item.type === "products" && isProductsActive);

    const anyHovered = hoveredIndex !== null;
    const shouldBlur = anyHovered ? !isHovered : false;
    const blurClass = shouldBlur ? "opacity-40 blur-[1.5px] scale-95" : "opacity-100 blur-0 scale-100";
    const transitionClass = "transition-all duration-300 ease-out";

    if (item.type === "link") {
      return (
        <div key={item.index} className={cn(blurClass, transitionClass)}>
          <NavLink
            href={item.href}
            label={t(item.labelKey)}
            isActive={item.isActive}
            index={item.index}
            widthClass={item.widthClass}
            mm={mm}
            onHover={(h) => setHoveredIndex(h ? item.index : null)}
          />
        </div>
      );
    }
    if (item.type === "products") {
      return (
        <div key={item.index} className={cn(blurClass, transitionClass)}
          onMouseEnter={() => setHoveredIndex(item.index)}
          onMouseLeave={() => setHoveredIndex(null)}>
          <ProductsNavItem index={item.index} mm={mm} />
        </div>
      );
    }
    return (
      <div key={item.index} className={cn(blurClass, transitionClass)}
        onMouseEnter={() => setHoveredIndex(item.index)}
        onMouseLeave={() => setHoveredIndex(null)}>
        <ServicesNavItem index={item.index} mm={mm} />
      </div>
    );
  };

  const leftItems = [
    { type: "link" as const, href: "/", labelKey: "home", isActive: path === "/", widthClass: "w-[5.5rem]", index: 0 },
    { type: "link" as const, href: "/about", labelKey: "about", isActive: path === "/about", widthClass: "w-[6.5rem]", index: 1 },
    { type: "link" as const, href: "/blog", labelKey: "blog", isActive: path === "/blog" || path.startsWith("/blog/"), widthClass: "w-[5rem]", index: 2 },
    { type: "products" as const, index: 3 },
  ];

  const rightItems = [
    { type: "link" as const, href: "/contact-us", labelKey: "contact", isActive: path === "/contact-us", widthClass: "w-[5.5rem]", index: 5 },
  ];

  return (
    <div className="hidden lg:flex flex-row items-center w-full">
      {/* Sol grup */}
      <div className="flex items-center gap-2 xl:gap-3 flex-1 justify-end">
        {leftItems.map(renderNavItem)}
      </div>

      {/* Orta — Hizmetler */}
      <div className="flex items-center justify-center px-3 xl:px-6">
        {renderNavItem({ type: "services" as const, index: 4 })}
      </div>

      {/* Sag grup */}
      <div className="flex items-center gap-2 xl:gap-3 flex-1">
        {rightItems.map(renderNavItem)}

        <div className="mx-2 h-4 w-px bg-gradient-to-b from-transparent via-white/[0.08] to-transparent" />

        <motion.button
          onClick={() => teklifModal.open()}
          className="relative flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-[13px] text-zinc-950 bg-gradient-to-r from-rose-400 via-orange-400 to-yellow-400 hover:from-rose-300 hover:via-orange-300 hover:to-yellow-300 transition-all hover:scale-105 active:scale-95 shadow-[0_0_16px_rgba(249,115,22,0.5)]"
          whileHover={{ boxShadow: "0 0 28px rgba(249,115,22,0.75), 0 0 8px rgba(251,191,36,0.4)" }}
        >
          <span className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
          <Zap className="w-3.5 h-3.5 relative z-10" />
          <span className="relative z-10">{navLabel(t("getQuote"))}</span>
        </motion.button>
      </div>
    </div>
  );
};
