"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Users, Trophy, CheckCircle, ArrowRight, Zap, Target,
  Monitor, Smartphone, Lock, BarChart2, Database, Cloud,
  GitBranch, Search, Palette, Server, Layers, Globe,
  Shield, Star, Building2, Award,
} from "lucide-react";
import { BRAND_COMPANY, BRAND_COLORS } from "@/config/brand.config";
import { teklifModal } from "@/components/Common/TeklifModal/TeklifModal";
import ParallaxHero from "@/components/Ui/ParallaxHero/ParallaxHero";
import type { CardItem } from "@/components/Ui/ScrollGrid3D/ScrollGrid3DCards";

const Scrollgrid3DCards = dynamic(
  () => import("@/components/Ui/ScrollGrid3D/ScrollGrid3DCards"),
  { ssr: false }
);

// ─── Veri ──────────────────────────────────────────────────────────────────

const expertiseCards: CardItem[] = [
  { icon: Globe,      color: BRAND_COLORS.secondary, href: "/hizmetler/web-yazilim-tasarim",   title: "Web Yazılım",         desc: "React, Next.js, Node.js ile hızlı ve ölçeklenebilir web uygulamaları." },
  { icon: Smartphone, color: BRAND_COLORS.primary, href: "/hizmetler/mobil-uygulama",        title: "Mobil Uygulama",      desc: "iOS ve Android için cross-platform yüksek performanslı çözümler." },
  { icon: Monitor,    color: BRAND_COLORS.gold, href: "/hizmetler/masaustu-yazilim",       title: "Masaüstü Yazılım",    desc: "Windows, macOS ve Linux için özellestirilmis masaüstü yazılımlar." },
  { icon: Lock,       color: "#34d399", href: "/hizmetler/siber-guvenlik",         title: "Siber güvenlik",      desc: "Pentest, güvenlik denetimi ve KVKK/gDPR uyum danısmanlıgı." },
  { icon: BarChart2,  color: BRAND_COLORS.accent, href: "/hizmetler/seo-dijital-pazarlama", title: "SEO & Dijital",       desc: "Organik trafik büyümesi için teknik SEO ve dijital pazarlama." },
  { icon: Layers,     color: "#c084fc", href: "/hizmetler/web-yazilim-tasarim",   title: "Özel Yazılım",        desc: "ERP, CRM ve kurumsal is akısları için tamamen özellestirilmis çözümler." },
  { icon: Database,   color: BRAND_COLORS.secondary,                                            title: "Veri Tabanı",         desc: "PostgreSQL, MongoDB, Redis ile yüksek performanslı veri yönetimi." },
  { icon: Cloud,      color: BRAND_COLORS.accent,                                            title: "Bulut & DevOps",      desc: "AWS, Docker, CI/CD pipeline kurulum ve yönetimi." },
  { icon: GitBranch,  color: BRAND_COLORS.primary,                                            title: "API & Entegrasyon",   desc: "REST, graphQL ve mikroservis mimarileri ile sistem entegrasyonları." },
  { icon: Search,     color: BRAND_COLORS.gold, href: "/hizmetler/seo-dijital-pazarlama", title: "Teknik SEO",          desc: "Core Web Vitals, yapısal veri ve teknik performans optimizasyonu." },
  { icon: Palette,    color: "#34d399",                                            title: "UI/UX Tasarım",       desc: "Kullanıcı odaklı, modern ve erisilebilir arayüz tasarımları." },
  { icon: Server,     color: "#c084fc",                                            title: "Sunucu Yönetimi",     desc: "VPS, dedicated sunucu kurulum, güvenlik ve bakım hizmetleri." },
];

