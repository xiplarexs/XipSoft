"use client";
import { Trophy, ThumbsUp, MessageSquare, FolderOpen, Palette } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { BRAND_COLORS } from "@/config/brand.config";
import type { CardItem } from "@/components/Ui/ScrollGrid3D/ScrollGrid3DCards";

const Scrollgrid3DCards = dynamic(
  () => import("@/components/Ui/ScrollGrid3D/ScrollGrid3DCards"),
  { ssr: false }
);

const itemDefs = [
  { icon: Trophy,        color: BRAND_COLORS.gold,      titleKey: "experience",  descKey: "experienceDesc",  badge: "15" as const },
  { icon: ThumbsUp,      color: BRAND_COLORS.secondary, titleKey: "guarantee",   descKey: "guaranteeDesc" },
  { icon: MessageSquare, color: BRAND_COLORS.primary,   titleKey: "directComm",  descKey: "directCommDesc" },
  { icon: FolderOpen,    color: "#34d399",              titleKey: "sourceFiles", descKey: "sourceFilesDesc" },
  { icon: Palette,       color: BRAND_COLORS.accent,    titleKey: "identity",    descKey: "identityDesc" },
] as const;

export default function XipsoftFarki() {
  const t = useTranslations("home.xipsoftFark");

  const cards: CardItem[] = itemDefs.map((item) => ({
    icon: item.icon,
    color: item.color,
    title: t(item.titleKey),
    desc: t(item.descKey),
    badge: "badge" in item ? item.badge : undefined,
  }));

  return (
    <section className="xf-section relative py-16 lg:py-24 overflow-hidden">
      <div className="text-center mb-14 relative z-10 px-4">
        <h2 className="-display -black text-3xl sm:text-4xl lg:text-5xl bg-prism-gradient bg-clip-text text-transparent mb-3">
          {t("title")}
        </h2>
        <p className="text-zinc-300 text-sm font-semibold mb-2">{t("experience")}</p>
        <p className="text-zinc-500 text-base max-w-xl mx-auto">{t("subtitle")}</p>
      </div>

      <Scrollgrid3DCards items={cards} columns={5} animType="type3" uniformColor={BRAND_COLORS.gold} />
    </section>
  );
}
