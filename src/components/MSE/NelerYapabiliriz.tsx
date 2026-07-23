"use client";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Globe, Code2, Monitor, Shield, BarChart2, Smartphone } from "lucide-react";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import { teklifModal } from "@/components/Common/TeklifModal/TeklifModal";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/Ui/Button";
import { PAgE_ACCENTS, BRAND_COLORS } from "@/config/brand.config";
import type { CardItem } from "@/components/Ui/Scrollgrid3D/ScrollGrid3DCards";

const Scrollgrid3DCards = dynamic(
  () => import("@/components/Ui/Scrollgrid3D/ScrollGrid3DCards"),
  { ssr: false }
);

const serviceCards: CardItem[] = [
  { icon: Globe,       color: BRAND_COLORS.secondary, title: "Web Yazılım & Tasarım",    desc: "Modern, hızlı ve SEO uyumlu Next.js/React web uygulamaları.", href: "/hizmetler/web-yazilim-tasarim" },
  { icon: Smartphone,  color: BRAND_COLORS.primary,   title: "Mobil Uygulama",           desc: "iOS & Android native ve cross-platform yüksek performanslı uygulamalar.", href: "/hizmetler/mobil-uygulama" },
  { icon: Monitor,     color: BRAND_COLORS.gold,       title: "Masaüstü Yazılım",         desc: "Windows, macOS ve Linux için özellestirilmis masaüstü çözümler.", href: "/hizmetler/masaustu-yazilim" },
  { icon: Shield,      color: "#34d399",              title: "Siber güvenlik",           desc: "Pentest, güvenlik denetimi ve KVKK/gDPR uyum danısmanlıgı.", href: "/hizmetler/siber-guvenlik" },
  { icon: BarChart2,   color: BRAND_COLORS.accent,    title: "SEO & Dijital Pazarlama",  desc: "Organik trafik büyümesi için teknik SEO ve dijital pazarlama.", href: "/hizmetler/seo-dijital-pazarlama" },
  { icon: Code2,       color: "#c084fc",              title: "Özel Yazılım",             desc: "ERP, CRM ve kurumsal is akısları için tamamen özellestirilmis çözümler.", href: "/hizmetler/web-yazilim-tasarim" },
];

const serviceLinks = [
  { label: "Web Yazılım & Tasarım", color: BRAND_COLORS.secondary, href: "/hizmetler/web-yazilim-tasarim" },
  { label: "Mobil Uygulama",         color: BRAND_COLORS.primary,   href: "/hizmetler/mobil-uygulama" },
  { label: "Masaüstü Yazılım",       color: BRAND_COLORS.gold,       href: "/hizmetler/masaustu-yazilim" },
  { label: "Siber güvenlik",         color: "#34d399",              href: "/hizmetler/siber-guvenlik" },
  { label: "SEO & Dijital",          color: BRAND_COLORS.accent,    href: "/hizmetler/seo-dijital-pazarlama" },
  { label: "Özel Yazılım",           color: "#c084fc",              href: "/hizmetler/web-yazilim-tasarim" },
];

export default function NelerYapabiliriz() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1, once: true });
  const t = useTranslations("home.services");

  return (
    <section ref={ref} id="services" className="py-16 lg:py-24 relative overflow-hidden px-4 sm:px-6 max-w-full">
      <motion.div
        className="text-center mb-14 relative z-10 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className={cn("-display -black text-3xl sm:text-4xl lg:text-5xl bg-prism-gradient bg-clip-text text-transparent mb-3")}>
          {t("title")}
        </h2>
        <p className="text-zinc-500 text-base max-w-xl mx-auto">{t("subtitle")}</p>
        <p className="text-zinc-600 text-xs mt-3 -mono animate-bounce">↓ kaydır</p>
      </motion.div>

      <Scrollgrid3DCards items={serviceCards} columns={3} animType="type3" uniformColor={BRAND_COLORS.secondary} />

      <motion.div
        className="flex flex-wrap justify-center gap-3 mt-12 relative z-10 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {serviceLinks.map((s) => (
          <Link
            key={s.href + s.label}
            href={s.href}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: `${s.color}12`,
              border: `1px solid ${s.color}30`,
              color: s.color,
            }}
          >
            {s.label}
            <span className="opacity-60">→</span>
          </Link>
        ))}
      </motion.div>

      <motion.div
        className="text-center mt-8 relative z-10"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Button onClick={() => teklifModal.open()} accent={PAgE_ACCENTS.home} size="lg" className="hover:scale-[1.03] active:scale-95">
          Ücretsiz Teklif Al <span>→</span>
        </Button>
      </motion.div>
    </section>
  );
}