const strengthCards: CardItem[] = [
  { icon: Trophy,      color: BRAND_COLORS.gold, badge: "15", title: "15 Yıllık Deneyim",   desc: "Sektörde 15 yılı askın tecrübeyle projelere stratejik bakıs açısı getiriyoruz." },
  { icon: Users,       color: BRAND_COLORS.secondary,              title: "Uzman Kadro",          desc: "Yazılım, güvenlik ve dijital pazarlama uzmanlarından olusan seçkin ekip." },
  { icon: Shield,      color: BRAND_COLORS.primary,              title: "güvenlik Öncelikli",   desc: "KVKK ve gDPR standartlarına uygun, güvenlik odaklı gelistirme pratigi." },
  { icon: Zap,         color: "#34d399",              title: "seffaf Süreç",         desc: "Düzenli raporlama, anlık iletisim ve seffaf proje yönetimi." },
  { icon: Target,      color: BRAND_COLORS.accent,              title: "Sonuç Odaklı",         desc: "Modern teknoloji altyapısıyla performanslı ve ölçülebilir sonuçlar." },
  { icon: CheckCircle, color: "#c084fc",              title: "Uzun Vadeli Destek",   desc: "Teslim sonrası teknik destek, bakım ve gelistirme hizmetleriyle yanınızdayız." },
];

const VALUES = [
  { icon: Award,      color: BRAND_COLORS.gold, title: "Kalite",     desc: "Her satır kod, teslim edilecek son ürün gibi yazılır. Standartın altı yoktur." },
  { icon: Users,      color: BRAND_COLORS.secondary, title: "Iletisim",   desc: "Projenizle ilgili her adımda seffaf, hızlı ve dogrudan iletisim." },
  { icon: Shield,     color: BRAND_COLORS.primary, title: "güvenlik",   desc: "güvenlik bir ek özellik degil, temel mimari prensibimizdir." },
  { icon: Building2,  color: "#34d399", title: "Sürdürülebilirlik", desc: "Ürettigimiz yazılım yıllar boyu bakımı kolay, genisletilebilir kalır." },
];

// ─── Alt bilesenler ─────────────────────────────────────────────────────────

