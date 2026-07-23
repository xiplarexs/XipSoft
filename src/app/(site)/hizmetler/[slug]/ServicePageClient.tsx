"use client";
/**
 * ServicePageClient — Kurumsal hizmet detay sayfası
 * DB'den gelen veriyi parallax 3D tasarımla sunar
 */

import { useState } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef } from "react";
import {
  ChevronDown, ChevronUp, ArrowRight, CheckCircle, MessageCircle,
  Smartphone, Palette, Code, Zap, Shield, Layers, Globe, Database,
  Search, BarChart2, Monitor, Terminal, Cloud, Lock, Eye, FileCheck,
  AlertTriangle, Server, Brain, Bot, Workflow, Cpu, TrendingUp, Target,
  Users, MousePointer, GitBranch, RefreshCw, Code2, Link2, Webhook,
  GitMerge, PieChart, FileText, Filter, Package,
  type LucideIcon,
} from "lucide-react";
import { teklifModal } from "@/components/Common/TeklifModal/TeklifModal";
import ParallaxHero from "@/components/Ui/ParallaxHero/ParallaxHero";
import SectionReveal from "@/components/Ui/SectionReveal/SectionReveal";
import type { ServicePageData } from "@/lib/db-services";

// ─── Ikon haritası ─────────────────────────────────────────────────────────
const iconMap: Record<string, LucideIcon> = {
  Smartphone, Palette, Code, Zap, Shield, Layers, Globe, Database, Search,
  BarChart2, Monitor, Terminal, Cloud, Lock, Eye, FileCheck, AlertTriangle,
  Server, Brain, Bot, Workflow, Cpu, TrendingUp, Target, Users, MousePointer,
  GitBranch, RefreshCw, Code2, Link2, Webhook, GitMerge, PieChart, FileText,
  Filter, CheckCircle, ArrowRight, Package,
};
function getIcon(name: string): LucideIcon {
  return iconMap[name] || Globe;
}

