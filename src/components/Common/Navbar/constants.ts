import { PRODUCTS } from "@/data/products";
import {
  Globe, Smartphone, Monitor, Shield, BarChart2,
} from "lucide-react";

// ── Nav linkleri ──────────────────────────────────────────────────────────────
export const linkKeys = [
  { key: "home",       href: "/" },
  { key: "about",      href: "/about" },
  { key: "blog",       href: "/blog" },
  { key: "services",   href: "/#services" },
  { key: "contact",    href: "/contact-us" },
] as const;

export const desktopNavWidthByKey: Record<string, string> = {
  home:     "w-[5.5rem]",
  about:    "w-[6.5rem]",
  blog:     "w-[5rem]",
  services: "w-[6rem]",
  contact:  "w-[5.5rem]",
};

// ── Mega Menu hizmet ögeleri ──────────────────────────────────────────────────
export const megaMenuItems = [
  { icon: Smartphone, color: "#a78bfa", labelKey: "web"      as const, descKey: "webDesc"      as const, service: "Web Yazılım & Tasarım",    href: "/hizmetler/web-yazilim-tasarim" },
  { icon: Globe,      color: "#22d3ee", labelKey: "mobile"   as const, descKey: "mobileDesc"   as const, service: "Mobil Uygulama",            href: "/hizmetler/mobil-uygulama" },
  { icon: Monitor,    color: "#fbbf24", labelKey: "desktop"  as const, descKey: "desktopDesc"  as const, service: "Masaüstü Yazılım",          href: "/hizmetler/masaustu-yazilim" },
  { icon: Shield,     color: "#34d399", labelKey: "security" as const, descKey: "securityDesc" as const, service: "Siber güvenlik",            href: "/hizmetler/siber-guvenlik" },
  { icon: BarChart2,  color: "#fb7185", labelKey: "seo"      as const, descKey: "seoDesc"      as const, service: "SEO & Dijital Pazarlama",   href: "/hizmetler/seo-dijital-pazarlama" },
] as const;

// ── urunleri kategoriye göre grupla ─────────────────────────────────────────────
export const groupedProducts = PRODUCTS.reduce(
  (acc, product) => {
    const category = product.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  },
  {} as Record<string, typeof PRODUCTS>
);

export const sparkleDriftX = [-10, 8, 14] as const;