const SectionHeader = ({
  title, subtitle, color = BRAND_COLORS.primary, isInView, delay = 0,
}: {
  title: string; subtitle?: string; color?: string; isInView: boolean; delay?: number;
}) => (
  <motion.div
    className="text-center mb-12"
    initial={{ opacity: 0, y: 24 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    <h2
      className="font-black tracking-tight mb-3"
      style={{
        fontSize: "clamp(1.75rem, 4vw, 3rem)",
        background: `linear-gradient(135deg, #fff 10%, ${color} 70%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        filter: `drop-shadow(0 0 20px ${color}40)`,
      }}
    >
      {title}
    </h2>
    <div className="flex justify-center mb-3">
      <div className="h-[1.5px] w-16 rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    </div>
    {subtitle && <p className="text-zinc-500 max-w-lg mx-auto text-sm leading-relaxed">{subtitle}</p>}
  </motion.div>
);

// ─── Ana bilesen ─────────────────────────────────────────────────────────────

export default function AboutPageClient() {
  const expertiseRef  = useRef(null);
  const strengthRef   = useRef(null);
  const missionRef    = useRef(null);
  const valuesRef     = useRef(null);
  const ctaRef        = useRef(null);

  const expertiseInView  = useInView(expertiseRef,  { once: true, amount: 0.1 });
  const strengthInView   = useInView(strengthRef,   { once: true, amount: 0.1 });
  const missionInView    = useInView(missionRef,    { once: true, amount: 0.15 });
  const valuesInView     = useInView(valuesRef,     { once: true, amount: 0.15 });
  const ctaInView        = useInView(ctaRef,        { once: true, amount: 0.3 });

  return (
    <div className="min-h-screen">

      {/* ══ PARALLAX HERO ══════════════════════════════════════════════ */}
      <ParallaxHero
        badge="Hakkımızda"
        badgeIcon={<Building2 className="w-3.5 h-3.5" />}
        title="XipSoft — 15 Yıllık Dijital Dönüsüm"
        subtitle="2010'dan bu yana web, mobil, masaüstü, siber güvenlik ve dijital pazarlama alanlarında 200'den fazla proje tamamladık. Her satır kod, güvenin bir parçasıdır."
        accentColor="#a78bfa"
        secondaryColor="#22d3ee"
        ctaPrimary={{ label: "Ücretsiz Teklif Al", onClick: () => teklifModal.open() }}
        ctaSecondary={{ label: "Iletisime geç", href: "/contact-us" }}
        stats={[
          { value: "15+", label: "Yıl Deneyim" },
          { value: "200+", label: "Proje" },
          { value: "150+", label: "Müsteri" },
          { value: "10+", label: "Ülke" },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ══ DEgERLERIMIZ ══════════════════════════════════════════════ */}
        <section ref={valuesRef} className="py-20 lg:py-28 border-t border-white/[0.05]">
          <SectionHeader
            title="Temel Degerlerimiz"
            subtitle="Her projede rehberimiz olan prensipler."
            color="#fbbf24"
            isInView={valuesInView}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  className="group relative"
                  initial={{ opacity: 0, y: 28, scale: 0.96 }}
                  animate={valuesInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.55, delay: 0.1 + i * 0.1 }}
                  whileHover={{ boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${v.color}20` }}
                >
                  <GlassCard
                    className="group relative p-6 transition-all duration-500 hover:-translate-y-1.5"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${v.color}10, transparent 70%)` }} />
                    <div className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                      style={{ background: `linear-gradient(90deg, transparent, ${v.color}cc, transparent)` }} />
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-400 group-hover:scale-105"
                      style={{ background: `${v.color}15`, border: `1px solid ${v.color}30` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: v.color }} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-black text-sm text-white mb-2">{v.title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">{v.desc}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ══ UZMANLIK ALANLARI ══════════════════════════════════════════ */}
        <section ref={expertiseRef} className="py-20 lg:py-28 border-t border-white/[0.05]">
          <SectionHeader
            title="Ne Yapıyoruz?"
            subtitle="12 farklı alanda kapsamlı teknoloji çözümleri."
            color={BRAND_COLORS.secondary}
            isInView={expertiseInView}
          />
          <Scrollgrid3DCards items={expertiseCards} columns={4} animType="type3" uniformColor={BRAND_COLORS.primary} />
        </section>

        {/* ══ NEDEN XIPSOFT ══════════════════════════════════════════════ */}
        <section ref={strengthRef} className="py-20 lg:py-28 border-t border-white/[0.05]">
          <SectionHeader
            title="Neden XipSoft?"
            subtitle="15 yıllık deneyimin güvencesiyle fark yaratan unsurlar."
            color={BRAND_COLORS.accent}
            isInView={strengthInView}
          />
          <Scrollgrid3DCards items={strengthCards} columns={3} animType="type1" uniformColor={BRAND_COLORS.accent} />
        </section>

        {/* ══ MISYON & VIZYON ══════════════════════════════════════════ */}
        <section ref={missionRef} className="py-20 lg:py-28 border-t border-white/[0.05]">
          <SectionHeader
            title="Misyon & Vizyon"
            subtitle="Bizi yönlendiren amaç ve hedefler."
            color={BRAND_COLORS.primary}
            isInView={missionInView}
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {[
              {
                icon: Target,
                title: "Misyonumuz",
                color: BRAND_COLORS.secondary,
                items: ["Kalite standartlarına baglı kalmak", "seffaf iletisim ve raporlama", "güvenlik odaklı gelistirme", "Sürekli iyilestirme prensibi", "Müsteri memnuniyetini önceliklendirmek"],
                text: "Müsterilerimizin dijital dönüsüm süreçlerini en verimli, güvenli ve sürdürülebilir sekilde yönetmelerine yardımcı olmak temel misyonumuzdur.",
              },
              {
                icon: Star,
                title: "Vizyonumuz",
                color: BRAND_COLORS.primary,
                items: ["Türkiye'nin en güvenilir teknoloji sirketi", "Bölgenin önde gelen is ortagı", "Sürdürülebilir teknoloji yatırımları", "gelecege hazırlayan çözümler", "Küresel ölçekte hizmet kalitesi"],
                text: "Türkiye'nin ve bölgenin en güvenilir yazılım sirketlerinden biri olarak müsterilerimizin ilk tercih ettigi teknoloji ortagı olmak.",
              },
            ].map((card, i) => {
              const CardIcon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  className="group relative p-8 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
                  style={{
                    background: "var(--color-card-bg)",
                    border: "1px solid var(--color-border)",
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={missionInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  whileHover={{ boxShadow: `0 8px 40px rgba(0,0,0,0.3), 0 0 0 1px ${card.color}20` }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse 80% 55% at 50% 0%, ${card.color}10, transparent 70%)` }} />
                  <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    style={{ background: `linear-gradient(90deg, transparent, ${card.color}cc, transparent)` }} />
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${card.color}15`, border: `1px solid ${card.color}30` }}>
                      <CardIcon className="w-5 h-5" style={{ color: card.color }} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-wide" style={{ color: card.color }}>
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-5 relative z-10">{card.text}</p>
                  <ul className="space-y-2 relative z-10">
                    {card.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-300">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: card.color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ══ CTA ═══════════════════════════════════════════════════════ */}
        <motion.section
          ref={ctaRef}
          className="py-20 mb-12 border-t border-white/[0.05]"
          initial={{ opacity: 0, y: 24 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div
            className="relative rounded-3xl p-10 md:p-16 text-center overflow-hidden"
            style={{
              background: "linear-gradient(160deg, rgba(167,139,250,0.08), rgba(255,255,255,0.03))",
              border: "1px solid rgba(167,139,250,0.18)",
            }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, rgba(167,139,250,0.10) 0%, transparent 70%)" }} />
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
              <div className="absolute w-[500px] h-[500px] rounded-full" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)", border: "1px solid rgba(167,139,250,0.30)" }} />
              <div className="absolute w-[340px] h-[340px] rounded-full" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)", border: "1px solid rgba(167,139,250,0.40)" }} />
            </div>
            <h2
              className="relative z-10 font-black text-3xl md:text-4xl mb-4"
              style={{
                background: "linear-gradient(135deg, #fff 15%, #a78bfa 60%, #22d3ee 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              gelecegi Birlikte Insa Edelim
            </h2>
            <p className="relative z-10 text-zinc-400 mt-4 max-w-2xl mx-auto leading-relaxed">
              Ister yeni bir girisim olun, ister kurumsal ölçekte faaliyet gösteren bir sirket — dijital dönüsüm yolculugunuzda güvenilir teknoloji partneriniz olmaya hazırız.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <button
                onClick={() => teklifModal.open()}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-zinc-950 transition-all hover:scale-[1.03] active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #a78bfa, #22d3ee)",
                  boxShadow: "0 0 24px rgba(167,139,250,0.45)",
                }}
              >
                Ücretsiz Teklif Al <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02]"
                style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.25)", color: "#a78bfa" }}
              >
                Iletisime geç
              </Link>
            </div>
          </div>
        </motion.section>

        {/* ══ ADRES ═════════════════════════════════════════════════════ */}
        <div className="pb-16 border-t border-zinc-800/50 pt-8 text-sm text-zinc-500 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-zinc-400 mb-2 text-xs uppercase tracking-widest font-mono">Adres</p>
            <p className="leading-relaxed">{BRAND_COMPANY.address}</p>
          </div>
          <div>
            <p className="font-semibold text-zinc-400 mb-2 text-xs uppercase tracking-widest font-mono">Iletisim</p>
            <p>info@xipsoft.net</p>
            <p>{BRAND_COMPANY.phone}</p>
            <p className="mt-1 text-zinc-600">{BRAND_COMPANY.workingHours}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