// ─── Feature kartı ─────────────────────────────────────────────────────────
const FeatureCard = ({
  icon, title, description, color, index, isInView,
}: {
  icon: string; title: string; description: string;
  color: string; index: number; isInView: boolean;
}) => {
  const Icon = getIcon(icon);
  return (
    <motion.div
      className="group relative flex flex-col gap-4 p-6 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5"
      style={{
        background: "var(--color-card-bg)",
        backdropFilter: "blur(20px)",
        border: "1px solid var(--color-border)",
      }}
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay: 0.1 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        boxShadow: `0 8px 40px rgba(0,0,0,0.3), 0 0 0 1px ${color}25`,
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${color}12, transparent 70%)` }}
      />
      {/* Üst çizgi */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ background: `linear-gradient(90deg, transparent, ${color}cc, transparent)` }}
      />
      {/* Ikon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-400 group-hover:scale-105 relative"
        style={{
          background: `linear-gradient(135deg, ${color}20, ${color}0a)`,
          border: `1px solid ${color}30`,
        }}
      >
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-50 transition-opacity duration-400 blur-lg scale-[1.6] pointer-events-none"
          style={{ background: color }}
        />
        <Icon className="w-5 h-5 relative z-10" style={{ color }} strokeWidth={1.5} />
      </div>
      <p className="font-bold text-sm text-zinc-100 group-hover:text-white transition-colors leading-tight">{title}</p>
      <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors leading-relaxed mt-auto">{description}</p>
      <div
        className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-2xl pointer-events-none"
        style={{ background: color }}
      />
    </motion.div>
  );
};

// ─── Process adımı ─────────────────────────────────────────────────────────
const ProcessStep = ({
  step, title, description, color, index, isInView,
}: {
  step: string; title: string; description: string;
  color: string; index: number; isInView: boolean;
}) => (
  <motion.div
    className="relative flex gap-4"
    initial={{ opacity: 0, x: -24 }}
    animate={isInView ? { opacity: 1, x: 0 } : {}}
    transition={{ duration: 0.55, delay: 0.15 + index * 0.1 }}
  >
    {/* Baglantı çizgisi */}
    {index !== 0 && (
      <div
        className="absolute left-5 -top-6 w-[1px] h-6"
        style={{ background: `linear-gradient(180deg, transparent, ${color}40)` }}
      />
    )}
    {/* Numara */}
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 mt-0.5"
      style={{
        background: `linear-gradient(135deg, ${color}25, ${color}10)`,
        border: `1px solid ${color}40`,
        color,
        boxShadow: `0 0 16px ${color}20`,
      }}
    >
      {step}
    </div>
    <div className="flex-1 pb-6">
      <h4 className="font-bold text-sm text-zinc-100 mb-1.5">{title}</h4>
      <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

// ─── Fiyat paketi kartı ─────────────────────────────────────────────────────
const PackageCard = ({
  name, price, desc, color, popular, features, index, isInView,
}: {
  name: string; price: string; desc: string; color: string;
  popular?: boolean; features: string[]; index: number; isInView: boolean;
}) => (
  <motion.div
    className={`relative flex flex-col p-7 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 ${popular ? "ring-1" : ""}`}
    style={{
      background: popular ? `linear-gradient(160deg, ${color}15, var(--color-card-bg))` : "var(--color-card-bg)",
      border: popular ? `1px solid ${color}50` : "1px solid var(--color-border)",
    }}
    initial={{ opacity: 0, y: 28, scale: 0.97 }}
    animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
    transition={{ duration: 0.55, delay: 0.15 + index * 0.12 }}
  >
    {popular && (
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
    )}
    {popular && (
      <span
        className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
        style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}
      >
        Popüler
      </span>
    )}
    <h3 className="text-lg font-black text-white mb-1">{name}</h3>
    <div
      className="text-3xl font-black mb-1 mt-2"
      style={{ color, filter: `drop-shadow(0 0 12px ${color}50)` }}
    >
      {price}
    </div>
    <p className="text-xs text-zinc-500 mb-6">{desc}</p>
    <ul className="flex flex-col gap-2.5 flex-1 mb-6">
      {features.map((f, j) => (
        <li key={j} className="flex items-start gap-2 text-sm text-zinc-300">
          <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
          {f}
        </li>
      ))}
    </ul>
    <button
      onClick={() => teklifModal.open(name)}
      className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95"
      style={{
        background: popular
          ? `linear-gradient(135deg, ${color}, ${color}bb)`
          : "rgba(255,255,255,0.06)",
        color: popular ? "#09090b" : "rgba(255,255,255,0.8)",
        border: popular ? "none" : "1px solid rgba(255,255,255,0.10)",
        boxShadow: popular ? `0 0 20px ${color}35` : "none",
      }}
    >
      Teklif Al
    </button>
  </motion.div>
);

// ─── FAQ ögesi ──────────────────────────────────────────────────────────────
const FaqItem = ({
  question, answer, index, open, onToggle, accentColor,
}: {
  question: string; answer: string; index: number;
  open: boolean; onToggle: () => void; accentColor: string;
}) => (
  <motion.div
    className="rounded-xl overflow-hidden"
    style={{
      border: open ? `1px solid ${accentColor}30` : "1px solid rgba(255,255,255,0.07)",
      background: open ? `${accentColor}06` : "var(--color-card-bg)",
    }}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-zinc-200 hover:text-white transition-colors"
    >
      {question}
      <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
        <ChevronDown className="w-4 h-4 shrink-0 ml-3" style={{ color: accentColor }} />
      </motion.span>
    </button>
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <p className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed">
            {answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

// ─── Micro servis kartı ────────────────────────────────────────────────────
const MicroServiceCard = ({
  title, keywords, color, description, index, isInView,
}: {
  title: string; keywords: string[]; color: string;
  description: string; index: number; isInView: boolean;
}) => (
  <motion.div
    className="group p-6 rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-1"
    style={{
      background: "var(--color-card-bg)",
      border: "1px solid var(--color-border)",
    }}
    initial={{ opacity: 0, y: 24 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.5, delay: 0.1 + index * 0.09 }}
    whileHover={{ boxShadow: `0 4px 32px rgba(0,0,0,0.25), 0 0 0 1px ${color}20` }}
  >
    <h3 className="font-bold text-sm text-zinc-100 mb-2 leading-snug" style={{ color }}>
      {title}
    </h3>
    <p className="text-xs text-zinc-500 leading-relaxed mb-4">{description.substring(0, 220)}{description.length > 220 ? "…" : ""}</p>
    <div className="flex flex-wrap gap-1.5">
      {keywords.slice(0, 5).map((k) => (
        <span
          key={k}
          className="px-2 py-0.5 rounded-full text-[10px] font-medium"
          style={{
            background: `${color}0c`,
            border: `1px solid ${color}20`,
            color: `${color}cc`,
          }}
        >
          {k}
        </span>
      ))}
    </div>
  </motion.div>
);

// ─── Ana bilesen ────────────────────────────────────────────────────────────
export default function ServicePageClient({ service }: { service: ServicePageData }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const featuresRef  = useRef(null);
  const processRef   = useRef(null);
  const packagesRef  = useRef(null);
  const microRef     = useRef(null);
  const faqRef       = useRef(null);
  const ctaRef       = useRef(null);

  const featuresInView  = useInView(featuresRef,  { once: true, amount: 0.1 });
  const processInView   = useInView(processRef,   { once: true, amount: 0.15 });
  const packagesInView  = useInView(packagesRef,  { once: true, amount: 0.1 });
  const microInView     = useInView(microRef,     { once: true, amount: 0.1 });
  const faqInView       = useInView(faqRef,       { once: true, amount: 0.1 });
  const ctaInView       = useInView(ctaRef,       { once: true, amount: 0.3 });

  // Accent rengi — badge_color veya varsayılan
  const primaryColor = service.badgeColor?.replace("text-", "") === "cyan-400" ? "#22d3ee"
    : service.badgeColor?.replace("text-", "") === "emerald-400" ? "#34d399"
    : service.badgeColor?.replace("text-", "") === "violet-400" ? "#a78bfa"
    : service.badgeColor?.replace("text-", "") === "rose-400" ? "#fb7185"
    : "#a78bfa";

  const BadgeIcon = getIcon(service.badgeIcon);

  return (
    <div className="relative">

      {/* ══ HERO ═══════════════════════════════════════════════════════════ */}
      <div className="relative z-10">
      <ParallaxHero
        badge={service.badge}
        badgeIcon={<BadgeIcon className="w-3.5 h-3.5" />}
        title={service.title}
        subtitle={service.subtitle}
        accentColor={primaryColor}
        secondaryColor="#22d3ee"
        ctaPrimary={{ label: service.heroCta, onClick: () => teklifModal.open(service.title) }}
        ctaSecondary={{ label: "Bize Ulasın", href: "/contact-us" }}
        stats={service.stats}
        className="min-h-[70vh]"
      />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ══ ÖZELLIKLER ═════════════════════════════════════════════════ */}
        {service.features.length > 0 && (
          <SectionReveal
            title="Özellikler"
            subtitle="Sundugumuz temel özellikler ve avantajlar."
            accentColor={primaryColor}
            badge="Ne Sunuyoruz"
            badgeColor={primaryColor}
          >
            <div ref={featuresRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {service.features.map((f, i) => (
                <FeatureCard
                  key={i}
                  icon={typeof f.icon === "string" ? f.icon : "Globe"}
                  title={f.title}
                  description={f.description}
                  color={f.color}
                  index={i}
                  isInView={featuresInView}
                />
              ))}
            </div>
          </SectionReveal>
        )}

        {/* ══ TEKNOLOJILER ════════════════════════════════════════════════ */}
        {(service.techStack.length > 0 || (service.servicesTag && service.servicesTag.length > 0)) && (
          <SectionReveal
            title="Teknolojiler & Uzmanlıklar"
            accentColor={primaryColor}
            badge="Stack"
            badgeColor={primaryColor}
            topBorder
          >
            <div className="flex flex-wrap justify-center gap-2.5">
              {[...(service.techStack ?? []), ...(service.servicesTag ?? [])].map((t, i) => (
                <motion.span
                  key={i}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-default"
                  style={{
                    color: t.color,
                    border: `1px solid ${t.color}35`,
                    background: `${t.color}0c`,
                  }}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ scale: 1.06, background: `${t.color}18` }}
                >
                  {t.name}
                </motion.span>
              ))}
            </div>
          </SectionReveal>
        )}

        {/* ══ SÜREÇ ════════════════════════════════════════════════════════ */}
        {service.processSteps.length > 0 && (
          <SectionReveal
            title={service.processTitle || "Çalısma Sürecimiz"}
            subtitle={service.processDesc ?? "Projeden canlıya — adım adım seffaf süreç."}
            accentColor={primaryColor}
            badge="Nasıl Çalısıyoruz"
            badgeColor={primaryColor}
            topBorder
          >
            <div ref={processRef} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0 max-w-3xl mx-auto">
              {service.processSteps.map((p, i) => (
                <ProcessStep
                  key={i}
                  step={p.step}
                  title={p.title}
                  description={p.description}
                  color={p.color}
                  index={i}
                  isInView={processInView}
                />
              ))}
            </div>
          </SectionReveal>
        )}

        {/* ══ PAKETLER ════════════════════════════════════════════════════ */}
        {service.packages.length > 0 && (
          <SectionReveal
            title="Fiyat Paketleri"
            subtitle="Ihtiyacınıza uygun paketi seçin, hemen baslayalım."
            accentColor={primaryColor}
            badge="Fiyatlandırma"
            badgeColor={primaryColor}
            topBorder
          >
            <div ref={packagesRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {service.packages.map((p, i) => (
                <PackageCard
                  key={i}
                  name={p.name}
                  price={p.price}
                  desc={p.desc}
                  color={p.color}
                  popular={p.popular}
                  features={p.features}
                  index={i}
                  isInView={packagesInView}
                />
              ))}
            </div>
          </SectionReveal>
        )}

        {/* ══ MIKRO SERVISLER ════════════════════════════════════════════ */}
        {service.microServices.length > 0 && (
          <SectionReveal
            title="Hizmet Detayları"
            subtitle="Her alt baslık için derinlemesine bilgi."
            accentColor={primaryColor}
            badge="Detaylar"
            badgeColor={primaryColor}
            topBorder
          >
            <div ref={microRef} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {service.microServices.map((m, i) => (
                <MicroServiceCard
                  key={i}
                  title={m.title}
                  keywords={m.keywords}
                  color={m.color}
                  description={m.description}
                  index={i}
                  isInView={microInView}
                />
              ))}
            </div>
          </SectionReveal>
        )}

        {/* ══ SSS ════════════════════════════════════════════════════════ */}
        {service.faqItems.length > 0 && (
          <SectionReveal
            title={service.faqTitle || "Sıkça Sorulan Sorular"}
            accentColor={primaryColor}
            badge="SSS"
            badgeColor={primaryColor}
            topBorder
          >
            <div ref={faqRef} className="max-w-3xl mx-auto flex flex-col gap-2.5">
              {service.faqItems.map((faq, i) => (
                <FaqItem
                  key={i}
                  question={faq.question}
                  answer={faq.answer}
                  index={i}
                  open={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                  accentColor={primaryColor}
                />
              ))}
            </div>
          </SectionReveal>
        )}

        {/* ══ CTA ════════════════════════════════════════════════════════ */}
        <motion.section
          ref={ctaRef}
          className="py-20 mb-8"
          initial={{ opacity: 0, y: 24 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div
            className="relative rounded-3xl p-10 md:p-16 text-center overflow-hidden"
            style={{
              background: `linear-gradient(160deg, ${primaryColor}10, var(--color-card-bg))`,
              border: `1px solid ${primaryColor}20`,
            }}
          >
            {/* Dekor */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at center, ${primaryColor}12 0%, transparent 70%)` }}
            />
            {/* Halkalar */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              <div
                className="absolute w-[600px] h-[600px] rounded-full"
                style={{
                  left: "50%", top: "50%", transform: "translate(-50%,-50%)",
                  border: `1px solid ${primaryColor}30`,
                }}
              />
              <div
                className="absolute w-[400px] h-[400px] rounded-full"
                style={{
                  left: "50%", top: "50%", transform: "translate(-50%,-50%)",
                  border: `1px solid ${primaryColor}40`,
                }}
              />
            </div>

            <h2
              className="relative z-10 font-black text-3xl md:text-4xl mb-4"
              style={{
                background: `linear-gradient(135deg, #fff 20%, ${primaryColor} 80%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: `drop-shadow(0 0 24px ${primaryColor}40)`,
              }}
            >
              {service.ctaTitle}
            </h2>
            <p className="relative z-10 text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed">
              {service.ctaDesc}
            </p>
            <div className="relative z-10 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => teklifModal.open(service.title)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-zinc-950 transition-all hover:scale-[1.03] active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, #22d3ee)`,
                  boxShadow: `0 0 24px ${primaryColor}45`,
                }}
              >
                {service.ctaBtn} <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="https://wa.me/905444548444"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-[1.02]"
                style={{
                  background: "var(--color-card-bg)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
